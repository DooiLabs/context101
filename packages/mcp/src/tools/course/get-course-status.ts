import { getCourseStatusInputSchema } from "./schemas.js";
import { ensureApiKey, loadUserProgress } from "./utils.js";

export const getCourseStatusTool = {
  name: "getCourseStatus",
  description: "Get status for a course.",
  parameters: getCourseStatusInputSchema,
  execute: async (
    args: { courseId: string },
    context?: { apiKey?: string }
  ) => {
    const { userId, error } = ensureApiKey(context?.apiKey);
    if (!userId) return error!;

    const progressByCourse = await loadUserProgress(userId);
    const progress = progressByCourse[args.courseId];
    if (!progress) {
      return "No course progress found. Start the course first.";
    }

    return [
      `Course: ${progress.courseId}`,
      `Current Lesson: ${progress.currentLessonId}`,
      `Current Step: ${progress.currentStepId}`,
      `Completed Steps: ${progress.completedSteps.length}`,
      `Completed Lessons: ${progress.completedLessons.length}`,
      `Updated At: ${progress.updatedAt}`,
    ].join("\n");
  },
};
