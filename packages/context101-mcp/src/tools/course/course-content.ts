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
    order: number;
    steps: Array<{
      id: string;
      title: string;
      lessonId: string;
      order: number;
    }>;
  }>;
};

type CourseStep = {
  lessonId: string;
  stepId: string;
  title: string;
  lessonOrder: number;
  stepOrder: number;
};

type CourseSession = {
  steps: CourseStep[];
  index: number;
  updatedAt: string;
  lessonLastIndex: Record<string, number>;
};

const courseSessions = new Map<string, CourseSession>();

export async function buildCourseContent(
  courseId: string,
): Promise<CourseContent> {
  const lessonsResponse = await listLessons(courseId);
  const sortedLessons = [...lessonsResponse.data].sort(
    (a, b) => a.order - b.order,
  );
  const lessons = await Promise.all(
    sortedLessons.map(async (lesson) => {
      const stepsResponse = await listSteps(courseId, lesson.id);
      return {
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        steps: stepsResponse.data
          .map((step) => ({
            id: step.id,
            title: step.title,
            order: step.order,
            lessonId: lesson.id,
          }))
          .sort((a, b) => a.order - b.order),
      };
    }),
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

export async function fetchStepContent(
  courseId: string,
  lessonId: string,
  stepId: string,
) {
  const response = await getStep(courseId, lessonId, stepId);
  return response.data.content;
}

function buildLessonLastIndex(steps: CourseStep[]) {
  const lessonLastIndex: Record<string, number> = {};
  steps.forEach((step, index) => {
    lessonLastIndex[step.lessonId] = index;
  });
  return lessonLastIndex;
}

async function buildCourseStepList(courseId: string): Promise<CourseStep[]> {
  const content = await buildCourseContent(courseId);
  const steps: CourseStep[] = [];
  content.lessons.forEach((lesson, lessonIndex) => {
    lesson.steps.forEach((step) => {
      steps.push({
        lessonId: step.lessonId,
        stepId: step.id,
        title: step.title,
        lessonOrder: lessonIndex,
        stepOrder: step.order,
      });
    });
  });
  return steps;
}

export async function startCourseSession(courseId: string) {
  const steps = await buildCourseStepList(courseId);
  if (!steps.length) return null;
  const session: CourseSession = {
    steps,
    index: 0,
    updatedAt: new Date().toISOString(),
    lessonLastIndex: buildLessonLastIndex(steps),
  };
  courseSessions.set(courseId, session);
  return session;
}

export function getCourseSession(courseId: string) {
  return courseSessions.get(courseId);
}

export function advanceCourseSession(courseId: string) {
  const session = courseSessions.get(courseId);
  if (!session) return { status: "missing" as const };
  if (session.index + 1 >= session.steps.length) {
    session.updatedAt = new Date().toISOString();
    return { status: "completed" as const, session };
  }
  session.index += 1;
  session.updatedAt = new Date().toISOString();
  return { status: "ok" as const, session };
}

export function clearCourseSession(courseId: string) {
  return courseSessions.delete(courseId);
}
