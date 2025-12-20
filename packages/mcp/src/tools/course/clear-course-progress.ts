import { clearCourseProgressInputSchema } from "./schemas.js";
import { canUseCourseApi, resetCourseRemote } from "./course-api.js";
import { getUserContext, loadUserProgress, saveUserProgress } from "./course-store.js";

export const clearCourseProgressTool = {
  name: "clearCourseProgress",
  description: "Clear progress for a course.",
  parameters: clearCourseProgressInputSchema,
  execute: async (
    args: { courseId: string; confirm?: boolean },
    context?: { apiKey?: string }
  ) => {
    const apiKey = context?.apiKey;
    const { userId, warning } = getUserContext(apiKey);

    if (!args.confirm) {
      return "Confirmation required. Call again with confirm: true to clear progress.";
    }

    if (canUseCourseApi(apiKey)) {
      await resetCourseRemote(args.courseId, apiKey!);
      return `Cleared progress for course "${args.courseId}".${
        warning ? `\n\nWarning: ${warning}` : ""
      }`;
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
