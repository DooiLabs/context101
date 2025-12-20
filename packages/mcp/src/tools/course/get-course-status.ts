import { getCourseStatusInputSchema } from "./schemas.js";
import { canUseCourseApi, fetchCourseProgress } from "./course-api.js";
import { getUserContext, loadUserProgress } from "./course-store.js";

export const getCourseStatusTool = {
  name: "getCourseStatus",
  description: "Get status for a course.",
  parameters: getCourseStatusInputSchema,
  execute: async (
    args: { courseId: string },
    context?: { apiKey?: string }
  ) => {
    const apiKey = context?.apiKey;
    const { userId, warning } = getUserContext(apiKey);

    if (canUseCourseApi(apiKey)) {
      const response = await fetchCourseProgress(args.courseId, apiKey!);
      const progress = response.data;
      const status = [
        `Course: ${progress.courseId}`,
        `Current Lesson: ${progress.currentLessonId}`,
        `Current Step: ${progress.currentStepId}`,
        `Completed Steps: ${progress.completedSteps.length}`,
        `Completed Lessons: ${progress.completedLessons.length}`,
        `Updated At: ${progress.updatedAt}`,
      ].join("\n");
      return warning ? `${status}\n\nWarning: ${warning}` : status;
    }

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
