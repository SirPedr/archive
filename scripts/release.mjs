import { spawnSync } from "node:child_process";

const workerName = "archive-production";
const generatedConfig = "dist/server/wrangler.json";
const [action, ...rawArguments] = process.argv.slice(2);
const value = rawArguments.find((argument) => argument !== "--");

const requireValue = (label) => {
  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
};

const commands = {
  status: () => [
    "deployments",
    "status",
    "--json",
    "--config",
    generatedConfig,
    "--name",
    workerName,
  ],
  bootstrap: () => [
    "deploy",
    "--config",
    generatedConfig,
    "--name",
    workerName,
  ],
  candidate: () => [
    "versions",
    "upload",
    "--config",
    generatedConfig,
    "--name",
    workerName,
    "--tag",
    requireValue("Candidate tag"),
    "--message",
    `candidate:${value}`,
  ],
  promote: () => [
    "versions",
    "deploy",
    `${requireValue("Candidate version ID")}@100%`,
    "--yes",
    "--config",
    generatedConfig,
    "--name",
    workerName,
  ],
  rollback: () => [
    "rollback",
    requireValue("Previous known-good version ID"),
    "--yes",
    "--config",
    generatedConfig,
    "--name",
    workerName,
  ],
};

if (!Object.hasOwn(commands, action)) {
  throw new Error(
    "Action must be status, bootstrap, candidate, promote, or rollback.",
  );
}
const result = spawnSync("pnpm", ["exec", "wrangler", ...commands[action]()], {
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
