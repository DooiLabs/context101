import { nextCourseStepInputSchema } from "./schemas.js";
import {
  advanceCourseSession,
  fetchStepContentAndTrack,
} from "./course-content.js";
import { wrapLessonContent } from "./prompt.js";
import { resolveCourseId } from "../../config.js";

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
  execute: async (args: { courseId?: string }) => {
    const courseId = resolveCourseId(args.courseId);
    if (!courseId) {
      return "Pass courseId or start the server with --course <id>.";
    }
    const result = await advanceCourseSession(courseId);
    if (result.status === "missing") {
      return "No course progress found. Start with `startCourseLesson`.";
    }
    if (result.status === "completed") {
      return `Course "${courseId}" completed.`;
    }

    const step = result.session.steps[result.session.index];
    if (!step) {
      return `Course "${courseId}" has no next step.`;
    }

    return formatNextPayload({
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
