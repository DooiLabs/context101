import { z } from "zod";
import { getDocs } from "./utils/course-api.js";
import { resolveCourseId } from "../config.js";

const courseIdSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length === 0 ? undefined : value,
  z
    .string()
    .min(1)
    .optional()
    .describe("Course ID to start or resume. Defaults to --course."),
);

const getDocsInputSchema = z.object({
  courseId: courseIdSchema.describe("Context101-compatible library ID."),
  mode: z.enum(["code", "info"]).optional().default("code"),
  tokens: z.number().int().min(10000).max(100000).optional().default(10000),
  topic: z.string().optional(),
});

export const getDocsTool = {
  name: "getDocs",
  description: "Fetch documentation from Context101 docs proxy.",
  parameters: getDocsInputSchema,
  execute: async (args: {
    courseId?: string;
    mode?: "code" | "info";
    tokens?: number;
    topic?: string;
  }) => {
    const courseId = resolveCourseId(args.courseId);
    if (!courseId) {
      return "Pass courseId or start the server with --course <id>.";
    }
    const response = await getDocs({
      courseId,
      mode: args.mode,
      tokens: args.tokens,
      topic: args.topic,
    });
    return response.text;
  },
};
