# APIShift

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](#)
[![Verification Pass Rate](https://img.shields.io/badge/verification-100%25%20(40%2F40)-emerald.svg?style=flat-square)](#)
[![Noise Reduction](https://img.shields.io/badge/noise%20reduction-91.3%25-blue.svg?style=flat-square)](#)
[![IBM Bob 2.0](https://img.shields.io/badge/AI%20Engine-IBM%20Bob%202.0-6f42c1.svg?style=flat-square)](#)
[![Bobcoins Consumed](https://img.shields.io/badge/Bobcoins-1.09-informational.svg?style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-zinc.svg?style=flat-square)](LICENSE)

**Autonomous API Migration Guard and Deterministic Root-Cause Verification Agent**  
*Architected for the IBM Bob 2.0 Hackathon (September 2026).*

**Live Interactive Platform:** [https://apishift-phi.vercel.app/](https://apishift-phi.vercel.app/)

---

## Executive Summary

APIShift provides an automated, closed-loop API migration guard designed to remediate breaking OpenAPI contract drift across microservice ecosystems. Upgrading public API interfaces often triggers cascading integration test failures across consumer repositories. APIShift couples static Abstract Syntax Tree (AST) diffing with IBM Bob 2.0 agentic synthesis to isolate consumer blast radius, synthesize non-destructive client adapters, and cluster raw test assertion failures into actionable architectural root causes.

---

## Technical Problem Statement

Upstream API schema modifications—such as renaming response properties or unflattening payload objects—frequently compromise downstream service compatibility:

* **CI Alert Fatigue:** Direct deployment of an updated contract (`contracts/after.yaml` replacing `contracts/before.yaml`) induces 23 assertion failures across 40 consumer integration test probes.
* **High Mean Time to Resolution (MTTR):** Development teams expend significant manual overhead tracing disparate stack traces and locating impacted call sites across microservice boundaries.
* **Regression Risk:** Manually drafted translation shims often introduce schema inconsistencies, unhandled type mismatches, and secondary runtime errors.

---

## Core Capabilities & Performance Benchmarks

* **AST Call-Site Blast-Radius Mapping:** Discovers exact line numbers, functions, and consuming components across downstream repositories affected by contract drift.
* **Additive Migration Adapter Synthesis:** Generates a non-destructive runtime shim (`migrationAdapter.ts`) supporting backward compatibility while conforming to target OpenAPI v2 schemas.
* **91.3% Failure Signature Deduplication:** Correlates 23 raw test probe failures into 2 distinct architectural root causes via AST call-graph tracing:
  * `cluster-get-orders-total`: 17 probe failures attributed to the response property rename (`total` to `totalAmount`).
  * `cluster-post-orders-customer`: 6 probe failures attributed to parameter unflattening (`customer_id` to `customer.id`).
* **Bounded Evidence Ledger:** Proves a 100% test pass rate (40/40 probes) with mathematical confirmation that 0 assertions were deleted, commented out, or weakened.

### Verification Ledger

| Rollout Target | Pass Rate | Failures | Status | Integrity Gate |
| :--- | :--- | :--- | :--- | :--- |
| **Baseline (Direct v2 Rollout)** | 17/40 (42.5%) | 23 Fail | `UNSAFE / BLOCKED` | 23 unhandled schema exceptions |
| **APIShift + Bob Migration Adapter** | **40/40 (100.0%)** | **0 Fail** | `VERIFIED / PRODUCTION SAFE` | 40/40 probes green; 0 assertions modified |

---

## Architectural Pipeline

```
[ contracts/before.yaml vs contracts/after.yaml ]
                   |
                   v
+--------------------------------------+
| Module A: OpenAPI Impact Analyzer    | ---> Traverses AST call sites & maps blast radius
+------------------+-------------------+
                   |
                   v
+--------------------------------------+
| Module B: Migration Codegen Engine   | ---> Generates non-destructive migrationAdapter.ts
+------------------+-------------------+
                   |
                   v
+--------------------------------------+
| Module C: Failure Signature Clusterer| ---> Maps 23 failures -> 2 root causes (-91.3% noise)
+------------------+-------------------+
                   |
                   v
+--------------------------------------+
| Module D: Fix & Verification Sandbox | ---> Audits test suite (40/40 green, 0 skipped)
+--------------------------------------+
```

---

## IBM Bob 2.0 Integration & Telemetry

APIShift delegates complex schema reasoning, codegen synthesis, and verification auditing to IBM Bob 2.0 across four discrete task sessions. Evidence artifacts and session logs are version-controlled under `/bob_sessions/`:

| Task Session | Artifact Identifier | Objective & Scope | Bobcoins Consumed |
| :--- | :--- | :--- | :--- |
| **Task 01** | `team_task01_impact_analysis_summary.png` | OpenAPI AST Diff & Consumer Call-Site Blast Radius | 0.248 |
| **Task 02** | `team_task02_migration_codegen_summary.png` | Backward-compatible `migrationAdapter.ts` codegen | 0.292 |
| **Task 03** | `team_task03_failure_clustering_summary.png` | Raw test failure deduplication & AST clustering | 0.274 |
| **Task 04** | `team_task04_rootcause_fix_summary.png` | Bounded evidence ledger & test integrity audit | 0.276 |
| **Aggregate** | | **4 Audited Sessions** | **1.09 Bobcoins** |

---

## Local Development & Verification

### Prerequisites

* Node.js v18.0.0 or higher
* npm or pnpm

### Installation

```bash
git clone https://github.com/yojit2016/APIShift.git
cd APIShift
npm install
```

### Execute Verification Pipeline (CLI)

To run the static analysis engine, synthesize the adapter, deduplicate failures, and execute the test suite:

```bash
npm run test:verify
```

### Launch Interactive Command Center

To start the enterprise web interface locally:

```bash
npm run dev:web
```

Access the application at `http://localhost:3000`.

---

## Repository Layout

```text
├── artifacts/
│   ├── cluster-report.json              # Deduplicated failure cluster definitions
│   └── test-results.json                # Vitest probe assertion results
├── bob_sessions/                        # IBM Bob IDE session audit screenshots
│   ├── team_task01_impact_analysis_summary.png
│   ├── team_task02_migration_codegen_summary.png
│   ├── team_task03_failure_clustering_summary.png
│   └── team_task04_rootcause_fix_summary.png
├── contracts/
│   ├── before.yaml                      # Baseline OpenAPI v1 contract specification
│   └── after.yaml                       # Target OpenAPI v2 breaking contract specification
├── demo-repo/                           # Downstream consumer implementation
│   ├── src/
│   │   ├── client/apiClient.ts          # Base HTTP client implementation
│   │   └── services/                    # Downstream order and checkout call sites
│   └── tests/
│       └── orders.test.ts               # 40 integration test probes
├── server/                              # Express API service and session handlers
└── web/                                 # React and Vite dashboard frontend
```

---

## License

This project is licensed under the [MIT License](LICENSE).
