import { listLessons } from "./course-api.js";
import {
  fetchStepContentAndTrack,
  moveCourseSessionToLesson,
  ensureCourseSession,
  loadCourseCatalog,
} from "./course-content.js";
import { startCourseLessonInputSchema } from "./schemas.js";
import { buildIntroductionPrompt, wrapLessonContent } from "./prompt.js";
import { resolveCourseId } from "../../config.js";

function formatLessonPayload(payload: {
  courseId: string;
  lessonId: string;
  stepId: string;
  content: string;
  includeIntro?: boolean;
  courseTitle?: string;
}) {
  const intro =
    payload.includeIntro && payload.courseTitle
      ? `${buildIntroductionPrompt(payload.courseTitle, payload.courseId)}\n\n`
      : "";
  return [
    `Course: ${payload.courseId}`,
    `Lesson: ${payload.lessonId}`,
    `Step: ${payload.stepId}`,
    "",
    `${intro}${wrapLessonContent(payload.content)}`,
  ].join("\n");
}

export const startCourseLessonTool = {
  name: "startCourseLesson",
  description:
    "Start or resume a course. Optionally jump to a specific lesson by lessonId.",
  parameters: startCourseLessonInputSchema,
  execute: async (args: {
    courseId?: string;
    lessonId?: string;
    resume?: boolean;
  }) => {
    const courseId = resolveCourseId(args.courseId);
    if (!courseId) {
      return "Pass courseId or start the server with --course <id>.";
    }

    if (!args.lessonId) {
      const catalog = await loadCourseCatalog(100);
      const course = catalog.find((item) => item.id === courseId);
      if (!course) {
        return `Course "${courseId}" not found.`;
      }

      const session = await ensureCourseSession(
        course.id,
        args.resume !== false,
      );
      if (!session) {
        return `Course "${courseId}" has no content.`;
      }
      const step = session.steps[session.index];
      if (!step) {
        return `Course "${courseId}" has no content.`;
      }

      return formatLessonPayload({
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
    }

    const lessons = await listLessons(courseId);
    const lesson = lessons.data.find((item) => item.id === args.lessonId);
    if (!lesson) {
      const available = lessons.data
        .map((item) => `- ${item.id} (${item.title})`)
        .join("\n");
      return `Lesson "${args.lessonId}" not found.\n\nAvailable lessons:\n${available}`;
    }

    const result = await moveCourseSessionToLesson(courseId, lesson.id);
    if (result.status === "missing") {
      return `Course "${courseId}" has no content.`;
    }
    if (result.status === "missing_lesson") {
      return `Lesson "${args.lessonId}" not found.`;
    }

    const step = result.session.steps[result.session.index];
    if (!step) {
      return `Lesson "${args.lessonId}" has no steps.`;
    }

    return formatLessonPayload({
      courseId,
      lessonId: step.lessonId,
      stepId: step.stepId,
      content: await fetchStepContentAndTrack(
        courseId,
        step.lessonId,
        step.stepId,
      ),
    });
  },
};
