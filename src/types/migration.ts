export interface CallSite {
  file: string;
  line: number;
  snippet: string;
  endpoint: string;
}

export interface AffectedTest {
  file: string;
  testName: string;
  associatedEndpoint: string;
}

export interface ImpactMap {
  changedEndpoint: string;
  changeType: "schema-change" | "path-rename" | "param-added";
  diffDetail: string;
  callSites: CallSite[];
  affectedTests: AffectedTest[];
}

export interface FailureCluster {
  clusterId: string;
  endpoint: string;
  failingTests: string[];
  rootCause: string | null;
  fixApplied: boolean;
  verified: boolean;
}

export interface ClusterReport {
  clusters: FailureCluster[];
  summary: {
    totalFailingBefore: number;
    clusters: number;
    autoFixed: number;
    timeSeconds: number;
  };
}
