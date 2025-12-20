import { searchCoursesInputSchema } from "./schemas.js";
import { buildCourseContent, loadCourseCatalog, CourseMeta } from "./course-content.js";

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

function formatCourseOverview(lessonTitles: string[], stepCounts: number[], totalSteps?: number) {
  if (!lessonTitles.length) return "Lessons: none";
  const lessonSummary = lessonTitles.join(", ");
  const stepSummary = stepCounts.map((count) => String(count)).join(", ");
  const total = totalSteps !== undefined ? ` | Total steps: ${totalSteps}` : "";
  return `Lessons: ${lessonSummary} | Steps per lesson: ${stepSummary}${total}`;
}

async function formatCourseList(courses: CourseMeta[]) {
  if (!courses.length) return "No courses found.";
  const lines = await Promise.all(
    courses.map(async (course) => {
      let lessonTitles = course.overview?.lessons ?? [];
      let stepCounts = course.overview?.stepCounts ?? [];
      let totalSteps = course.overview?.totalSteps;

      if (!lessonTitles.length || !stepCounts.length) {
        const content = await buildCourseContent(course.id);
        lessonTitles = content.lessons.map((lesson) => lesson.title);
        stepCounts = content.lessons.map((lesson) => lesson.steps.length);
        totalSteps = stepCounts.reduce((sum, count) => sum + count, 0);
      }

      const overview = formatCourseOverview(lessonTitles, stepCounts, totalSteps);
      return `- ${course.title} (${course.id}) | ${overview}`;
    })
  );
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
