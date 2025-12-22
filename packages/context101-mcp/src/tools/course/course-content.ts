import { getStep, listCourses, listLessons, listSteps } from "./course-api.js";
import {
  appendQuizResult,
  clearCourseProgress,
  getCourseProgress,
  getLatestQuizResult,
  isStepQuizRequired,
  setCourseProgress,
  setStepQuizRequired,
  type QuizResult,
} from "./course-store.js";

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

function detectQuizRequirement(content: string) {
  const hasQuiz =
    /(^|\n)#{1,6}\s*quiz\b/i.test(content) ||
    /(^|\n)\s*quiz\s*:/i.test(content);
  const hasAnswer =
    /(^|\n)#{1,6}\s*answer\b/i.test(content) ||
    /(^|\n)\s*answer\s*:/i.test(content);
  return hasQuiz && hasAnswer;
}

export async function fetchStepContentAndTrack(
  courseId: string,
  lessonId: string,
  stepId: string,
) {
  const content = await fetchStepContent(courseId, lessonId, stepId);
  const quizRequired = detectQuizRequirement(content);
  await setStepQuizRequired(courseId, stepId, quizRequired);
  return content;
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

function buildProgressFromSession(courseId: string, session: CourseSession) {
  const current = session.steps[session.index];
  const completedSteps = session.steps
    .slice(0, session.index)
    .map((step) => step.stepId);
  const completedLessons = Object.entries(session.lessonLastIndex)
    .filter(([, lastIndex]) => lastIndex < session.index)
    .map(([lessonId]) => lessonId);

  return {
    courseId,
    currentLessonId: current?.lessonId ?? "",
    currentStepId: current?.stepId ?? "",
    completedSteps,
    completedLessons,
    updatedAt: session.updatedAt,
  };
}

async function persistSession(courseId: string, session: CourseSession) {
  const existing = await getCourseProgress(courseId);
  const base = buildProgressFromSession(courseId, session);
  await setCourseProgress({
    ...base,
    quizResults: existing?.quizResults ?? [],
    stepQuizRequired: existing?.stepQuizRequired ?? {},
  });
}

export async function ensureCourseSession(courseId: string, resume: boolean) {
  const existingSession = courseSessions.get(courseId);
  if (existingSession && resume) {
    return existingSession;
  }

  const steps = await buildCourseStepList(courseId);
  if (!steps.length) return null;

  let index = 0;
  const stored = resume ? await getCourseProgress(courseId) : null;
  if (stored?.currentStepId) {
    const match = steps.findIndex(
      (step) => step.stepId === stored.currentStepId,
    );
    if (match >= 0) index = match;
  }

  const session: CourseSession = {
    steps,
    index,
    updatedAt: stored?.updatedAt ?? new Date().toISOString(),
    lessonLastIndex: buildLessonLastIndex(steps),
  };
  courseSessions.set(courseId, session);
  await persistSession(courseId, session);
  return session;
}

export async function getCourseSession(courseId: string) {
  const session = courseSessions.get(courseId);
  if (session) return session;
  return ensureCourseSession(courseId, true);
}

export async function advanceCourseSession(courseId: string) {
  const session = courseSessions.get(courseId);
  if (!session) return { status: "missing" as const };
  if (session.index + 1 >= session.steps.length) {
    session.updatedAt = new Date().toISOString();
    await persistSession(courseId, session);
    return { status: "completed" as const, session };
  }
  session.index += 1;
  session.updatedAt = new Date().toISOString();
  await persistSession(courseId, session);
  return { status: "ok" as const, session };
}

export async function clearCourseSession(courseId: string) {
  courseSessions.delete(courseId);
  return clearCourseProgress(courseId);
}

export function findCourseIdByStepId(stepId: string) {
  for (const [courseId, session] of courseSessions.entries()) {
    if (session.steps.some((step) => step.stepId === stepId)) {
      return courseId;
    }
  }
  return null;
}

export async function recordQuizResult(
  courseId: string | null,
  result: QuizResult,
) {
  await appendQuizResult(courseId, result);
}

export async function canAdvanceCourse(courseId: string, stepId: string) {
  const quizRequired = await isStepQuizRequired(courseId, stepId);
  if (!quizRequired) return { ok: true as const };
  const latest = await getLatestQuizResult(courseId, stepId);
  if (!latest) {
    return { ok: false as const, reason: "missing" as const };
  }
  if (!latest.result.correct) {
    return { ok: false as const, reason: "incorrect" as const };
  }
  return { ok: true as const };
}
