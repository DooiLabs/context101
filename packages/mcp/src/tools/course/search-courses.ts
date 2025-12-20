import { searchCoursesInputSchema } from "./schemas.js";
import { formatCourseList, searchCourses } from "./utils.js";

export const searchCoursesTool = {
  name: "searchCourses",
  description: "Search available courses by query.",
  parameters: searchCoursesInputSchema,
  execute: async (args: { query: string; limit?: number }) => {
    const results = await searchCourses(args.query, args.limit ?? 10);
    return formatCourseList(results);
  },
};
