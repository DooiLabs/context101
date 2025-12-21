#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import {
  clearCourseProgressTool,
  getCourseStatusTool,
  nextCourseStepTool,
  searchCoursesTool,
  startCourseTool,
} from "./tools/course/index.js";

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
  server.start({ transportType: "stdio" });
  console.error("Context7 Documentation MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
