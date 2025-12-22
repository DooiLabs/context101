let defaultCourseId: string | null = null;

export function setDefaultCourseId(value: string | null) {
  const normalized = value?.trim();
  defaultCourseId = normalized ? normalized : null;
}

export function resolveCourseId(value?: string | null) {
  const normalized = value?.trim();
  if (defaultCourseId) return defaultCourseId;
  return normalized ? normalized : null;
}
