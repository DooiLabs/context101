import { z } from "zod";
import {
  fetchLessonContent,
  ensureCourseSession,
  syncSessionToStep,
  trackStepQuizRequirement,
} from "./utils/course-session.js";
import { getDefaultCourseId, resolveCourseId } from "../config.js";

const courseIdSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length === 0 ? undefined : value,
  z
    .string()
    .min(1)
    .optional()
    .describe("Course ID to start or resume. Defaults to --course."),
);

const startCourseLessonInputSchema = z.object({
  courseId: courseIdSchema,
  lessonId: z
    .string()
    .min(1)
    .optional()
    .describe("Lesson ID to start or review. Omit to resume the course."),
  stepId: z
    .string()
    .min(1)
    .optional()
    .describe("Step ID to resume directly within a lesson."),
  resume: z.boolean().optional().default(true),
});

const courseSearchLines = [
  "- If the user asks what courses are available, call the `searchCourses` tool with an empty query to return the full list.",
  "- Use the `searchCourses` tool to search courses by query. Passing an empty or whitespace query returns the full list.",
];

function buildCourseRestrictionLine(courseId: string) {
  if (!getDefaultCourseId()) return null;
  return `- This MCP server is locked to the ${courseId} course. Do not search for or switch to other courses.`;
}

function buildIntroductionPrompt(courseTitle: string, courseId: string) {
  const restrictionLine = buildCourseRestrictionLine(courseId);
  const lines = [
    `This is a course to help a new user learn about ${courseTitle}.`,
    "The following is the introduction content, please provide this text to the user EXACTLY as written below. Do not provide any other text or instructions:",
    "",
    `# Welcome to the ${courseTitle} Course!`,
    "",
    `Thank you for registering for the ${courseTitle} course! This interactive guide will help you learn the material step by step.`,
    "",
    "(Quick note: [Context101](https://github.com/DooiLabs/context101) is a free, open-source AI coding tutor. Stars mean a lot to developers. Thanks for using it, and hope you enjoy learning!)",
    "",
    "## How This Course Works",
    "",
    "- Each lesson is broken into multiple steps",
    "- I'll guide you through the code examples and explanations",
    "- You can ask questions at any time",
    `- If you ever leave and come back, use the \`startCourseLesson\` tool to pick up where you left off. Just ask to "start the ${courseId} course".`,
    '- Use the `nextCourseStep` tool to move to the next step when you\'re ready. Just ask to "move to the next step" when you are ready.',
  ];

  if (!getDefaultCourseId()) {
    lines.push(...courseSearchLines);
  }
  if (restrictionLine) {
    lines.push(restrictionLine);
  }

  lines.push(
    '- Use the `getCourseStatus` tool to check your progress. You can just ask "get my course progress".',
    '- Use the `clearCourseProgress` tool to reset your progress and start over. You can just ask "clear my course progress".',
    "",
    `Type "start ${courseId} course" and let's get started with your first lesson!`,
  );

  return `\n${lines.join("\n")}\n`;
}

const lessonPrompt = `
This is a course to help a new user learn the topic at hand.
Please help the user through the steps of the course by walking them through the content and following the course
to write the initial version of the code for them. The goal is to show them how the code works and explain it as they go
as the course goes on. Each lesson is broken up into steps. You should return the content of the step and ask the user
to move to the next step when they are ready. If the step contains instructions to write code, you should write the code
for the user when possible. You should always briefly explain the step before writing the code. Please ensure to
return any text in markdown blockquotes exactly as written in your response. When the user ask about their course progress or course status,
use the \`getCourseStatus\` tool to retrieve it.

Do not repeat the lesson verbatim. Adapt explanations to the user's answers, current knowledge, and the codebase state.
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
