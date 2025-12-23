import { z } from "zod";
import { buildCourseContent } from "./utils/course-session.js";
import { resolveCourseId } from "../config.js";

const courseIdSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length === 0 ? undefined : value,
  z
    .string()
    .min(1)
    .optional()
    .describe("Course ID to start or resume. Defaults to --course."),
);

const getOverviewInputSchema = z.object({
  courseId: courseIdSchema,
});

function formatOverview(
  content: Awaited<ReturnType<typeof buildCourseContent>>,
) {
  const lines: string[] = [`Course: ${content.courseId}`, "", "Lessons:"];
  if (!content.lessons.length) {
    return `${lines.join("\n")}\n- No lessons found.`;
  }

  for (const lesson of content.lessons) {
    lines.push(`- ${lesson.id} (${lesson.title})`);
    if (!lesson.steps.length) {
      lines.push("  - No steps");
      continue;
    }
    for (const step of lesson.steps) {
      lines.push(`  - ${step.id} (${step.title})`);
    }
  }
  return lines.join("\n");
}

export const getOverviewTool = {
  name: "getOverview",
  description: "Get lessons and steps for a course.",
  parameters: getOverviewInputSchema,
  execute: async (args: { courseId?: string }) => {
    const courseId = resolveCourseId(args.courseId);
    if (!courseId) {
      return "Pass courseId or start the server with --course <id>.";
    }
    const content = await buildCourseContent(courseId);
    return formatOverview(content);
  },
};
