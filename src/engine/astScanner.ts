import fs from "fs";
import path from "path";
import { CallSite, AffectedTest } from "../types/migration.js";

export function scanCallSites(dirPath: string): CallSite[] {
  const callSites: CallSite[] = [];
  if (!fs.existsSync(dirPath)) return callSites;

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const normalized = fullPath.replace(/\\/g, "/");

      if (
        normalized.includes("/dist/") ||
        normalized.includes("/build/") ||
        normalized.includes("/artifacts/") ||
        normalized.includes("/node_modules/")
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) &&
        !entry.name.endsWith(".d.ts") &&
        !entry.name.endsWith(".js") &&
        !entry.name.endsWith(".map")
      ) {
        scanFileForCallSites(fullPath, callSites);
      }
    }
  }

  walk(dirPath);
  return callSites;
}

function scanFileForCallSites(filePath: string, callSites: CallSite[]) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const normalizedPath = filePath.replace(/\\/g, "/");

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("/*")) return;

    if (
      line.includes("/api/orders/") ||
      line.includes("getOrder") ||
      line.includes("fetchOrderDetails") ||
      line.includes("fetchOrderSummary") ||
      line.includes("calculateOrderTax") ||
      line.includes("validateOrderMinimum") ||
      line.includes("verifyOrderSummary") ||
      line.includes(".total")
    ) {
      callSites.push({
        file: normalizedPath,
        line: index + 1,
        snippet: trimmed,
        endpoint: "GET /api/orders/{id}",
      });
    }

    if (
      (line.includes("/api/orders") && !line.includes("/api/orders/")) ||
      line.includes("createOrder") ||
      line.includes("submitNewOrder") ||
      line.includes("placeOrder") ||
      line.includes("processCheckout") ||
      line.includes("customer_id")
    ) {
      callSites.push({
        file: normalizedPath,
        line: index + 1,
        snippet: trimmed,
        endpoint: "POST /api/orders",
      });
    }
  });
}

export function scanAffectedTests(testDirPath: string): AffectedTest[] {
  const affectedTests: AffectedTest[] = [];
  if (!fs.existsSync(testDirPath)) return affectedTests;

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const normalized = fullPath.replace(/\\/g, "/");

      if (
        normalized.includes("/dist/") ||
        normalized.includes("/build/") ||
        normalized.includes("/artifacts/") ||
        normalized.includes("/node_modules/")
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".test.ts") || entry.name.endsWith(".spec.ts") || entry.name.endsWith(".test.tsx")) &&
        !entry.name.endsWith(".d.ts") &&
        !entry.name.endsWith(".js")
      ) {
        scanTestFile(fullPath, affectedTests);
      }
    }
  }

  walk(testDirPath);
  return affectedTests;
}

function scanTestFile(filePath: string, affectedTests: AffectedTest[]) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const normalizedPath = filePath.replace(/\\/g, "/");

  let currentTestName: string | null = null;
  let currentEndpoints = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const itMatch = line.match(/(?:it|test)\s*\(\s*["']([^"']+)["']/);

    if (itMatch) {
      if (currentTestName && currentEndpoints.size > 0) {
        for (const ep of currentEndpoints) {
          affectedTests.push({
            file: normalizedPath,
            testName: currentTestName,
            associatedEndpoint: ep,
          });
        }
      }
      currentTestName = itMatch[1];
      currentEndpoints = new Set<string>();
    }

    if (currentTestName) {
      if (
        line.includes("/api/orders/") ||
        line.includes("getOrder") ||
        line.includes("fetchOrderSummary") ||
        line.includes("calculateOrderTax") ||
        line.includes("validateOrderMinimum") ||
        line.includes("response.total") ||
        line.includes("summary.total")
      ) {
        currentEndpoints.add("GET /api/orders/{id}");
      }
      if (
        (line.includes("/api/orders") && !line.includes("/api/orders/")) ||
        line.includes("createOrder") ||
        line.includes("placeOrder") ||
        line.includes("customer_id")
      ) {
        currentEndpoints.add("POST /api/orders");
      }
    }
  }

  if (currentTestName && currentEndpoints.size > 0) {
    for (const ep of currentEndpoints) {
      affectedTests.push({
        file: normalizedPath,
        testName: currentTestName,
        associatedEndpoint: ep,
      });
    }
  }
}
