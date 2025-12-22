type CourseListResponse = {
  data: Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
    version?: string;
    status: string;
    updatedAt: string;
    sourceLibraryId?: string | null;
    sourceContext101Url?: string | null;
    sourceLlmsUrl?: string | null;
    generatorModel?: string | null;
    generatedAt?: string | null;
    generatorJobId?: string | null;
    generation?: number | null;
    overview?: {
      lessons?: string[];
      lessonIds?: string[];
      stepCounts?: number[];
      totalSteps?: number;
    };
  }>;
  meta?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
};

type LessonListResponse = {
  data: Array<{
    id: string;
    title: string;
    order: number;
    sourceTitle?: string | null;
    rawPath?: string | null;
  }>;
};

type StepListResponse = {
  data: Array<{
    id: string;
    title: string;
    order: number;
    sourceStepNumber?: number | null;
  }>;
};

type StepDetailResponse = {
  data: {
    id: string;
    title: string;
    order: number;
    sourceStepNumber?: number | null;
    content: string;
  };
};

type CourseResponse = {
  data: CourseListResponse["data"][number];
};

type LessonResponse = {
  data: LessonListResponse["data"][number];
};

type SearchStepsResponse = {
  data: Array<{
    lessonId: string;
    stepId: string;
    title: string;
    snippet: string;
  }>;
  meta?: {
    limit?: number;
    offset?: number;
    total?: number;
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

function encodePathParam(value: string) {
  return encodeURIComponent(value);
}

async function requestJson<T>(input: string, init: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Course API request failed: ${response.status} ${message}`);
  }
  return (await response.json()) as T;
}

export async function listCourses(params?: {
  query?: string;
  tag?: string;
  status?: "active" | "draft" | "archived";
  limit?: number;
  offset?: number;
}) {
  const { query, tag, status, limit = 20, offset = 0 } = params ?? {};
  const url = new URL(buildUrl("/api/courses"));
  if (query) url.searchParams.set("query", query);
  if (tag) url.searchParams.set("tag", tag);
  if (status) url.searchParams.set("status", status);
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safeOffset = Math.max(offset, 0);
  url.searchParams.set("limit", String(safeLimit));
  url.searchParams.set("offset", String(safeOffset));
  return requestJson<CourseListResponse>(url.toString(), { method: "GET" });
}

export async function getCourse(courseId: string) {
  return requestJson<CourseResponse>(
    buildUrl(`/api/courses/${encodePathParam(courseId)}`),
    {
      method: "GET",
    },
  );
}

export async function listLessons(courseId: string) {
  return requestJson<LessonListResponse>(
    buildUrl(`/api/courses/${encodePathParam(courseId)}/lessons`),
    {
      method: "GET",
    },
  );
}

export async function getLesson(courseId: string, lessonId: string) {
  return requestJson<LessonResponse>(
    buildUrl(
      `/api/courses/${encodePathParam(courseId)}/lessons/${encodePathParam(lessonId)}`,
    ),
    { method: "GET" },
  );
}

export async function listSteps(courseId: string, lessonId: string) {
  return requestJson<StepListResponse>(
    buildUrl(
      `/api/courses/${encodePathParam(courseId)}/lessons/${encodePathParam(lessonId)}/steps`,
    ),
    { method: "GET" },
  );
}

export async function getStep(
  courseId: string,
  lessonId: string,
  stepId: string,
) {
  return requestJson<StepDetailResponse>(
    buildUrl(
      `/api/courses/${encodePathParam(courseId)}/lessons/${encodePathParam(
        lessonId,
      )}/steps/${encodePathParam(stepId)}`,
    ),
    { method: "GET" },
  );
}

export async function searchCourseSteps(
  courseId: string,
  query: string,
  limit = 10,
  offset = 0,
) {
  const url = new URL(
    buildUrl(`/api/courses/${encodePathParam(courseId)}/steps/search`),
  );
  url.searchParams.set("query", query);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  return requestJson<SearchStepsResponse>(url.toString(), { method: "GET" });
}
