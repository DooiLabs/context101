import { startCourseInputSchema } from "./schemas.js";
import {
  ensureCourseSession,
  fetchStepContentAndTrack,
  loadCourseCatalog,
} from "./course-content.js";
import { buildIntroductionPrompt, wrapLessonContent } from "./prompt.js";

function formatStartPayload(payload: {
  courseId: string;
  lessonId: string;
  stepId: string;
  content: string;
  includeIntro?: boolean;
  courseTitle: string;
}) {
  const intro = payload.includeIntro
    ? `${buildIntroductionPrompt(payload.courseTitle, payload.courseId)}\n\n`
    : "";
  const wrappedContent = wrapLessonContent(payload.content);
  return [
    `Course: ${payload.courseId}`,
    `Lesson: ${payload.lessonId}`,
    `Step: ${payload.stepId}`,
    "",
    `${intro}${wrappedContent}`,
  ].join("\n");
}

export const startCourseTool = {
  name: "startCourse",
  description: "Start or resume a specific course by courseId.",
  parameters: startCourseInputSchema,
  execute: async (args: { courseId: string; resume?: boolean }) => {
    const catalog = await loadCourseCatalog(100);
    const course = catalog.find((item) => item.id === args.courseId);
    if (!course) {
      return `Course "${args.courseId}" not found.`;
    }

    const session = await ensureCourseSession(course.id, args.resume !== false);
    if (!session) {
      return `Course "${args.courseId}" has no content.`;
    }
    const step = session.steps[session.index];
    if (!step) {
      return `Course "${args.courseId}" has no content.`;
    }

    return formatStartPayload({
      courseId: course.id,
      lessonId: step.lessonId,
      stepId: step.stepId,
      content: await fetchStepContentAndTrack(
        course.id,
        step.lessonId,
        step.stepId,
      ),
      courseTitle: course.title,
      includeIntro: true,
    });
  },
};
