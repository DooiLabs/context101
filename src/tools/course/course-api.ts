type CourseListResponse = {
  data: Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
    version?: string;
    status: "active" | "draft" | "archived";
    updatedAt: string;
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

type CourseOverviewResponse = {
  courseId: string;
  lessons: Array<{
    id: string;
    title: string;
    order: number;
    steps: Array<{
      id: string;
      title: string;
      order: number;
    }>;
  }>;
};

type StartCourseLessonResponse = {
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  stepId: string;
  stepTitle: string;
  content: string;
};

type NextCourseStepResponse = {
  courseId: string;
  lessonId: string;
  stepId: string;
  content: string;
  status: "ok" | "completed";
};

type GetDocsResponse = {
  text: string;
};

const MCP_API_BASE_URL = "https://api.context101.org/mcp";

function getBaseUrl() {
  return MCP_API_BASE_URL.replace(/\/$/, "");
}

function buildUrl(path: string) {
  const base = getBaseUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function requestJson<T>(
  input: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(input, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
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
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safeOffset = Math.max(offset, 0);
  const payload: Record<string, unknown> = {
    limit: safeLimit,
    offset: safeOffset,
  };
  if (query) payload.query = query;
  if (tag) payload.tag = tag;
  if (status) payload.status = status;
  return requestJson<CourseListResponse>(buildUrl("/searchCourses"), payload);
}

export async function getOverview(courseId: string) {
  return requestJson<CourseOverviewResponse>(buildUrl("/getOverview"), {
    courseId,
  });
}

export async function startCourseLesson(params: {
  courseId: string;
  lessonId?: string;
  stepId?: string;
}) {
  return requestJson<StartCourseLessonResponse>(
    buildUrl("/startCourseLesson"),
    {
      courseId: params.courseId,
      lessonId: params.lessonId,
      stepId: params.stepId,
    },
  );
}

export async function nextCourseStep(params: {
  courseId: string;
  currentStepId: string;
  nextStepId: string;
}) {
  return requestJson<NextCourseStepResponse>(buildUrl("/nextCourseStep"), {
    courseId: params.courseId,
    currentStepId: params.currentStepId,
    nextStepId: params.nextStepId,
  });
}

export async function getDocs(params: {
  courseId: string;
  mode?: "code" | "info";
  tokens?: number;
  topic?: string;
}) {
  return requestJson<GetDocsResponse>(buildUrl("/getDocs"), {
    courseId: params.courseId,
    mode: params.mode,
    tokens: params.tokens,
    topic: params.topic,
  });
}
