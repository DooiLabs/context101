import { startCourseInputSchema } from "./schemas.js";
import { loadCourseCatalog } from "./course-content.js";
import { startCourseRemote } from "./course-api.js";
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
    const catalog = await loadCourseCatalog(200);
    const course = catalog.find((item) => item.id === args.courseId);
    if (!course) {
      return `Course "${args.courseId}" not found.`;
    }

    const response = await startCourseRemote(course.id, args.resume !== false);
    const data = response.data;
    if (!data || !data.lessonId || !data.stepId || !data.content) {
      return `Course "${args.courseId}" has no content.`;
    }

    return formatStartPayload({
      courseId: course.id,
      lessonId: data.lessonId,
      stepId: data.stepId,
      content: data.content,
      courseTitle: course.title,
      includeIntro: true,
    });
  },
};
