import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fromPackageRoot } from "../../lib/path.js";
import type { CourseContent, CourseMeta, CourseProgress } from "./types.js";

const coursesBaseDir = fromPackageRoot(".docs/raw/course");
const progressBaseDir = path.join(os.homedir(), ".cache", "context101", "course");

export function normalizeId(value: string) {
  return value.replace(/^\d+-/, "").trim();
}

export function titleFromId(value: string) {
  return normalizeId(value)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getUserId(apiKey?: string) {
  if (!apiKey) return null;
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

export function ensureApiKey(apiKey?: string) {
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

export async function loadUserProgress(userId: string): Promise<Record<string, CourseProgress>> {
  await ensureProgressDir();
  const progressPath = getProgressPath(userId);
  if (!existsSync(progressPath)) return {};
  const content = await fs.readFile(progressPath, "utf-8");
  return JSON.parse(content) as Record<string, CourseProgress>;
}

export async function saveUserProgress(userId: string, data: Record<string, CourseProgress>) {
  await ensureProgressDir();
  const progressPath = getProgressPath(userId);
  await fs.writeFile(progressPath, JSON.stringify(data, null, 2));
}

async function listCourseDirs() {
  const entries = await fs.readdir(coursesBaseDir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

export async function buildCourseMeta(courseDir: string): Promise<CourseMeta> {
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

export async function buildCourseContent(courseDir: string): Promise<CourseContent> {
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

export async function loadCourseCatalog(limit: number) {
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

export async function searchCourses(query: string, limit: number) {
  const catalog = await loadCourseCatalog(200);
  return catalog
    .map((course) => ({ course, score: scoreCourse(query, course) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.course);
}

export async function loadStepContent(contentPath: string) {
  return fs.readFile(contentPath, "utf-8");
}

export function formatCourseList(courses: CourseMeta[]) {
  if (!courses.length) return "No courses found.";
  const lines = courses.map((course) => `- ${course.title} (${course.id})`);
  return ["Available courses:", "", ...lines].join("\n");
}

export function formatStartPayload(payload: {
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
