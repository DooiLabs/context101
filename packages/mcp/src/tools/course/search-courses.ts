import { searchCoursesInputSchema } from "./schemas.js";
import { loadCourseCatalog, CourseMeta } from "./course-content.js";

function scoreCourse(query: string, course: CourseMeta) {
  const q = query.toLowerCase();
  let score = 0;
  if (course.id.toLowerCase().includes(q)) score += 3;
  if (course.title.toLowerCase().includes(q)) score += 4;
  if (course.description.toLowerCase().includes(q)) score += 2;
  if (course.tags.some((tag) => tag.toLowerCase().includes(q))) score += 2;
  return score;
}

async function searchCourses(query: string, limit: number) {
  const catalog = await loadCourseCatalog(200);
  return catalog
    .map((course) => ({ course, score: scoreCourse(query, course) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.course);
}

function formatCourseList(courses: CourseMeta[]) {
  if (!courses.length) return "No courses found.";
  const lines = courses.map((course) => `- ${course.title} (${course.id})`);
  return ["Available courses:", "", ...lines].join("\n");
}

export const searchCoursesTool = {
  name: "searchCourses",
  description: "Search available courses by query.",
  parameters: searchCoursesInputSchema,
  execute: async (args: { query: string; limit?: number }) => {
    const results = await searchCourses(args.query, args.limit ?? 10);
    return formatCourseList(results);
  },
};
