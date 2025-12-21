import { clearCourseProgressInputSchema } from "./schemas.js";
import { resetCourseRemote } from "./course-api.js";

export const clearCourseProgressTool = {
  name: "clearCourseProgress",
  description: "Clear progress for a course.",
  parameters: clearCourseProgressInputSchema,
  execute: async (args: { courseId: string; confirm?: boolean }) => {
    if (!args.confirm) {
      return `Pass confirm=true to reset progress for course "${args.courseId}".`;
    }

    await resetCourseRemote(args.courseId);
    return `Progress for course "${args.courseId}" cleared.`;
  },
};
