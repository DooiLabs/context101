import fs from "node:fs/promises";
import path from "node:path";
import { fromPackageRoot } from "../../lib/path.js";
import { canUsePublicCourseApi, getStep, listCourses, listLessons, listSteps } from "./course-api.js";
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
      contentPath?: string;
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
  try {
    if (canUsePublicCourseApi()) {
    const lessonsResponse = await listLessons(id);
    const lessons = await Promise.all(
      lessonsResponse.data.map(async (lesson) => {
        const stepsResponse = await listSteps(id, lesson.id);
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
      courseId: id,
      lessons,
    };
    }
  } catch {
    // Fall back to local content if the public API is unavailable.
  }

  const coursePath = path.join(coursesBaseDir, courseDir);
  const entries = await fs.readdir(coursePath, { withFileTypes: true });
  const fileSteps = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => ({
      id: normalizeId(entry.name.replace(/\.md$/, "")),
      title: titleFromId(entry.name.replace(/\.md$/, "")),
      contentPath: path.join(coursePath, entry.name),
      order: parseInt(entry.name.split("-")[0] || "0", 10),
      lessonId: "main",
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
          lessonId: normalizeId(dirName),
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
  try {
    if (canUsePublicCourseApi()) {
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
          course.status === "draft" || course.status === "archived" ? course.status : "active",
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
  } catch {
    // Fall back to local content if the public API is unavailable.
  }

  const courseDirs = await listCourseDirs();
  const metas = await Promise.all(courseDirs.map((dir) => buildCourseMeta(dir)));
  return metas.slice(0, limit);
}

export async function loadStepContent(contentPath?: string) {
  if (!contentPath) {
    throw new Error("Missing content path for local step.");
  }
  return fs.readFile(contentPath, "utf-8");
}

async function resolveLocalContentPath(
  courseId: string,
  lessonId: string,
  stepId: string
) {
  const coursePath = path.join(coursesBaseDir, courseId);
  const entries = await fs.readdir(coursePath, { withFileTypes: true });
  const lessonDir = entries.find(
    (entry) =>
      entry.isDirectory() &&
      (entry.name === lessonId || normalizeId(entry.name) === normalizeId(lessonId))
  );

  if (lessonDir) {
    const lessonPath = path.join(coursePath, lessonDir.name);
    const lessonEntries = await fs.readdir(lessonPath, { withFileTypes: true });
    const stepFile = lessonEntries.find(
      (entry) =>
        entry.isFile() &&
        (entry.name.replace(/\.md$/, "") === stepId ||
          normalizeId(entry.name.replace(/\.md$/, "")) === normalizeId(stepId))
    );
    if (stepFile) {
      return path.join(lessonPath, stepFile.name);
    }
  }

  const rootStep = entries.find(
    (entry) =>
      entry.isFile() &&
      (entry.name.replace(/\.md$/, "") === stepId ||
        normalizeId(entry.name.replace(/\.md$/, "")) === normalizeId(stepId))
  );
  if (rootStep) {
    return path.join(coursePath, rootStep.name);
  }

  return null;
}

export async function fetchStepContent(
  courseId: string,
  lessonId: string,
  stepId: string,
  contentPath?: string
) {
  try {
    if (canUsePublicCourseApi()) {
      const response = await getStep(courseId, lessonId, stepId);
      return response.data.content;
    }
  } catch {
    // Fall back to local content if the public API is unavailable.
  }
  if (contentPath) {
    return loadStepContent(contentPath);
  }
  const localPath = await resolveLocalContentPath(courseId, lessonId, stepId);
  if (!localPath) {
    throw new Error("Missing content path for local step.");
  }
  return loadStepContent(localPath);
}
