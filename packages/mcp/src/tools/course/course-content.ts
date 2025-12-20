import fs from "node:fs/promises";
import path from "node:path";
import { fromPackageRoot } from "../../lib/path.js";
import { normalizeId, titleFromId } from "./utils.js";

export type CourseMeta = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  source: string;
  version?: string;
  updatedAt: string;
  status: "active" | "draft" | "archived";
};

export type CourseContent = {
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

const coursesBaseDir = fromPackageRoot(".docs/raw/course");

export async function listCourseDirs() {
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
  const fileSteps = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => ({
      id: normalizeId(entry.name.replace(/\.md$/, "")),
      title: titleFromId(entry.name.replace(/\.md$/, "")),
      contentPath: path.join(coursePath, entry.name),
      order: parseInt(entry.name.split("-")[0] || "0", 10),
    }))
    .sort((a, b) => a.order - b.order);

  const lessonDirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => {
      const orderA = parseInt(a.split("-")[0] || "0", 10);
      const orderB = parseInt(b.split("-")[0] || "0", 10);
      return orderA - orderB;
    });

  const lessonsFromDirs = await Promise.all(
    lessonDirs.map(async (dirName) => {
      const lessonPath = path.join(coursePath, dirName);
      const lessonEntries = await fs.readdir(lessonPath, { withFileTypes: true });
      const lessonSteps = lessonEntries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
        .map((entry) => ({
          id: normalizeId(entry.name.replace(/\.md$/, "")),
          title: titleFromId(entry.name.replace(/\.md$/, "")),
          contentPath: path.join(lessonPath, entry.name),
          order: parseInt(entry.name.split("-")[0] || "0", 10),
        }))
        .sort((a, b) => a.order - b.order);

      return {
        id: normalizeId(dirName),
        title: titleFromId(dirName),
        steps: lessonSteps,
      };
    })
  );

  const lessons =
    lessonsFromDirs.length > 0
      ? lessonsFromDirs.filter((lesson) => lesson.steps.length > 0)
      : [
          {
            id: "main",
            title: titleFromId(courseDir),
            steps: fileSteps,
          },
        ];

  return {
    courseId: id,
    lessons,
  };
}

export async function loadCourseCatalog(limit: number) {
  const courseDirs = await listCourseDirs();
  const metas = await Promise.all(courseDirs.map((dir) => buildCourseMeta(dir)));
  return metas.slice(0, limit);
}

export async function loadStepContent(contentPath: string) {
  return fs.readFile(contentPath, "utf-8");
}
