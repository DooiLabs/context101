import { getCourseStatusInputSchema } from "./schemas.js";
import { getCourseSession } from "./course-content.js";
import { getAllCourseProgress } from "./course-store.js";
import { resolveCourseId } from "../../config.js";

export const getCourseStatusTool = {
  name: "getCourseStatus",
  description: "Get status for a course.",
  parameters: getCourseStatusInputSchema,
  execute: async (args: { courseId?: string }) => {
    const courseId = resolveCourseId(args.courseId);
    if (courseId) {
      const session = await getCourseSession(courseId);
      if (!session) {
        return "No course progress found. Start with `startCourseLesson`.";
      }
      const currentStep = session.steps[session.index];
      if (!currentStep) {
        return "No course progress found. Start with `startCourseLesson`.";
      }
      const completedSteps = Math.max(session.index, 0);
      const completedLessons = Object.values(session.lessonLastIndex).filter(
        (lastIndex) => lastIndex < session.index,
      ).length;

      return [
        `Course: ${courseId}`,
        `Current lesson: ${currentStep.lessonId}`,
        `Current step: ${currentStep.stepId}`,
        `Completed steps: ${completedSteps}`,
        `Completed lessons: ${completedLessons}`,
        `Updated at: ${session.updatedAt}`,
      ].join("\n");
    }

    const allProgress = await getAllCourseProgress();
    const courses = Object.values(allProgress);
    if (!courses.length) {
      return "No course progress found. Start with `startCourseLesson`.";
    }
    const lines = courses.map((progress) => {
      const completedSteps = progress.completedSteps?.length ?? 0;
      const completedLessons = progress.completedLessons?.length ?? 0;
      return [
        `- ${progress.courseId}`,
        `Lesson: ${progress.currentLessonId || "unknown"}`,
        `Step: ${progress.currentStepId || "unknown"}`,
        `Completed steps: ${completedSteps}`,
        `Completed lessons: ${completedLessons}`,
        `Updated: ${progress.updatedAt}`,
      ].join(" | ");
    });
    return ["Course progress:", "", ...lines].join("\n");
  },
};
