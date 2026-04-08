import { existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync, spawn } from "node:child_process";

const tracePath = resolve(".next", "dev", "trace");
const nextBin = resolve("node_modules", "next", "dist", "bin", "next");
const forwardedArgs = process.argv.slice(2);
const projectPath = resolve(".");

function detectExistingDevServer() {
  if (process.platform !== "win32") {
    return null;
  }

  const escapedPath = projectPath.replaceAll("'", "''");
  const script = [
    `$project = '${escapedPath}'`,
    "$currentPid = $PID",
    "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.ProcessId -ne $currentPid -and $_.CommandLine -like '*next*dev*' -and $_.CommandLine -like \"*$project*\" } | Select-Object ProcessId, CommandLine | ConvertTo-Json -Compress",
  ].join("; ");

  try {
    const rawOutput = execFileSync(
      "powershell.exe",
      ["-NoProfile", "-Command", script],
      { encoding: "utf8" },
    ).trim();

    if (!rawOutput) {
      return null;
    }

    const parsed = JSON.parse(rawOutput);
    const processes = Array.isArray(parsed) ? parsed : [parsed];

    return processes.length > 0 ? processes[0] : null;
  } catch {
    return null;
  }
}

function prepareDevTrace() {
  if (!existsSync(tracePath)) {
    return;
  }

  try {
    unlinkSync(tracePath);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "EPERM") {
      console.error(
        [
          "Another Next.js dev server is still using this workspace.",
          "Close the existing server first, then run `npm run dev` again.",
          "If needed on Windows, free the stale server with `Stop-Process -Id <PID> -Force`.",
          `Locked file: ${tracePath}`,
        ].join("\n"),
      );
      process.exit(1);
    }

    throw error;
  }
}

const existingDevServer = detectExistingDevServer();

if (existingDevServer) {
  console.error(
    [
      "A Next.js dev server is already running for this workspace.",
      `Existing PID: ${existingDevServer.ProcessId}`,
      "Stop the running server first, or just use the already-running app in your browser.",
      "On Windows you can stop it with:",
      `Stop-Process -Id ${existingDevServer.ProcessId} -Force`,
    ].join("\n"),
  );
  process.exit(1);
}

prepareDevTrace();

const child = spawn(
  process.execPath,
  [nextBin, "dev", "--webpack", ...forwardedArgs],
  {
    stdio: "inherit",
    env: process.env,
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
