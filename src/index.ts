#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import {
  clearCourseProgressTool,
  getCourseStatusTool,
  getOverviewTool,
  nextCourseStepTool,
  searchCoursesTool,
  startCourseLessonTool,
  recordQuizResultTool,
} from "./tools/course/index.js";
import { getDocsTool } from "./tools/docs/get-docs.js";
import { getDefaultCourseId, setDefaultCourseId } from "./config.js";
import { getOverview } from "./tools/course/course-api.js";

const server = new FastMCP({
  name: "Context101",
  version: "1.0.13",
  instructions:
    "Use this server to access Context101 courses and documentation.",
});

const courseTools = [
  searchCoursesTool,
  startCourseLessonTool,
  nextCourseStepTool,
  getCourseStatusTool,
  getOverviewTool,
  clearCourseProgressTool,
  recordQuizResultTool,
  getDocsTool,
];

function parseCourseArg(args: string[]) {
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (!value) continue;
    if (value === "--course") {
      const next = args[index + 1];
      if (next && !next.startsWith("--")) return next;
    }
    if (value.startsWith("--course=")) {
      return value.slice("--course=".length);
    }
  }
  return null;
}

setDefaultCourseId(parseCourseArg(process.argv.slice(2)));

for (const tool of courseTools) {
  server.addTool({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
    execute: async (args) => tool.execute(args as any),
  });
}

async function main() {
  const defaultCourseId = getDefaultCourseId();
  if (defaultCourseId) {
    try {
      await getOverview(defaultCourseId);
    } catch (error) {
      console.error(
        `Invalid --course "${defaultCourseId}". Server will not start.`,
      );
      console.error(error);
      process.exit(1);
    }
  }

  server.start({ transportType: "stdio" });
  console.error("context101 course mcp server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
