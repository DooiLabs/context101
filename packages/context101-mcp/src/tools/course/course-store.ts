import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

export type QuizResult = {
  stepId: string;
  question: string;
  correctAnswer: string;
  answer: string;
  result: {
    correct: boolean;
    score?: number;
  };
  recordedAt: string;
};

export type CourseProgress = {
  courseId: string;
  currentLessonId: string;
  currentStepId: string;
  completedSteps: string[];
  completedLessons: string[];
  updatedAt: string;
  quizResults: QuizResult[];
};

type CourseStore = {
  courses: Record<string, CourseProgress>;
  unknownQuizResults: QuizResult[];
};

const storeDir = path.join(os.homedir(), ".context101");
const storePath = path.join(storeDir, "progress.json");

let cachedStore: CourseStore | null = null;

async function ensureStoreDir() {
  await fs.mkdir(storeDir, { recursive: true });
}

async function loadStore(): Promise<CourseStore> {
  if (cachedStore) return cachedStore;
  await ensureStoreDir();
  if (!existsSync(storePath)) {
    cachedStore = { courses: {}, unknownQuizResults: [] };
    return cachedStore;
  }
  const content = await fs.readFile(storePath, "utf-8");
  cachedStore = JSON.parse(content) as CourseStore;
  cachedStore.courses ??= {};
  cachedStore.unknownQuizResults ??= [];
  return cachedStore;
}

async function saveStore(store: CourseStore) {
  await ensureStoreDir();
  await fs.writeFile(storePath, JSON.stringify(store, null, 2));
  cachedStore = store;
}

export async function getCourseProgress(courseId: string) {
  const store = await loadStore();
  return store.courses[courseId] ?? null;
}

export async function setCourseProgress(progress: CourseProgress) {
  const store = await loadStore();
  store.courses[progress.courseId] = progress;
  await saveStore(store);
}

export async function clearCourseProgress(courseId: string) {
  const store = await loadStore();
  if (store.courses[courseId]) {
    delete store.courses[courseId];
    await saveStore(store);
    return true;
  }
  return false;
}

export async function appendQuizResult(courseId: string | null, result: QuizResult) {
  const store = await loadStore();
  if (!courseId) {
    store.unknownQuizResults.push(result);
    await saveStore(store);
    return;
  }

  const existing = store.courses[courseId];
  if (existing) {
    existing.quizResults = [...(existing.quizResults ?? []), result];
    existing.updatedAt = new Date().toISOString();
    store.courses[courseId] = existing;
  } else {
    store.courses[courseId] = {
      courseId,
      currentLessonId: "",
      currentStepId: "",
      completedSteps: [],
      completedLessons: [],
      updatedAt: new Date().toISOString(),
      quizResults: [result],
    };
  }
  await saveStore(store);
}
