import { spawnSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const workerName = "archive-production";
const generatedConfig = "dist/server/wrangler.json";
const healthPath = "/api/health";
const healthyBody = '{"status":"ok"}';
const healthAttempts = 12;
const healthDelayMs = 5000;
const healthTimeoutMs = 10_000;

const [action, ...rawArguments] = process.argv.slice(2);
const positionals = rawArguments.filter((argument) => argument !== "--");

const requirePositional = (index, label) => {
  const positional = positionals[index];

  if (!positional) {
    throw new Error(`${label} is required.`);
  }

  return positional;
};

const wranglerArguments = {
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
  candidate: (tag, message = `candidate:${tag}`) => [
    "versions",
    "upload",
    "--config",
    generatedConfig,
    "--name",
    workerName,
    "--tag",
    tag,
    "--message",
    message,
  ],
  promote: (versionId) => [
    "versions",
    "deploy",
    `${versionId}@100%`,
    "--yes",
    "--config",
    generatedConfig,
    "--name",
    workerName,
  ],
  rollback: (versionId) => [
    "rollback",
    versionId,
    "--yes",
    "--config",
    generatedConfig,
    "--name",
    workerName,
  ],
};

const runWrangler = (argumentList, { capture = false } = {}) => {
  const result = spawnSync("pnpm", ["exec", "wrangler", ...argumentList], {
    encoding: "utf8",
    stdio: capture ? ["inherit", "pipe", "inherit"] : "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  const stdout = capture ? (result.stdout ?? "") : "";

  if (stdout) {
    process.stdout.write(stdout);
  }

  return { status: result.status ?? 1, stdout };
};

const waitForHealth = async (url) => {
  for (let attempt = 1; attempt <= healthAttempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(healthTimeoutMs),
      });
      const body = (await response.text()).trim();

      if (response.status === 200 && body === healthyBody) {
        console.log(`Healthy: ${url}`);

        return true;
      }

      console.log(
        `Attempt ${attempt}/${healthAttempts} for ${url} returned ${response.status} ${body.slice(0, 200)}`,
      );
    } catch (error) {
      console.log(
        `Attempt ${attempt}/${healthAttempts} for ${url} failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (attempt < healthAttempts) {
      await sleep(healthDelayMs);
    }
  }

  return false;
};

const readLiveVersionId = () => {
  const { status, stdout } = runWrangler(wranglerArguments.status(), {
    capture: true,
  });

  if (status !== 0) {
    return undefined;
  }

  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");

  if (start === -1 || end === -1) {
    return undefined;
  }

  const deployment = JSON.parse(stdout.slice(start, end + 1));
  const versions = deployment.versions ?? [];
  const live =
    versions.find((entry) => entry.percentage === 100) ?? versions[0];

  return live?.version_id;
};

const pipeline = async () => {
  const tag = requirePositional(0, "Candidate tag");
  const message = positionals[1] ?? `candidate:${tag}`;
  const previousVersionId = readLiveVersionId();

  console.log(
    previousVersionId
      ? `Current live version: ${previousVersionId}`
      : "No current live version detected; rollback will be unavailable.",
  );

  const upload = runWrangler(wranglerArguments.candidate(tag, message), {
    capture: true,
  });

  if (upload.status !== 0) {
    return upload.status;
  }

  const versionId = upload.stdout.match(
    /Worker Version ID:\s*([0-9a-f-]{36})/i,
  )?.[1];
  const previewUrl = upload.stdout.match(/Version Preview URL:\s*(\S+)/i)?.[1];

  if (!versionId || !previewUrl) {
    throw new Error(
      "Could not read the uploaded version ID and preview URL from wrangler output; `preview_urls` must stay enabled in wrangler.jsonc.",
    );
  }

  console.log(`Candidate version: ${versionId}`);
  console.log(`Candidate preview: ${previewUrl}`);

  const previewOrigin = new URL(previewUrl);

  if (!(await waitForHealth(`${previewOrigin.origin}${healthPath}`))) {
    console.error(
      "Candidate preview failed validation; the candidate was not promoted.",
    );

    return 1;
  }

  const promote = runWrangler(wranglerArguments.promote(versionId));

  if (promote.status !== 0) {
    return promote.status;
  }

  const productionOrigin = new URL(previewUrl);
  productionOrigin.hostname = productionOrigin.hostname.replace(
    /^[0-9a-f]{8}-/i,
    "",
  );

  if (await waitForHealth(`${productionOrigin.origin}${healthPath}`)) {
    console.log(`Promoted ${versionId} to ${productionOrigin.origin}`);

    return 0;
  }

  if (!previousVersionId) {
    console.error(
      "Production validation failed and no previous version is available to roll back to.",
    );

    return 1;
  }

  console.error(
    `Production validation failed; rolling back to ${previousVersionId}.`,
  );
  runWrangler(wranglerArguments.rollback(previousVersionId));

  return 1;
};

const cliActions = {
  status: () => runWrangler(wranglerArguments.status()).status,
  bootstrap: () => runWrangler(wranglerArguments.bootstrap()).status,
  candidate: () =>
    runWrangler(
      wranglerArguments.candidate(requirePositional(0, "Candidate tag")),
    ).status,
  promote: () =>
    runWrangler(
      wranglerArguments.promote(requirePositional(0, "Candidate version ID")),
    ).status,
  rollback: () =>
    runWrangler(
      wranglerArguments.rollback(
        requirePositional(0, "Previous known-good version ID"),
      ),
    ).status,
  verify: async () =>
    (await waitForHealth(requirePositional(0, "Health check URL"))) ? 0 : 1,
  pipeline,
};

if (!Object.hasOwn(cliActions, action)) {
  throw new Error(
    "Action must be status, bootstrap, candidate, promote, rollback, verify, or pipeline.",
  );
}

process.exitCode = await cliActions[action]();
