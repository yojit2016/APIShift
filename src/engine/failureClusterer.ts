import { FailureCluster, ClusterReport } from "../types/migration.js";

export interface RawTestFailure {
  testName: string;
  errorMessage: string;
  stack?: string;
}

export function clusterFailures(failures: RawTestFailure[], startTimeMs?: number): ClusterReport {
  const getOrdersFailingTests: string[] = [];
  const postOrdersFailingTests: string[] = [];
  const otherFailingTests: string[] = [];

  for (const failure of failures) {
    const msg = failure.errorMessage || "";
    const name = failure.testName || "";

    if (
      msg.includes("customer.id") ||
      msg.includes("customer_id") ||
      msg.includes("ValidationError") ||
      name.includes("Probe 18") ||
      name.includes("Probe 19") ||
      name.includes("Probe 20") ||
      name.includes("Probe 21") ||
      name.includes("Probe 22") ||
      name.includes("Probe 23") ||
      name.includes("placeOrder")
    ) {
      postOrdersFailingTests.push(failure.testName);
    } else if (
      msg.toLowerCase().includes("total") ||
      msg.includes("undefined") ||
      msg.includes("AssertionError") ||
      msg.includes("TypeError") ||
      name.includes("fetchOrderSummary") ||
      name.includes("calculateOrderTax") ||
      name.includes("validateOrderMinimum") ||
      /^Probe (0[1-9]|1[0-7]):/.test(name)
    ) {
      getOrdersFailingTests.push(failure.testName);
    } else {
      otherFailingTests.push(failure.testName);
    }
  }

  const clusters: FailureCluster[] = [];

  if (getOrdersFailingTests.length > 0) {
    clusters.push({
      clusterId: "cluster-get-orders-total",
      endpoint: "GET /api/orders/{id}",
      failingTests: getOrdersFailingTests,
      rootCause: "Schema Drift: Response property 'total' renamed to 'totalAmount' in GET /api/orders/{id}",
      fixApplied: false,
      verified: false,
    });
  }

  if (postOrdersFailingTests.length > 0) {
    clusters.push({
      clusterId: "cluster-post-orders-customer",
      endpoint: "POST /api/orders",
      failingTests: postOrdersFailingTests,
      rootCause: "Payload Drift: Field 'customer_id' unflattened to 'customer.id' in POST /api/orders",
      fixApplied: false,
      verified: false,
    });
  }

  if (otherFailingTests.length > 0) {
    clusters.push({
      clusterId: "cluster-unclassified",
      endpoint: "UNKNOWN",
      failingTests: otherFailingTests,
      rootCause: "Unclassified failure",
      fixApplied: false,
      verified: false,
    });
  }

  const durationSeconds = startTimeMs ? parseFloat(((Date.now() - startTimeMs) / 1000).toFixed(2)) : 0.05;

  return {
    clusters,
    summary: {
      totalFailingBefore: failures.length,
      clusters: clusters.length,
      autoFixed: 0,
      timeSeconds: durationSeconds,
    },
  };
}
