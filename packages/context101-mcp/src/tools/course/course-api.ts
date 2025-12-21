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

type CourseListResponse = {
  data: Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
    version?: string;
    status: string;
    updatedAt: string;
    overview?: {
      lessons?: string[];
      lessonIds?: string[];
      stepCounts?: number[];
      totalSteps?: number;
    };
  }>;
};

type LessonListResponse = {
  data: Array<{
    id: string;
    title: string;
    order: number;
  }>;
};

type StepListResponse = {
  data: Array<{
    id: string;
    title: string;
    order: number;
  }>;
};

type StepDetailResponse = {
  data: {
    id: string;
    title: string;
    order: number;
    content: string;
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

export async function fetchCourseProgress(courseId: string) {
  return requestJson<ProgressResponse>(buildUrl(`/api/progress/${courseId}`), {
    method: "GET",
  });
}

export async function startCourseRemote(courseId: string, resume: boolean) {
  return requestJson<StepResponse>(buildUrl(`/api/progress/${courseId}/start`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume }),
  });
}

export async function nextCourseStepRemote(courseId: string) {
  return requestJson<StepResponse>(buildUrl(`/api/progress/${courseId}/next`), {
    method: "POST",
  });
}

export async function resetCourseRemote(courseId: string) {
  return requestJson<StepResponse>(buildUrl(`/api/progress/${courseId}/reset`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ confirm: true }),
  });
}

export async function listCourses(query?: string, limit = 20, offset = 0) {
  const url = new URL(buildUrl("/api/courses"));
  if (query) url.searchParams.set("query", query);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  return requestJson<CourseListResponse>(url.toString(), { method: "GET" });
}

export async function listLessons(courseId: string) {
  return requestJson<LessonListResponse>(buildUrl(`/api/courses/${courseId}/lessons`), {
    method: "GET",
  });
}

export async function listSteps(courseId: string, lessonId: string) {
  return requestJson<StepListResponse>(
    buildUrl(`/api/courses/${courseId}/lessons/${lessonId}/steps`),
    { method: "GET" }
  );
}

export async function getStep(courseId: string, lessonId: string, stepId: string) {
  return requestJson<StepDetailResponse>(
    buildUrl(`/api/courses/${courseId}/lessons/${lessonId}/steps/${stepId}`),
    { method: "GET" }
  );
}
