import { z } from "zod";

export const searchCoursesInputSchema = z.object({
  query: z
    .string()
    .optional()
    .default("")
    .describe("Search query to find courses."),
  tag: z.string().optional().describe("Filter by tag."),
  status: z
    .enum(["active", "draft", "archived"])
    .optional()
    .describe("Filter by status."),
  offset: z.number().int().min(0).optional().default(0),
  limit: z.number().int().min(1).max(50).optional().default(10),
});

const courseIdSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length === 0 ? undefined : value,
  z
    .string()
    .min(1)
    .optional()
    .describe("Course ID to start or resume. Defaults to --course."),
);

export const nextCourseStepInputSchema = z.object({
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

export const getCourseStatusInputSchema = z.object({
  courseId: courseIdSchema,
});

export const getOverviewInputSchema = z.object({
  courseId: courseIdSchema,
});

export const clearCourseProgressInputSchema = z.object({
  courseId: courseIdSchema,
  confirm: z.boolean().optional().default(false),
});

export const recordQuizResultInputSchema = z.object({
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

export const getDocsInputSchema = z.object({
  courseId: courseIdSchema.describe("Context101-compatible library ID."),
  mode: z.enum(["code", "info"]).optional().default("code"),
  tokens: z.number().int().min(10000).max(100000).optional().default(10000),
  topic: z.string().optional(),
});

export const startCourseLessonInputSchema = z.object({
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
