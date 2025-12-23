import { getDocsInputSchema } from "../course/schemas.js";
import { getDocs } from "../course/course-api.js";
import { resolveCourseId } from "../../config.js";

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
