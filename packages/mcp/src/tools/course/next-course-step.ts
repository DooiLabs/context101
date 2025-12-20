import { nextCourseStepInputSchema } from "./schemas.js";
import {
  buildCourseContent,
  ensureApiKey,
  formatStartPayload,
  loadStepContent,
  loadUserProgress,
  saveUserProgress,
} from "./utils.js";

export const nextCourseStepTool = {
  name: "nextCourseStep",
  description: "Advance to the next step in a course.",
  parameters: nextCourseStepInputSchema,
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

    const content = await buildCourseContent(args.courseId);
    const lesson =
      content.lessons.find((item) => item.id === progress.currentLessonId) ?? content.lessons[0];
    const steps = lesson.steps;
    const currentIndex = steps.findIndex((step) => step.id === progress.currentStepId);
    if (currentIndex === -1) {
      return "Current step not found. Start the course again.";
    }

    const nextStep = steps[currentIndex + 1];
    if (!nextStep) {
      progress.completedLessons = Array.from(new Set([...progress.completedLessons, lesson.id]));
      progress.updatedAt = new Date().toISOString();
      await saveUserProgress(userId, progressByCourse);
      return `Course "${args.courseId}" completed.`;
    }

    progress.completedSteps = Array.from(new Set([...progress.completedSteps, steps[currentIndex].id]));
    progress.currentStepId = nextStep.id;
    progress.updatedAt = new Date().toISOString();
    await saveUserProgress(userId, progressByCourse);

    const stepContent = await loadStepContent(nextStep.contentPath);
    return formatStartPayload({
      courseId: args.courseId,
      lessonId: lesson.id,
      stepId: nextStep.id,
      content: stepContent,
    });
  },
};
