import { z } from "zod";
import {
  findCourseIdByStepId,
  recordQuizResult,
} from "./utils/course-session.js";

const recordQuizResultInputSchema = z.object({
  stepId: z.string().min(1).describe("Step ID to record quiz result for."),
  question: z.string().min(1).describe("Quiz question presented to the user."),
  correctAnswer: z.string().min(1).describe("Expected answer for grading."),
  answer: z.string().min(1).describe("User answer captured by the LLM."),
  result: z
    .object({
      correct: z.boolean().describe("Whether the answer is correct."),
      score: z
        .number()
        .min(0)
        .max(1)
        .optional()
        .describe("Optional score between 0 and 1."),
    })
    .describe("Grading result by the LLM."),
});

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
