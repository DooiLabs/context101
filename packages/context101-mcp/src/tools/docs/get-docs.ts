import { getDocsInputSchema } from "../course/schemas.js";
import { fetchDocs } from "./docs-api.js";

export const getDocsTool = {
  name: "getDocs",
  description: "Fetch documentation from Context101 docs proxy.",
  parameters: getDocsInputSchema,
  execute: async (args: {
    id: string;
    mode?: "code" | "info";
    tokens?: number;
    topic?: string;
  }) => {
    return fetchDocs(args);
  },
};
