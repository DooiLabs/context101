import { findCourseIdByStepId, recordQuizResult } from "./course-content.js";
import { recordQuizResultInputSchema } from "./schemas.js";

export const recordQuizResultTool = {
  name: "recordQuizResult",
  description: "Record quiz result for a step.",
  parameters: recordQuizResultInputSchema,
  execute: async (args: {
    stepId: string;
    question: string;
    correctAnswer: string;
    answer: string;
    result: { correct: boolean; score?: number };
  }) => {
    const courseId = findCourseIdByStepId(args.stepId);
    await recordQuizResult(courseId, {
      stepId: args.stepId,
      question: args.question,
      correctAnswer: args.correctAnswer,
      answer: args.answer,
      result: args.result,
      recordedAt: new Date().toISOString(),
    });
    return "";
  },
};
