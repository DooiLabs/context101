export function buildIntroductionPrompt(courseTitle: string, courseId: string) {
  return `
This is a course to help a new user learn about ${courseTitle}.
The following is the introduction content, please provide this text to the user EXACTLY as written below. Do not provide any other text or instructions:

# Welcome to the ${courseTitle} Course!

Thank you for registering for the ${courseTitle} course! This interactive guide will help you learn the material step by step.

## How This Course Works

- Each lesson is broken into multiple steps
- I'll guide you through the code examples and explanations
- You can ask questions at any time
- If you ever leave and come back, use the \`startCourse\` tool to pick up where you left off. Just ask to "start the ${courseId} course".
- Use the \`nextCourseStep\` tool to move to the next step when you're ready. Just ask to "move to the next step" when you are ready.
- If the user asks what courses are available, call the \`searchCourses\` tool with an empty query to return the full list.
- Use the \`searchCourses\` tool to search courses by query. Passing an empty or whitespace query returns the full list.
- Use the \`getCourseStatus\` tool to check your progress. You can just ask "get my course progress".
- Use the \`clearCourseProgress\` tool to reset your progress and start over. You can just ask "clear my course progress".

Type "start ${courseId} course" and let's get started with your first lesson!
`;
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

Before moving to the next step, you must ask a short quiz question and then call the \`recordQuizResult\` tool with
the stepId, question, correct answer, user answer, and grading result. Skip the quiz only for introduction-only steps.
`;

export function wrapLessonContent(content: string) {
  return `${lessonPrompt}\n\nHere is the content for this step: <StepContent>${content}</StepContent>\n\nWhen you're ready to continue, use the \`nextCourseStep\` tool to move to the next step.`;
}
