import { startCourseInputSchema } from "./schemas.js";
import {
  buildCourseContent,
  loadCourseCatalog,
  loadStepContent,
} from "./course-content.js";
import { getUserContext, loadUserProgress, saveUserProgress } from "./course-store.js";
import { buildIntroductionPrompt, wrapLessonContent } from "./prompt.js";

function formatStartPayload(payload: {
  courseId: string;
  lessonId: string;
  stepId: string;
  content: string;
  includeIntro?: boolean;
  courseTitle: string;
  warning?: string | null;
}) {
  const intro = payload.includeIntro
    ? `${buildIntroductionPrompt(payload.courseTitle, payload.courseId)}\n\n`
    : "";
  const wrappedContent = wrapLessonContent(payload.content);
  const warning = payload.warning ? `\n\nWarning: ${payload.warning}` : "";
  return [
    `Course: ${payload.courseId}`,
    `Lesson: ${payload.lessonId}`,
    `Step: ${payload.stepId}`,
    "",
    `${intro}${wrappedContent}${warning}`,
  ].join("\n");
}

export const startCourseTool = {
  name: "startCourse",
  description: "Start or resume a specific course by courseId.",
  parameters: startCourseInputSchema,
  execute: async (
    args: { courseId: string; resume?: boolean },
    context?: { apiKey?: string }
  ) => {
    const { userId, warning } = getUserContext(context?.apiKey);

    const catalog = await loadCourseCatalog(200);
    const course = catalog.find((item) => item.id === args.courseId);
    if (!course) {
      return `Course "${args.courseId}" not found.`;
    }

    const content = await buildCourseContent(course.id);
    if (!content.lessons.length || !content.lessons[0].steps.length) {
      return `Course "${args.courseId}" has no content.`;
    }

    const progressByCourse = await loadUserProgress(userId);
    const existing = progressByCourse[course.id];
    const lesson = content.lessons[0];
    const firstStep = lesson.steps[0];

    const useExisting = args.resume !== false && existing;
    const lessonId = useExisting ? existing.currentLessonId : lesson.id;
    const stepId = useExisting ? existing.currentStepId : firstStep.id;
    const step = lesson.steps.find((item) => item.id === stepId) ?? firstStep;

    progressByCourse[course.id] = {
      courseId: course.id,
      currentLessonId: lessonId,
      currentStepId: step.id,
      completedSteps: useExisting ? existing!.completedSteps : [],
      completedLessons: useExisting ? existing!.completedLessons : [],
      updatedAt: new Date().toISOString(),
    };

    await saveUserProgress(userId, progressByCourse);
    const stepContent = await loadStepContent(step.contentPath);
    return formatStartPayload({
      courseId: course.id,
      lessonId,
      stepId: step.id,
      content: stepContent,
      courseTitle: course.title,
      includeIntro: !useExisting,
      warning,
    });
  },
};
