import { getStep, listCourses, listLessons, listSteps } from "./course-api.js";

export type CourseMeta = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  source: string;
  version?: string;
  updatedAt: string;
  status: "active" | "draft" | "archived";
  overview?: {
    lessons: string[];
    lessonIds?: string[];
    stepCounts: number[];
    totalSteps?: number;
  };
};

export type CourseContent = {
  courseId: string;
  lessons: Array<{
    id: string;
    title: string;
    steps: Array<{
      id: string;
      title: string;
      lessonId: string;
      order: number;
    }>;
  }>;
};

export async function buildCourseContent(courseId: string): Promise<CourseContent> {
  const lessonsResponse = await listLessons(courseId);
  const lessons = await Promise.all(
    lessonsResponse.data.map(async (lesson) => {
      const stepsResponse = await listSteps(courseId, lesson.id);
      return {
        id: lesson.id,
        title: lesson.title,
        steps: stepsResponse.data
          .map((step) => ({
            id: step.id,
            title: step.title,
            order: step.order,
            lessonId: lesson.id,
          }))
          .sort((a, b) => a.order - b.order),
      };
    })
  );

  return {
    courseId,
    lessons,
  };
}

export async function loadCourseCatalog(limit: number) {
  const response = await listCourses(undefined, limit, 0);
  return response.data.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description ?? "",
    tags: course.tags ?? [],
    source: "context101",
    version: course.version,
    updatedAt: course.updatedAt,
    status: course.status === "draft" || course.status === "archived" ? course.status : "active",
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

export async function fetchStepContent(courseId: string, lessonId: string, stepId: string) {
  const response = await getStep(courseId, lessonId, stepId);
  return response.data.content;
}
