import { clearCourseProgressInputSchema } from "./schemas.js";
import { getUserContext, loadUserProgress, saveUserProgress } from "./course-store.js";

export const clearCourseProgressTool = {
  name: "clearCourseProgress",
  description: "Clear progress for a course.",
  parameters: clearCourseProgressInputSchema,
  execute: async (
    args: { courseId: string; confirm?: boolean },
    context?: { apiKey?: string }
  ) => {
    const { userId, warning } = getUserContext(context?.apiKey);

    if (!args.confirm) {
      return "Confirmation required. Call again with confirm: true to clear progress.";
    }

    const progressByCourse = await loadUserProgress(userId);
    if (!progressByCourse[args.courseId]) {
      return "No course progress found.";
    }

    delete progressByCourse[args.courseId];
    await saveUserProgress(userId, progressByCourse);
    return `Cleared progress for course "${args.courseId}".${
      warning ? `\n\nWarning: ${warning}` : ""
    }`;
  },
};
