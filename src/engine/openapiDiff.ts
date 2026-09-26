import { parse } from "yaml";
import { ImpactMap } from "../types/migration.js";

export interface SchemaDiff {
  endpoint: string;
  method: string;
  changeType: "schema-change" | "path-rename" | "param-added";
  diffDetail: string;
}

export function parseSpec(content: string): any {
  return parse(content);
}

export function diffOpenAPISpecs(beforeContent: string, afterContent: string): ImpactMap[] {
  const beforeSpec = parseSpec(beforeContent);
  const afterSpec = parseSpec(afterContent);

  const impacts: ImpactMap[] = [];

  const beforePaths = beforeSpec.paths || {};
  const afterPaths = afterSpec.paths || {};

  // Check existing paths in beforeSpec
  for (const [path, beforeItem] of Object.entries<any>(beforePaths)) {
    const afterItem = afterPaths[path];
    if (!afterItem) {
      impacts.push({
        changedEndpoint: path,
        changeType: "path-rename",
        diffDetail: `Path '${path}' was removed or renamed`,
        callSites: [],
        affectedTests: [],
      });
      continue;
    }

    const methods = ["get", "post", "put", "delete", "patch"];
    for (const method of methods) {
      if (!beforeItem[method]) continue;
      const beforeOp = beforeItem[method];
      const afterOp = afterItem[method];
      const endpoint = `${method.toUpperCase()} ${path}`;

      if (!afterOp) {
        impacts.push({
          changedEndpoint: endpoint,
          changeType: "path-rename",
          diffDetail: `Operation '${endpoint}' was removed`,
          callSites: [],
          affectedTests: [],
        });
        continue;
      }

      // 1. Compare parameters
      const beforeParams = beforeOp.parameters || [];
      const afterParams = afterOp.parameters || [];
      const beforeParamNames = new Set(beforeParams.map((p: any) => p.name));
      for (const ap of afterParams) {
        if (ap.required && !beforeParamNames.has(ap.name)) {
          impacts.push({
            changedEndpoint: endpoint,
            changeType: "param-added",
            diffDetail: `Required parameter '${ap.name}' added to '${endpoint}'`,
            callSites: [],
            affectedTests: [],
          });
        }
      }

      // 2. Compare response schemas (e.g. GET 200)
      const before200 = beforeOp.responses?.["200"]?.content?.["application/json"]?.schema;
      const after200 = afterOp.responses?.["200"]?.content?.["application/json"]?.schema;
      if (before200 && after200) {
        const beforeProps = before200.properties || {};
        const afterProps = after200.properties || {};

        for (const prop of Object.keys(beforeProps)) {
          if (!afterProps[prop]) {
            // Check if renamed
            const renamedTo = Object.keys(afterProps).find(
              (p) => p.toLowerCase().includes(prop.toLowerCase()) || prop.toLowerCase().includes(p.toLowerCase())
            );
            const detail = renamedTo
              ? `Response property '${prop}' renamed to '${renamedTo}'`
              : `Response property '${prop}' removed`;
            impacts.push({
              changedEndpoint: endpoint,
              changeType: "schema-change",
              diffDetail: detail,
              callSites: [],
              affectedTests: [],
            });
          }
        }
      }

      // 3. Compare request body schemas (e.g. POST)
      const beforeReq = beforeOp.requestBody?.content?.["application/json"]?.schema;
      const afterReq = afterOp.requestBody?.content?.["application/json"]?.schema;
      if (beforeReq && afterReq) {
        const beforeProps = beforeReq.properties || {};
        const afterProps = afterReq.properties || {};

        for (const prop of Object.keys(beforeProps)) {
          if (!afterProps[prop]) {
            // Check if unflattened into object (e.g. customer_id -> customer.id)
            let unflattenedDetail = `Request body property '${prop}' removed`;
            if (prop.includes("_")) {
              const [prefix] = prop.split("_");
              if (afterProps[prefix] && afterProps[prefix].type === "object") {
                unflattenedDetail = `Request body property '${prop}' unflattened to '${prefix}.id'`;
              }
            }
            impacts.push({
              changedEndpoint: endpoint,
              changeType: "schema-change",
              diffDetail: unflattenedDetail,
              callSites: [],
              affectedTests: [],
            });
          }
        }
      }
    }
  }

  return impacts;
}
