import { searchCoursesInputSchema } from "./schemas.js";
import { listCourses } from "./course-api.js";
import { CourseMeta } from "./course-content.js";
import { getDefaultCourseId } from "../../config.js";

async function searchCourses(params: {
  query?: string;
  tag?: string;
  status?: "active" | "draft" | "archived";
  limit: number;
  offset: number;
}) {
  const response = await listCourses({
    query: params.query,
    tag: params.tag,
    status: params.status,
    limit: params.limit,
    offset: params.offset,
  });
  return response.data.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description ?? "",
    tags: course.tags ?? [],
    source: "context101",
    version: course.version ?? undefined,
    updatedAt: course.updatedAt,
    status:
      course.status === "draft" || course.status === "archived"
        ? course.status
        : "active",
    overview: course.overview
      ? {
          lessons: course.overview.lessons ?? [],
          lessonIds: course.overview.lessonIds ?? [],
          stepCounts: course.overview.stepCounts ?? [],
          totalSteps: course.overview.totalSteps ?? undefined,
        }
      : undefined,
  })) satisfies CourseMeta[];
}

function formatCourseOverview(
  lessonTitles: string[],
  stepCounts: number[],
  totalSteps?: number,
) {
  if (!lessonTitles.length) return "Lessons: unknown";
  const lessonSummary = lessonTitles.join(", ");
  const stepSummary = stepCounts.map((count) => String(count)).join(", ");
  const total = totalSteps !== undefined ? ` | Total steps: ${totalSteps}` : "";
  return `Lessons: ${lessonSummary} | Steps per lesson: ${stepSummary}${total}`;
}

async function formatCourseList(courses: CourseMeta[]) {
  if (!courses.length) return "No courses found.";
  const lines = await Promise.all(
    courses.map(async (course) => {
      const lessonTitles = course.overview?.lessons ?? [];
      const stepCounts = course.overview?.stepCounts ?? [];
      const totalSteps = course.overview?.totalSteps;
      const overview = formatCourseOverview(
        lessonTitles,
        stepCounts,
        totalSteps,
      );
      return `- ${course.title} (${course.id}) | ${overview}`;
    }),
  );
  return ["Available courses:", "", ...lines].join("\n");
}

export const searchCoursesTool = {
  name: "searchCourses",
  description: "Search available courses by query.",
  parameters: searchCoursesInputSchema,
  execute: async (args: {
    query?: string;
    tag?: string;
    status?: "active" | "draft" | "archived";
    limit?: number;
    offset?: number;
  }) => {
    if (getDefaultCourseId()) {
      return "Course search is disabled when the server is locked to a single course.";
    }
    const normalized = (args.query ?? "").trim();
    const results = await searchCourses({
      query: normalized || undefined,
      tag: args.tag,
      status: args.status,
      limit: args.limit ?? 10,
      offset: args.offset ?? 0,
    });
    return formatCourseList(results);
  },
};
