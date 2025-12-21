import { clearCourseProgressInputSchema } from "./schemas.js";
import { clearCourseSession, getCourseSession } from "./course-content.js";

export const clearCourseProgressTool = {
  name: "clearCourseProgress",
  description: "Clear progress for a course.",
  parameters: clearCourseProgressInputSchema,
  execute: async (args: { courseId: string; confirm?: boolean }) => {
    if (!args.confirm) {
      return `Pass confirm=true to reset progress for course "${args.courseId}".`;
    }

    const session = await getCourseSession(args.courseId);
    if (!session) {
      return "No course progress found.";
    }
    await clearCourseSession(args.courseId);
    return `Progress for course "${args.courseId}" cleared.`;
  },
};
