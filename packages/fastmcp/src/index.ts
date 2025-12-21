#!/usr/bin/env node

import { Command } from "commander";
import { FastMCP } from "fastmcp";
import {
  clearCourseProgressTool,
  getCourseStatusTool,
  nextCourseStepTool,
  searchCoursesTool,
  startCourseTool,
} from "./tools/course/index.js";

type TransportType = "stdio" | "http";

const DEFAULT_PORT = 3000;

const program = new Command()
  .option("--transport <stdio|http>", "transport type", "stdio")
  .option("--port <number>", "port for HTTP transport", DEFAULT_PORT.toString())
  .allowUnknownOption()
  .parse(process.argv);

const cliOptions = program.opts<{
  transport: string;
  port: string;
}>();

const allowedTransports: TransportType[] = ["stdio", "http"];
if (!allowedTransports.includes(cliOptions.transport as TransportType)) {
  console.error(
    `Invalid --transport value: '${cliOptions.transport}'. Must be one of: stdio, http.`
  );
  process.exit(1);
}

const transportType = (cliOptions.transport || "stdio") as TransportType;

const passedPortFlag = process.argv.includes("--port");
if (transportType === "stdio" && passedPortFlag) {
  console.error("The --port flag is not allowed when using --transport stdio.");
  process.exit(1);
}

const server = new FastMCP({
  name: "Context7",
  version: "1.0.13",
  instructions:
    "Use this server to retrieve up-to-date documentation and code examples for any library.",
});

const courseTools = [
  searchCoursesTool,
  startCourseTool,
  nextCourseStepTool,
  getCourseStatusTool,
  clearCourseProgressTool,
];

for (const tool of courseTools) {
  server.addTool({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
    execute: async (args) => tool.execute(args as any),
  });
}

async function main() {
  if (transportType === "http") {
    const parsedPort = parseInt(cliOptions.port, 10);
    const port = Number.isNaN(parsedPort) ? DEFAULT_PORT : parsedPort;

    server.start({
      transportType: "httpStream",
      httpStream: { port },
    });

    console.error(
      `Context7 Documentation MCP Server running on HTTP at http://localhost:${port}/mcp`
    );
    return;
  }

  server.start({ transportType: "stdio" });
  console.error("Context7 Documentation MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
