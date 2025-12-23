import { z } from "zod";
import {
  clearCourseSession,
  getCourseSession,
} from "./utils/course-session.js";
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

const clearCourseProgressInputSchema = z.object({
  courseId: courseIdSchema,
  confirm: z.boolean().optional().default(false),
});

export const clearCourseProgressTool = {
  name: "clearCourseProgress",
  description: "Clear progress for a course.",
  parameters: clearCourseProgressInputSchema,
  execute: async (args: { courseId?: string; confirm?: boolean }) => {
    const courseId = resolveCourseId(args.courseId);
    if (!courseId) {
      return "Pass courseId or start the server with --course <id>.";
    }
    if (!args.confirm) {
      return `Pass confirm=true to reset progress for course "${courseId}".`;
    }

    const session = await getCourseSession(courseId);
    if (!session) {
      return "No course progress found. Start with `startCourseLesson`.";
    }
    await clearCourseSession(courseId);
    return `Progress for course "${courseId}" cleared.`;
  },
};
