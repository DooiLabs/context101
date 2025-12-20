import { z } from "zod";

export const searchCoursesInputSchema = z.object({
  query: z.string().min(1).describe("Search query to find courses."),
  limit: z.number().int().min(1).max(50).optional().default(10),
});

export const startCourseInputSchema = z.object({
  courseId: z.string().min(1).describe("Course ID to start or resume."),
  resume: z.boolean().optional().default(true),
});

export const nextCourseStepInputSchema = z.object({
  courseId: z.string().min(1).describe("Course ID to advance."),
});

export const getCourseStatusInputSchema = z.object({
  courseId: z.string().min(1).describe("Course ID to get status for."),
});

export const clearCourseProgressInputSchema = z.object({
  courseId: z.string().min(1).describe("Course ID to clear progress for."),
  confirm: z.boolean().optional().default(false),
});
