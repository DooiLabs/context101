import { nextCourseStepInputSchema } from "./schemas.js";
import {
  advanceCourseSession,
  fetchStepContentAndTrack,
} from "./course-content.js";
import { wrapLessonContent } from "./prompt.js";

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
  execute: async (args: { courseId: string }) => {
    const result = await advanceCourseSession(args.courseId);
    if (result.status === "missing") {
      return "No course progress found. Start the course first.";
    }
    if (result.status === "completed") {
      return `Course "${args.courseId}" completed.`;
    }

    const step = result.session.steps[result.session.index];
    if (!step) {
      return `Course "${args.courseId}" has no next step.`;
    }

    return formatNextPayload({
      courseId: args.courseId,
      lessonId: step.lessonId,
      stepId: step.stepId,
      content: await fetchStepContentAndTrack(
        args.courseId,
        step.lessonId,
        step.stepId,
      ),
    });
  },
};
