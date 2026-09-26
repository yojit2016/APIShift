import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { diffOpenAPISpecs } from "../src/engine/openapiDiff.js";
import { scanCallSites, scanAffectedTests } from "../src/engine/astScanner.js";
import { clusterFailures } from "../src/engine/failureClusterer.js";

describe("APIShift Engine Modules", () => {
  it("Module A: diffOpenAPISpecs detects breaking changes between before.yaml and after.yaml", () => {
    const beforeYaml = fs.readFileSync("contracts/before.yaml", "utf-8");
    const afterYaml = fs.readFileSync("contracts/after.yaml", "utf-8");

    const impacts = diffOpenAPISpecs(beforeYaml, afterYaml);
    expect(impacts.length).toBeGreaterThan(0);

    const totalRenamed = impacts.find(
      (imp) => imp.changedEndpoint.includes("GET /api/orders/{id}") && imp.diffDetail.includes("total")
    );
    expect(totalRenamed).toBeDefined();
    expect(totalRenamed?.changeType).toBe("schema-change");

    const customerUnflattened = impacts.find(
      (imp) => imp.changedEndpoint.includes("POST /api/orders") && imp.diffDetail.includes("customer_id")
    );
    expect(customerUnflattened).toBeDefined();
    expect(customerUnflattened?.changeType).toBe("schema-change");
  });

  it("Module B: scanCallSites identifies call sites in demo-repo/src", () => {
    const callSites = scanCallSites("demo-repo/src");
    expect(callSites.length).toBeGreaterThan(0);

    const getSites = callSites.filter((cs) => cs.endpoint === "GET /api/orders/{id}");
    const postSites = callSites.filter((cs) => cs.endpoint === "POST /api/orders");

    expect(getSites.length).toBeGreaterThan(0);
    expect(postSites.length).toBeGreaterThan(0);
  });

  it("Module B: scanAffectedTests identifies affected tests in demo-repo/tests", () => {
    const affectedTests = scanAffectedTests("demo-repo/tests");
    expect(affectedTests.length).toBeGreaterThan(0);
  });

  it("Module C: clusterFailures clusters raw test failures by endpoint and root cause", () => {
    const rawFailures = [
      { testName: "Probe 01", errorMessage: "AssertionError: expected undefined to be a number" },
      { testName: "Probe 08", errorMessage: "Cannot read property 'total' of undefined" },
      { testName: "Probe 18", errorMessage: "ValidationError: Missing required nested field customer.id" },
    ];

    const report = clusterFailures(rawFailures);
    expect(report.summary.totalFailingBefore).toBe(3);
    expect(report.clusters.length).toBe(2);

    const getCluster = report.clusters.find((c) => c.endpoint === "GET /api/orders/{id}");
    expect(getCluster).toBeDefined();
    expect(getCluster?.failingTests).toContain("Probe 01");

    const postCluster = report.clusters.find((c) => c.endpoint === "POST /api/orders");
    expect(postCluster).toBeDefined();
    expect(postCluster?.failingTests).toContain("Probe 18");
  });
});
