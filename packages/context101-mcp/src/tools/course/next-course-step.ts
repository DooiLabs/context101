import { nextCourseStepInputSchema } from "./schemas.js";
import { nextCourseStepRemote } from "./course-api.js";
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
    const response = await nextCourseStepRemote(args.courseId);
    const data = response.data;
    if (!data || !data.lessonId || !data.stepId || !data.content) {
      return `Course "${args.courseId}" has no next step.`;
    }

    return formatNextPayload({
      courseId: args.courseId,
      lessonId: data.lessonId,
      stepId: data.stepId,
      content: data.content,
    });
  },
};
