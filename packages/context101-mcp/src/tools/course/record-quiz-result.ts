import { recordQuizResultInputSchema } from "./schemas.js";

export const recordQuizResultTool = {
  name: "recordQuizResult",
  description: "Record quiz result for a step.",
  parameters: recordQuizResultInputSchema,
  execute: async (_args: {
    stepId: string;
    question: string;
    correctAnswer: string;
    answer: string;
    result: { correct: boolean; score?: number };
  }) => {
    return "";
  },
};
