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

    if (!getCourseSession(args.courseId)) {
      return "No course progress found.";
    }
    clearCourseSession(args.courseId);
    return `Progress for course "${args.courseId}" cleared.`;
  },
};
