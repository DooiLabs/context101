import { clearCourseProgressInputSchema } from "./schemas.js";
import { clearCourseSession, getCourseSession } from "./course-content.js";
import { resolveCourseId } from "../../config.js";

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
      return "No course progress found.";
    }
    await clearCourseSession(courseId);
    return `Progress for course "${courseId}" cleared.`;
  },
};
