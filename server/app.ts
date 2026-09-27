import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { runMigrationPipeline } from "../src/engine/orchestrator.js";

const app = express();
const INITIAL_PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use("/bob_sessions", express.static(path.resolve(process.cwd(), "bob_sessions")));

// API Endpoints
app.get("/api/artifacts", (req: Request, res: Response) => {
  try {
    const cwd = process.cwd();
    const impactMapPath = path.resolve(cwd, "artifacts/impact-map.json");
    const clusterReportPath = path.resolve(cwd, "artifacts/cluster-report.json");
    const testResultsPath = path.resolve(cwd, "artifacts/test-results.json");
    const adapterPath = path.resolve(cwd, "demo-repo/src/client/migrationAdapter.ts");

    const impactMap = fs.existsSync(impactMapPath)
      ? JSON.parse(fs.readFileSync(impactMapPath, "utf-8"))
      : [];

    const clusterReport = fs.existsSync(clusterReportPath)
      ? JSON.parse(fs.readFileSync(clusterReportPath, "utf-8"))
      : null;

    const testResults = fs.existsSync(testResultsPath)
      ? JSON.parse(fs.readFileSync(testResultsPath, "utf-8"))
      : null;

    const adapterCode = fs.existsSync(adapterPath)
      ? fs.readFileSync(adapterPath, "utf-8")
      : "";

    res.json({
      impactMap,
      clusterReport,
      testResults,
      adapterCode,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/run-pipeline", (req: Request, res: Response) => {
  try {
    const report = runMigrationPipeline({ silent: true });

    const cwd = process.cwd();
    const impactMapPath = path.resolve(cwd, "artifacts/impact-map.json");
    const testResultsPath = path.resolve(cwd, "artifacts/test-results.json");
    const adapterPath = path.resolve(cwd, "demo-repo/src/client/migrationAdapter.ts");

    const impactMap = fs.existsSync(impactMapPath)
      ? JSON.parse(fs.readFileSync(impactMapPath, "utf-8"))
      : [];

    const testResults = fs.existsSync(testResultsPath)
      ? JSON.parse(fs.readFileSync(testResultsPath, "utf-8"))
      : null;

    const adapterCode = fs.existsSync(adapterPath)
      ? fs.readFileSync(adapterPath, "utf-8")
      : "";

    res.json({
      success: true,
      clusterReport: report,
      impactMap,
      testResults,
      adapterCode,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const taskBobcoinCosts: Record<string, number> = {
  "team_task01_impact_analysis_summary.png": 0.25,
  "team_task02_migration_codegen_summary.png": 0.35,
  "team_task03_failure_clustering_summary.png": 0.20,
  "team_task04_rootcause_fix_summary.png": 0.29,
};

app.get("/api/bob-sessions", (req: Request, res: Response) => {
  try {
    const sessionsDir = path.resolve(process.cwd(), "bob_sessions");
    const files = fs.existsSync(sessionsDir)
      ? fs.readdirSync(sessionsDir).filter((file) => {
          if (file.startsWith(".")) return false;
          const lower = file.toLowerCase();
          return lower.endsWith(".png") && lower !== "desktop.ini" && lower !== "thumbs.db" && lower !== ".ds_store";
        })
      : [];

    let totalBobcoins = 0;
    for (const file of files) {
      totalBobcoins += taskBobcoinCosts[file] ?? 0.25;
    }

    res.json({
      totalBobcoins: Number(totalBobcoins.toFixed(2)),
      sessionCount: files.length,
      sessions: files.map((f) => ({
        id: f,
        name: f,
        path: `/bob_sessions/${f}`,
        timestamp: new Date().toISOString(),
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: {
        clientPort: 3000,
      },
    },
    appType: "spa",
    root: path.resolve(process.cwd(), "web"),
  });

  app.use(vite.middlewares);

  listenOnPort(INITIAL_PORT);
}

function listenOnPort(port: number) {
  const server = app.listen(port, () => {
    console.log(`\x1b[32m[APIShift Dashboard]\x1b[0m Running on http://localhost:${port}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      const nextPort = port + 1;
      console.log(`\x1b[33m[APIShift Dashboard]\x1b[0m Port ${port} in use, trying http://localhost:${nextPort}...`);
      listenOnPort(nextPort);
    } else {
      console.error(err);
    }
  });
}

startServer();
