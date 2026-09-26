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
    if (
      msg.includes("undefined to be a number") ||
      msg.includes("Cannot read property 'total'") ||
      msg.includes("total")
    ) {
      getOrdersFailingTests.push(failure.testName);
    } else if (
      msg.includes("customer.id") ||
      msg.includes("customer_id") ||
      msg.includes("ValidationError")
    ) {
      postOrdersFailingTests.push(failure.testName);
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
      rootCause: "Schema Drift: Response property 'total' renamed to 'totalAmount'",
      fixApplied: false,
      verified: false,
    });
  }

  if (postOrdersFailingTests.length > 0) {
    clusters.push({
      clusterId: "cluster-post-orders-customer",
      endpoint: "POST /api/orders",
      failingTests: postOrdersFailingTests,
      rootCause: "Payload Drift: Field 'customer_id' unflattened to 'customer.id'",
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

  const durationSeconds = startTimeMs ? (Date.now() - startTimeMs) / 1000 : 0.05;

  return {
    clusters,
    summary: {
      totalFailingBefore: failures.length,
      clusters: clusters.length,
      autoFixed: 0,
      timeSeconds: parseFloat(durationSeconds.toFixed(3)),
    },
  };
}
