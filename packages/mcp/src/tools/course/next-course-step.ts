import { nextCourseStepInputSchema } from "./schemas.js";
import { buildCourseContent, loadStepContent } from "./course-content.js";
import { canUseCourseApi, nextCourseStepRemote } from "./course-api.js";
import { getUserContext, loadUserProgress, saveUserProgress } from "./course-store.js";
import { wrapLessonContent } from "./prompt.js";

function formatStepPayload(payload: {
  courseId: string;
  lessonId: string;
  stepId: string;
  content: string;
  warning?: string | null;
}) {
  const wrappedContent = wrapLessonContent(payload.content);
  const warning = payload.warning ? `\n\nWarning: ${payload.warning}` : "";
  return [
    `Course: ${payload.courseId}`,
    `Lesson: ${payload.lessonId}`,
    `Step: ${payload.stepId}`,
    "",
    `${wrappedContent}${warning}`,
  ].join("\n");
}

export const nextCourseStepTool = {
  name: "nextCourseStep",
  description: "Advance to the next step in a course.",
  parameters: nextCourseStepInputSchema,
  execute: async (
    args: { courseId: string },
    context?: { apiKey?: string }
  ) => {
    const apiKey = context?.apiKey;
    const { userId, warning } = getUserContext(apiKey);

    if (canUseCourseApi(apiKey)) {
      const response = await nextCourseStepRemote(args.courseId, apiKey!);
      const data = response.data;
      if (data?.status === "completed") {
        return `Course "${args.courseId}" completed.${warning ? `\n\nWarning: ${warning}` : ""}`;
      }
      if (!data || !data.lessonId || !data.stepId || !data.content) {
        return "No course progress found. Start the course first.";
      }
      return formatStepPayload({
        courseId: args.courseId,
        lessonId: data.lessonId,
        stepId: data.stepId,
        content: data.content,
        warning,
      });
    }

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
      return `Course "${args.courseId}" completed.${warning ? `\n\nWarning: ${warning}` : ""}`;
    }

    progress.completedSteps = Array.from(new Set([...progress.completedSteps, steps[currentIndex].id]));
    progress.currentStepId = nextStep.id;
    progress.updatedAt = new Date().toISOString();
    await saveUserProgress(userId, progressByCourse);

    const stepContent = await loadStepContent(nextStep.contentPath);
    return formatStepPayload({
      courseId: args.courseId,
      lessonId: lesson.id,
      stepId: nextStep.id,
      content: stepContent,
      warning,
    });
  },
};
