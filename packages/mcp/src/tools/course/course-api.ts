type ProgressResponse = {
  data: {
    courseId: string;
    currentLessonId: string;
    currentStepId: string;
    completedSteps: string[];
    completedLessons: string[];
    updatedAt: string;
  };
};

type StepResponse = {
  data: {
    courseId: string;
    lessonId?: string;
    stepId?: string;
    content?: string;
    status?: string;
  };
};

const COURSE_API_BASE_URL = "https://api.context101.org";

function getBaseUrl() {
  return COURSE_API_BASE_URL.replace(/\/$/, "");
}

function buildUrl(path: string) {
  const base = getBaseUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function requestJson<T>(input: string, init: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Course API request failed: ${response.status} ${message}`);
  }
  return (await response.json()) as T;
}

function buildHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

export function canUseCourseApi(apiKey?: string) {
  return Boolean(apiKey);
}

export async function fetchCourseProgress(courseId: string, apiKey: string) {
  return requestJson<ProgressResponse>(buildUrl(`/api/progress/${courseId}`), {
    method: "GET",
    headers: buildHeaders(apiKey),
  });
}

export async function startCourseRemote(
  courseId: string,
  resume: boolean,
  apiKey: string
) {
  return requestJson<StepResponse>(buildUrl(`/api/progress/${courseId}/start`), {
    method: "POST",
    headers: buildHeaders(apiKey),
    body: JSON.stringify({ resume }),
  });
}

export async function nextCourseStepRemote(courseId: string, apiKey: string) {
  return requestJson<StepResponse>(buildUrl(`/api/progress/${courseId}/next`), {
    method: "POST",
    headers: buildHeaders(apiKey),
  });
}

export async function resetCourseRemote(courseId: string, apiKey: string) {
  return requestJson<StepResponse>(buildUrl(`/api/progress/${courseId}/reset`), {
    method: "POST",
    headers: buildHeaders(apiKey),
    body: JSON.stringify({ confirm: true }),
  });
}
