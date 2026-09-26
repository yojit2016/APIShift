import { runMigrationPipeline } from "../src/engine/orchestrator.js";

try {
  runMigrationPipeline({ silent: false });
} catch (error) {
  console.error("\x1b[31mError running APIShift pipeline:\x1b[0m", error);
  process.exit(1);
}
