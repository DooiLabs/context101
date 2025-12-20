import { getCourseStatusInputSchema } from "./schemas.js";
import { getUserContext, loadUserProgress } from "./course-store.js";

export const getCourseStatusTool = {
  name: "getCourseStatus",
  description: "Get status for a course.",
  parameters: getCourseStatusInputSchema,
  execute: async (
    args: { courseId: string },
    context?: { apiKey?: string }
  ) => {
    const { userId, warning } = getUserContext(context?.apiKey);

    const progressByCourse = await loadUserProgress(userId);
    const progress = progressByCourse[args.courseId];
    if (!progress) {
      return "No course progress found. Start the course first.";
    }

    const status = [
      `Course: ${progress.courseId}`,
      `Current Lesson: ${progress.currentLessonId}`,
      `Current Step: ${progress.currentStepId}`,
      `Completed Steps: ${progress.completedSteps.length}`,
      `Completed Lessons: ${progress.completedLessons.length}`,
      `Updated At: ${progress.updatedAt}`,
    ].join("\n");
    return warning ? `${status}\n\nWarning: ${warning}` : status;
  },
};
