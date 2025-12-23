import { z } from "zod";
import {
  getCourseSession,
  requestNextStep,
  syncSessionToStep,
  trackStepQuizRequirement,
} from "./utils/course-session.js";
import { getDefaultCourseId, resolveCourseId } from "../config.js";
import { nextCourseStep } from "./utils/course-api.js";

const courseIdSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length === 0 ? undefined : value,
  z
    .string()
    .min(1)
    .optional()
    .describe("Course ID to start or resume. Defaults to --course."),
);

const nextCourseStepInputSchema = z.object({
  courseId: courseIdSchema,
  currentStepId: z
    .string()
    .min(1)
    .optional()
    .describe("Current step ID for next step lookup."),
  nextStepId: z
    .string()
    .min(1)
    .optional()
    .describe("Next step ID to fetch directly."),
});

const lessonPrompt = `
This is a course to help a new user learn the topic at hand.
Please help the user through the steps of the course by walking them through the content and following the course
to write the initial version of the code for them. The goal is to show them how the code works and explain it as they go
as the course goes on. Each lesson is broken up into steps. You should return the content of the step and ask the user
to move to the next step when they are ready. If the step contains instructions to write code, you should write the code
for the user when possible. You should always briefly explain the step before writing the code. Please ensure to
return any text in markdown blockquotes exactly as written in your response. When the user ask about their course progress or course status,
use the \`getCourseStatus\` tool to retrieve it.
`;

const courseSearchPrompt = `
If the user asks what courses are available, call the \`searchCourses\` tool with an empty query to return the full list.
Use the \`searchCourses\` tool to search courses by query. Passing an empty or whitespace query returns the full list.
`;

const courseRestrictionPrompt = `
This MCP server is locked to a single course. Do not search for or switch to other courses.
`;

const quizPrompt = `
If the step content includes a quiz and an answer, you must present the quiz content to the user. Do not hide or omit it.
Do not invent a quiz when the content does not contain one; in that case, proceed normally to the next step when ready.
Keep quiz wording aligned with the lesson's phrasing and respond in the user's language.
If a quiz and answer are present, ask the quiz from the content and wait for the user's response. Grade the answer
using the provided answer in the content, then call \`recordQuizResult\` with the stepId, question, correct answer,
user answer, and grading result. If the answer is incorrect, ask them to try again before moving on.
Do not reveal the correct answer or the user's answer in the chat. The answer should only appear inside the
\`recordQuizResult\` tool call payload.

When the user asks for library or framework details, call the \`getDocs\` tool first and answer using its response.
`;

function wrapLessonContent(content: string) {
  const promptParts = [lessonPrompt];
  if (getDefaultCourseId()) {
    promptParts.push(courseRestrictionPrompt);
  } else {
    promptParts.push(courseSearchPrompt);
  }
  promptParts.push(quizPrompt);
  return `${promptParts.join("\n")}\n\nHere is the content for this step: <StepContent>${content}</StepContent>\n\nWhen you're ready to continue, use the \`nextCourseStep\` tool to move to the next step.`;
}

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
