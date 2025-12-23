import {
  fetchLessonContent,
  ensureCourseSession,
  syncSessionToStep,
  trackStepQuizRequirement,
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
    stepId?: string;
    resume?: boolean;
  }) => {
    const courseId = resolveCourseId(args.courseId);
    if (!courseId) {
      return "Pass courseId or start the server with --course <id>.";
    }

    if (args.stepId) {
      const response = await fetchLessonContent({
        courseId,
        stepId: args.stepId,
        lessonId: args.lessonId,
      });
      await syncSessionToStep(courseId, response.stepId);
      await trackStepQuizRequirement(
        courseId,
        response.stepId,
        response.content,
      );
      return formatLessonPayload({
        courseId: response.courseId,
        lessonId: response.lessonId,
        stepId: response.stepId,
        content: response.content,
      });
    }

    if (!args.lessonId) {
      const session = await ensureCourseSession(
        courseId,
        args.resume !== false,
      );
      if (!session) {
        return `Course "${courseId}" has no content.`;
      }
      const step = session.steps[session.index];
      if (!step) {
        return `Course "${courseId}" has no content.`;
      }
      const response = await fetchLessonContent({
        courseId,
        stepId: step.stepId,
      });
      await syncSessionToStep(courseId, response.stepId);
      await trackStepQuizRequirement(
        courseId,
        response.stepId,
        response.content,
      );
      return formatLessonPayload({
        courseId: response.courseId,
        lessonId: response.lessonId,
        stepId: response.stepId,
        content: response.content,
        courseTitle: response.courseTitle,
        includeIntro: true,
      });
    }

    const response = await fetchLessonContent({
      courseId,
      lessonId: args.lessonId,
    });
    await syncSessionToStep(courseId, response.stepId);
    await trackStepQuizRequirement(courseId, response.stepId, response.content);
    return formatLessonPayload({
      courseId: response.courseId,
      lessonId: response.lessonId,
      stepId: response.stepId,
      content: response.content,
    });
  },
};
