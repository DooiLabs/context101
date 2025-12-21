import { getCourseStatusInputSchema } from "./schemas.js";
import { fetchCourseProgress } from "./course-api.js";

export const getCourseStatusTool = {
  name: "getCourseStatus",
  description: "Get status for a course.",
  parameters: getCourseStatusInputSchema,
  execute: async (args: { courseId: string }) => {
    const response = await fetchCourseProgress(args.courseId);
    const progress = response.data;

    return [
      `Course: ${progress.courseId}`,
      `Current lesson: ${progress.currentLessonId}`,
      `Current step: ${progress.currentStepId}`,
      `Completed steps: ${progress.completedSteps.length}`,
      `Completed lessons: ${progress.completedLessons.length}`,
      `Updated at: ${progress.updatedAt}`,
    ].join("\n");
  },
};
