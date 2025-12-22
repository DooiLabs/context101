#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import {
  clearCourseProgressTool,
  getCourseStatusTool,
  nextCourseStepTool,
  searchCoursesTool,
  startCourseTool,
  recordQuizResultTool,
} from "./tools/course/index.js";
import { getDocsTool } from "./tools/docs/get-docs.js";

const server = new FastMCP({
  name: "Context101",
  version: "1.0.13",
  instructions:
    "Use this server to access Context101 courses and documentation.",
});

const courseTools = [
  searchCoursesTool,
  startCourseTool,
  nextCourseStepTool,
  getCourseStatusTool,
  clearCourseProgressTool,
  recordQuizResultTool,
  getDocsTool,
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
  console.error("context101 course mcp server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
