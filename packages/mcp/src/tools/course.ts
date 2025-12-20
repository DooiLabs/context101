import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { z } from "zod";
import { fromPackageRoot } from "../lib/path.js";

type CourseMeta = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  source: string;
  version?: string;
  updatedAt: string;
  status: "active" | "draft" | "archived";
};

type CourseContent = {
  courseId: string;
  lessons: Array<{
    id: string;
    title: string;
    steps: Array<{
      id: string;
      title: string;
      contentPath: string;
      order: number;
    }>;
  }>;
};

type CourseProgress = {
  courseId: string;
  currentLessonId: string;
  currentStepId: string;
  completedSteps: string[];
  completedLessons: string[];
  updatedAt: string;
};

const coursesBaseDir = fromPackageRoot(".docs/raw/course");
const progressBaseDir = path.join(os.homedir(), ".cache", "context101", "course");

const searchCoursesInputSchema = z.object({
  query: z.string().min(1).describe("Search query to find courses."),
  limit: z.number().int().min(1).max(50).optional().default(10),
});

const startCourseInputSchema = z.object({
  courseId: z.string().min(1).describe("Course ID to start or resume."),
  resume: z.boolean().optional().default(true),
});

const nextCourseStepInputSchema = z.object({
  courseId: z.string().min(1).describe("Course ID to advance."),
});

const getCourseStatusInputSchema = z.object({
  courseId: z.string().min(1).describe("Course ID to get status for."),
});

const clearCourseProgressInputSchema = z.object({
  courseId: z.string().min(1).describe("Course ID to clear progress for."),
  confirm: z.boolean().optional().default(false),
});

function normalizeId(value: string) {
  return value.replace(/^\d+-/, "").trim();
}

function titleFromId(value: string) {
  return normalizeId(value)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getUserId(apiKey?: string) {
  if (!apiKey) return null;
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

function ensureApiKey(apiKey?: string) {
  const userId = getUserId(apiKey);
  if (!userId) {
    return { userId: null, error: "Missing API key. Please configure CONTEXT7_API_KEY." };
  }
  return { userId, error: null };
}

async function ensureProgressDir() {
  await fs.mkdir(progressBaseDir, { recursive: true });
}

function getProgressPath(userId: string) {
  return path.join(progressBaseDir, `${userId}.json`);
}

async function loadUserProgress(userId: string): Promise<Record<string, CourseProgress>> {
  await ensureProgressDir();
  const progressPath = getProgressPath(userId);
  if (!existsSync(progressPath)) return {};
  const content = await fs.readFile(progressPath, "utf-8");
  return JSON.parse(content) as Record<string, CourseProgress>;
}

async function saveUserProgress(userId: string, data: Record<string, CourseProgress>) {
  await ensureProgressDir();
  const progressPath = getProgressPath(userId);
  await fs.writeFile(progressPath, JSON.stringify(data, null, 2));
}

async function listCourseDirs() {
  const entries = await fs.readdir(coursesBaseDir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function buildCourseMeta(courseDir: string): Promise<CourseMeta> {
  const id = normalizeId(courseDir);
  return {
    id,
    title: titleFromId(courseDir),
    description: "",
    tags: id.split("-"),
    source: "context101",
    version: "v1",
    updatedAt: new Date().toISOString(),
    status: "active",
  };
}

async function buildCourseContent(courseDir: string): Promise<CourseContent> {
  const id = normalizeId(courseDir);
  const coursePath = path.join(coursesBaseDir, courseDir);
  const entries = await fs.readdir(coursePath, { withFileTypes: true });
  const steps = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => ({
      id: normalizeId(entry.name.replace(/\.md$/, "")),
      title: titleFromId(entry.name.replace(/\.md$/, "")),
      contentPath: path.join(coursePath, entry.name),
      order: parseInt(entry.name.split("-")[0] || "0", 10),
    }))
    .sort((a, b) => a.order - b.order);

  return {
    courseId: id,
    lessons: [
      {
        id: "main",
        title: titleFromId(courseDir),
        steps,
      },
    ],
  };
}

async function loadCourseCatalog(limit: number) {
  const courseDirs = await listCourseDirs();
  const metas = await Promise.all(courseDirs.map((dir) => buildCourseMeta(dir)));
  return metas.slice(0, limit);
}

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

async function loadStepContent(contentPath: string) {
  return fs.readFile(contentPath, "utf-8");
}

function formatCourseList(courses: CourseMeta[]) {
  if (!courses.length) return "No courses found.";
  const lines = courses.map((course) => `- ${course.title} (${course.id})`);
  return ["Available courses:", "", ...lines].join("\n");
}

function formatStartPayload(payload: {
  courseId: string;
  lessonId: string;
  stepId: string;
  content: string;
}) {
  return [
    `Course: ${payload.courseId}`,
    `Lesson: ${payload.lessonId}`,
    `Step: ${payload.stepId}`,
    "",
    payload.content,
  ].join("\n");
}

export const searchCoursesTool = {
  name: "searchCourses",
  description: "Search available courses by query.",
  parameters: searchCoursesInputSchema,
  execute: async (args: z.infer<typeof searchCoursesInputSchema>) => {
    const results = await searchCourses(args.query, args.limit ?? 10);
    return formatCourseList(results);
  },
};

export const startCourseTool = {
  name: "startCourse",
  description: "Start or resume a specific course by courseId.",
  parameters: startCourseInputSchema,
  execute: async (
    args: z.infer<typeof startCourseInputSchema>,
    context?: { apiKey?: string }
  ) => {
    const { userId, error } = ensureApiKey(context?.apiKey);
    if (!userId) return error!;

    const catalog = await loadCourseCatalog(200);
    const course = catalog.find((item) => item.id === args.courseId);
    if (!course) {
      return `Course "${args.courseId}" not found.`;
    }

    const content = await buildCourseContent(course.id);
    if (!content.lessons.length || !content.lessons[0].steps.length) {
      return `Course "${args.courseId}" has no content.`;
    }

    const progressByCourse = await loadUserProgress(userId);
    const existing = progressByCourse[course.id];
    const lesson = content.lessons[0];
    const firstStep = lesson.steps[0];

    const useExisting = args.resume !== false && existing;
    const lessonId = useExisting ? existing.currentLessonId : lesson.id;
    const stepId = useExisting ? existing.currentStepId : firstStep.id;
    const step = lesson.steps.find((item) => item.id === stepId) ?? firstStep;

    progressByCourse[course.id] = {
      courseId: course.id,
      currentLessonId: lessonId,
      currentStepId: step.id,
      completedSteps: useExisting ? existing!.completedSteps : [],
      completedLessons: useExisting ? existing!.completedLessons : [],
      updatedAt: new Date().toISOString(),
    };

    await saveUserProgress(userId, progressByCourse);
    const stepContent = await loadStepContent(step.contentPath);
    return formatStartPayload({
      courseId: course.id,
      lessonId,
      stepId: step.id,
      content: stepContent,
    });
  },
};

export const nextCourseStepTool = {
  name: "nextCourseStep",
  description: "Advance to the next step in a course.",
  parameters: nextCourseStepInputSchema,
  execute: async (
    args: z.infer<typeof nextCourseStepInputSchema>,
    context?: { apiKey?: string }
  ) => {
    const { userId, error } = ensureApiKey(context?.apiKey);
    if (!userId) return error!;

    const progressByCourse = await loadUserProgress(userId);
    const progress = progressByCourse[args.courseId];
    if (!progress) {
      return "No course progress found. Start the course first.";
    }

    const content = await buildCourseContent(args.courseId);
    const lesson =
      content.lessons.find((item) => item.id === progress.currentLessonId) ?? content.lessons[0];
    const steps = lesson.steps;
    const currentIndex = steps.findIndex((step) => step.id === progress.currentStepId);
    if (currentIndex === -1) {
      return "Current step not found. Start the course again.";
    }

    const nextStep = steps[currentIndex + 1];
    if (!nextStep) {
      progress.completedLessons = Array.from(new Set([...progress.completedLessons, lesson.id]));
      progress.updatedAt = new Date().toISOString();
      await saveUserProgress(userId, progressByCourse);
      return `Course "${args.courseId}" completed.`;
    }

    progress.completedSteps = Array.from(new Set([...progress.completedSteps, steps[currentIndex].id]));
    progress.currentStepId = nextStep.id;
    progress.updatedAt = new Date().toISOString();
    await saveUserProgress(userId, progressByCourse);

    const stepContent = await loadStepContent(nextStep.contentPath);
    return formatStartPayload({
      courseId: args.courseId,
      lessonId: lesson.id,
      stepId: nextStep.id,
      content: stepContent,
    });
  },
};

export const getCourseStatusTool = {
  name: "getCourseStatus",
  description: "Get status for a course.",
  parameters: getCourseStatusInputSchema,
  execute: async (
    args: z.infer<typeof getCourseStatusInputSchema>,
    context?: { apiKey?: string }
  ) => {
    const { userId, error } = ensureApiKey(context?.apiKey);
    if (!userId) return error!;

    const progressByCourse = await loadUserProgress(userId);
    const progress = progressByCourse[args.courseId];
    if (!progress) {
      return "No course progress found. Start the course first.";
    }

    return [
      `Course: ${progress.courseId}`,
      `Current Lesson: ${progress.currentLessonId}`,
      `Current Step: ${progress.currentStepId}`,
      `Completed Steps: ${progress.completedSteps.length}`,
      `Completed Lessons: ${progress.completedLessons.length}`,
      `Updated At: ${progress.updatedAt}`,
    ].join("\n");
  },
};

export const clearCourseProgressTool = {
  name: "clearCourseProgress",
  description: "Clear progress for a course.",
  parameters: clearCourseProgressInputSchema,
  execute: async (
    args: z.infer<typeof clearCourseProgressInputSchema>,
    context?: { apiKey?: string }
  ) => {
    const { userId, error } = ensureApiKey(context?.apiKey);
    if (!userId) return error!;

    if (!args.confirm) {
      return "Confirmation required. Call again with confirm: true to clear progress.";
    }

    const progressByCourse = await loadUserProgress(userId);
    if (!progressByCourse[args.courseId]) {
      return "No course progress found.";
    }

    delete progressByCourse[args.courseId];
    await saveUserProgress(userId, progressByCourse);
    return `Cleared progress for course "${args.courseId}".`;
  },
};
