import { clearCourseProgressInputSchema } from "./schemas.js";
import { ensureApiKey, loadUserProgress, saveUserProgress } from "./utils.js";

export const clearCourseProgressTool = {
  name: "clearCourseProgress",
  description: "Clear progress for a course.",
  parameters: clearCourseProgressInputSchema,
  execute: async (
    args: { courseId: string; confirm?: boolean },
    context?: { apiKey?: string }
  ) => {
    const { userId, error } = ensureApiKey(context?.apiKey);
    if (!userId) return error!;

    if (!args.confirm) {
      return "Confirmation required. Call again with confirm: true to clear progress.";
    }

    const progressByCourse = await loadUserProgress(userId);
    if (!progressByCourse[args.courseId]) {
      return "No course progress found.";
    }

    delete progressByCourse[args.courseId];
    await saveUserProgress(userId, progressByCourse);
    return `Cleared progress for course "${args.courseId}".`;
  },
};
