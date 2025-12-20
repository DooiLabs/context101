import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

export type CourseProgress = {
  courseId: string;
  currentLessonId: string;
  currentStepId: string;
  completedSteps: string[];
  completedLessons: string[];
  updatedAt: string;
};

const progressBaseDir = path.join(os.homedir(), ".cache", "context101", "course");

function getUserId(apiKey?: string) {
  if (!apiKey) return null;
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

export function getUserContext(apiKey?: string) {
  const userId = getUserId(apiKey);
  if (userId) {
    return { userId, warning: null as string | null };
  }
  return {
    userId: "local",
    warning:
      "No API key detected. Progress is stored locally on this machine. Add an API key to sync progress across devices.",
  };
}

async function ensureProgressDir() {
  await fs.mkdir(progressBaseDir, { recursive: true });
}

function getProgressPath(userId: string) {
  return path.join(progressBaseDir, `${userId}.json`);
}

export async function loadUserProgress(
  userId: string
): Promise<Record<string, CourseProgress>> {
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
