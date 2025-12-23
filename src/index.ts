#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { clearCourseProgressTool } from "./tools/clear-course-progress.js";
import { getCourseStatusTool } from "./tools/get-course-status.js";
import { getOverviewTool } from "./tools/get-overview.js";
import { nextCourseStepTool } from "./tools/next-course-step.js";
import { searchCoursesTool } from "./tools/search-courses.js";
import { startCourseLessonTool } from "./tools/start-course-lesson.js";
import { recordQuizResultTool } from "./tools/record-quiz-result.js";
import { getDocsTool } from "./tools/get-docs.js";
import { getDefaultCourseId, setDefaultCourseId } from "./config.js";
import { getOverview } from "./tools/utils/course-api.js";

const server = new FastMCP({
  name: "Context101",
  version: "0.0.1",
  instructions:
    "Use this server to access Context101 courses and documentation.",
});

const courseTools = [
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
const defaultCourseId = getDefaultCourseId();
if (!defaultCourseId) {
  server.addTool({
    name: searchCoursesTool.name,
    description: searchCoursesTool.description,
    parameters: searchCoursesTool.parameters,
    execute: async (args) => searchCoursesTool.execute(args as any),
  });
}

function decorateDescription(description: string) {
  if (!defaultCourseId) return description;
  return `${description} (Context101 course: ${defaultCourseId})`;
}

for (const tool of courseTools) {
  server.addTool({
    name: tool.name,
    description: decorateDescription(tool.description),
    parameters: tool.parameters,
    execute: async (args) => tool.execute(args as any),
  });
}

async function main() {
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
