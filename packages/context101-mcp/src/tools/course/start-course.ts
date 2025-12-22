import { startCourseInputSchema } from "./schemas.js";
import {
  ensureCourseSession,
  fetchStepContentAndTrack,
  loadCourseCatalog,
} from "./course-content.js";
import { buildIntroductionPrompt, wrapLessonContent } from "./prompt.js";
import { resolveCourseId } from "../../config.js";

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
  execute: async (args: { courseId?: string; resume?: boolean }) => {
    const courseId = resolveCourseId(args.courseId);
    if (!courseId) {
      return "Pass courseId or start the server with --course <id>.";
    }
    const catalog = await loadCourseCatalog(100);
    const course = catalog.find((item) => item.id === courseId);
    if (!course) {
      return `Course "${courseId}" not found.`;
    }

    const session = await ensureCourseSession(course.id, args.resume !== false);
    if (!session) {
      return `Course "${courseId}" has no content.`;
    }
    const step = session.steps[session.index];
    if (!step) {
      return `Course "${courseId}" has no content.`;
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
