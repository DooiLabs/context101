import { nextCourseStepInputSchema } from "./schemas.js";
import {
  getCourseSession,
  requestNextStep,
  syncSessionToStep,
  trackStepQuizRequirement,
} from "./course-content.js";
import { wrapLessonContent } from "./prompt.js";
import { resolveCourseId } from "../../config.js";
import { nextCourseStep } from "./course-api.js";

function formatNextPayload(payload: {
  courseId: string;
  lessonId: string;
  stepId: string;
  content: string;
}) {
  return [
    `Course: ${payload.courseId}`,
    `Lesson: ${payload.lessonId}`,
    `Step: ${payload.stepId}`,
    "",
    wrapLessonContent(payload.content),
  ].join("\n");
}

export const nextCourseStepTool = {
  name: "nextCourseStep",
  description: "Advance to the next step in a course.",
  parameters: nextCourseStepInputSchema,
  execute: async (args: {
    courseId?: string;
    currentStepId?: string;
    nextStepId?: string;
  }) => {
    const courseId = resolveCourseId(args.courseId);
    if (!courseId) {
      return "Pass courseId or start the server with --course <id>.";
    }
    if (args.currentStepId && args.nextStepId) {
      const response = await nextCourseStep({
        courseId,
        currentStepId: args.currentStepId,
        nextStepId: args.nextStepId,
      });
      if (response.status === "completed") {
        await syncSessionToStep(courseId, response.stepId);
        return `Course "${courseId}" completed.`;
      }
      await syncSessionToStep(courseId, response.stepId);
      await trackStepQuizRequirement(
        courseId,
        response.stepId,
        response.content,
      );
      return formatNextPayload({
        courseId: response.courseId,
        lessonId: response.lessonId,
        stepId: response.stepId,
        content: response.content,
      });
    }

    const session = await getCourseSession(courseId);
    if (!session) {
      return "No course progress found. Start with `startCourseLesson`.";
    }

    const result = await requestNextStep(courseId, session);
    if (result.status === "missing") {
      return "No course progress found. Start with `startCourseLesson`.";
    }
    if (result.status === "completed") {
      return `Course "${courseId}" completed.`;
    }

    const response = result.response;
    if (!response) {
      return `Course "${courseId}" has no next step.`;
    }

    await trackStepQuizRequirement(courseId, response.stepId, response.content);
    return formatNextPayload({
      courseId: response.courseId,
      lessonId: response.lessonId,
      stepId: response.stepId,
      content: response.content,
    });
  },
};
