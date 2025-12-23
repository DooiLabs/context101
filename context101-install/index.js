#!/usr/bin/env node

import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { ensureFile, readJSON, writeJSON } from "fs-extra/esm";

const PACKAGE_NAME = "@context101/mcp";
const SERVER_KEY = "context101";

function usage() {
  return [
    "Usage:",
    "  npx @context101/install -m cursor",
    "  npx @context101/install -m windsurf",
    "  npx @context101/install -m vscode",
  ].join("\n");
}

function parseArgs(argv) {
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "-m" || args[i] === "--mcp") {
      return args[i + 1] ?? "";
    }
    if (args[i].startsWith("--mcp=")) {
      return args[i].slice("--mcp=".length);
    }
  }
  return "";
}

const cursorGlobalMCPConfigPath = path.join(os.homedir(), ".cursor", "mcp.json");
const windsurfGlobalMCPConfigPath = path.join(
  os.homedir(),
  ".codeium",
  "windsurf",
  "mcp_config.json",
);
const vscodeGlobalMCPConfigPath = path.join(
  os.homedir(),
  process.platform === "win32"
    ? path.join("AppData", "Roaming", "Code", "User", "settings.json")
    : process.platform === "darwin"
      ? path.join("Library", "Application Support", "Code", "User", "settings.json")
      : path.join(".config", "Code", "User", "settings.json"),
);

function getConfigPath(editor) {
  if (editor === "cursor") return cursorGlobalMCPConfigPath;
  if (editor === "windsurf") return windsurfGlobalMCPConfigPath;
  if (editor === "vscode") return vscodeGlobalMCPConfigPath;
  return null;
}

function buildServerConfig(editor) {
  const args = ["-y", PACKAGE_NAME];
  if (editor === "vscode") {
    if (process.platform === "win32") {
      return {
        servers: {
          [SERVER_KEY]: {
            command: "cmd",
            args: ["/c", "npx", ...args],
            type: "stdio",
          },
        },
      };
    }
    return {
      servers: {
        [SERVER_KEY]: {
          command: "npx",
          args,
          type: "stdio",
        },
      },
    };
  }

  return {
    mcpServers: {
      [SERVER_KEY]: {
        command: "npx",
        args,
      },
    },
  };
}

function mergeConfig(existing, editor) {
  const base = existing && typeof existing === "object" ? existing : {};
  const fresh = buildServerConfig(editor);

  if (editor === "vscode") {
    return {
      ...base,
      servers: {
        ...(base.servers || {}),
        ...fresh.servers,
      },
    };
  }

  return {
    ...base,
    mcpServers: {
      ...(base.mcpServers || {}),
      ...fresh.mcpServers,
    },
  };
}

function isAlreadyInstalled(editor, config) {
  if (!config || typeof config !== "object") return false;
  const expectedPackage = PACKAGE_NAME;

  if (editor === "vscode") {
    if (!config.servers || typeof config.servers !== "object") return false;
    return Object.values(config.servers).some((server) =>
      server?.args?.some((arg) => arg === expectedPackage),
    );
  }

  if (!config.mcpServers || typeof config.mcpServers !== "object") return false;
  return Object.values(config.mcpServers).some((server) =>
    server?.args?.some((arg) => arg === expectedPackage),
  );
}

async function readConfig(configPath) {
  if (!existsSync(configPath)) return {};
  return readJSON(configPath);
}

async function writeConfig(configPath, config) {
  await ensureFile(configPath);
  await writeJSON(configPath, config, { spaces: 2 });
}

async function main() {
  const editor = parseArgs(process.argv);
  if (!editor) {
    console.error(usage());
    process.exit(1);
  }
  if (!["cursor", "windsurf", "vscode"].includes(editor)) {
    console.error(`Unsupported editor: ${editor}`);
    console.error(usage());
    process.exit(1);
  }

  const configPath = getConfigPath(editor);
  if (!configPath) {
    console.error(`Unsupported editor: ${editor}`);
    process.exit(1);
  }

  const existing = await readConfig(configPath);
  if (isAlreadyInstalled(editor, existing)) {
    console.log(`Context101 MCP server already configured for ${editor}.`);
    console.log(`No changes needed: ${configPath}`);
    return;
  }
  const merged = mergeConfig(existing, editor);
  await writeConfig(configPath, merged);

  console.log(`Context101 MCP server configured for ${editor}.`);
  console.log(`Updated: ${configPath}`);
}

main().catch((error) => {
  console.error("Failed to configure MCP server:", error);
  process.exit(1);
});
