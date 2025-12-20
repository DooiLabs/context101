# Courses API Specification

This document defines the HTTP API for course discovery, content retrieval, and progress tracking.
All endpoints are designed to be backed by a database.

## Conventions

- **Base URL**: `/api`
- **Auth**: Use headers, not query params. API key is optional.
  - `Authorization: Bearer <API_KEY>` (recommended)
  - `X-API-Key: <API_KEY>` (alternative)
  - If no API key is provided, progress is stored locally and responses include a warning.
- **Content-Type**: `application/json`
- **Timestamps**: ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- **Errors**: Standard JSON error envelope.

### Error Response Shape

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": { "any": "json" }
  }
}
```

Common error codes:
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

## Data Model (Logical)

### Course
```json
{
  "id": "mastra",
  "title": "Mastra",
  "description": "Short summary",
  "tags": ["agent", "tools"],
  "version": "v1",
  "status": "active",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Lesson
```json
{
  "id": "01-basics",
  "title": "Basics",
  "order": 1
}
```

### Step
```json
{
  "id": "01-what-is-nextjs",
  "title": "What Is Next.js",
  "order": 1,
  "content": "Markdown string"
}
```

### Progress
```json
{
  "courseId": "mastra",
  "currentLessonId": "01-basics",
  "currentStepId": "01-what-is-nextjs",
  "completedSteps": ["01-what-is-nextjs"],
  "completedLessons": ["01-basics"],
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

## Endpoints

### 1) List Courses
`GET /api/courses`

Query params:
- `query` (string, optional): free-text search on title/description/tags
- `tag` (string, optional): tag filter
- `status` (string, optional): `active|draft|archived`
- `limit` (number, optional, default 20, max 100)
- `offset` (number, optional, default 0)

Response `200`:
```json
{
  "data": [
    {
      "id": "mastra",
      "title": "Mastra",
      "description": "Short summary",
      "tags": ["agent", "tools"],
      "version": "v1",
      "status": "active",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "meta": { "limit": 20, "offset": 0, "total": 1 }
}
```

### 2) Get Course
`GET /api/courses/:courseId`

Response `200`:
```json
{
  "data": {
    "id": "mastra",
    "title": "Mastra",
    "description": "Short summary",
    "tags": ["agent", "tools"],
    "version": "v1",
    "status": "active",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### 3) List Lessons
`GET /api/courses/:courseId/lessons`

Response `200`:
```json
{
  "data": [
    { "id": "01-basics", "title": "Basics", "order": 1 }
  ]
}
```

### 4) Get Lesson
`GET /api/courses/:courseId/lessons/:lessonId`

Response `200`:
```json
{
  "data": { "id": "01-basics", "title": "Basics", "order": 1 }
}
```

### 5) List Steps (Lesson)
`GET /api/courses/:courseId/lessons/:lessonId/steps`

Response `200`:
```json
{
  "data": [
    { "id": "01-what-is-nextjs", "title": "What Is Next.js", "order": 1 }
  ]
}
```

### 6) Get Step (Lesson)
`GET /api/courses/:courseId/lessons/:lessonId/steps/:stepId`

Response `200`:
```json
{
  "data": {
    "id": "01-what-is-nextjs",
    "title": "What Is Next.js",
    "order": 1,
    "content": "# Markdown..."
  }
}
```

### 7) Search Steps (Course)
`GET /api/courses/:courseId/steps/search`

Query params:
- `query` (string, required)
- `limit` (number, optional, default 10, max 50)
- `offset` (number, optional, default 0)

Notes:
- **Short-term implementation**: allow simple DB search (`title ILIKE` and/or `content ILIKE`).
- **Long-term implementation**: integrate external search and map results back to step slugs.

Response `200`:
```json
{
  "data": [
    {
      "lessonId": "01-basics",
      "stepId": "01-what-is-nextjs",
      "title": "What Is Next.js",
      "snippet": "Short matching excerpt..."
    }
  ],
  "meta": { "limit": 10, "offset": 0, "total": 1 }
}
```

## Progress APIs

Progress endpoints work with or without authentication.

- **With API key**: progress is stored in the DB.
- **Without API key**: progress is stored in a local cache (per-machine) and the response includes a warning to encourage using an API key.

### Warning Message (Unauthenticated)

When no API key is provided, include a warning message in the response payload:

```json
{
  "warnings": [
    {
      "code": "API_KEY_MISSING",
      "message": "No API key detected. Progress is stored locally on this machine. Add an API key to sync progress across devices."
    }
  ]
}
```

### 8) Get Progress
`GET /api/progress/:courseId`

Response `200`:
```json
{
  "data": {
    "courseId": "mastra",
    "currentLessonId": "01-basics",
    "currentStepId": "01-what-is-nextjs",
    "completedSteps": ["01-what-is-nextjs"],
    "completedLessons": ["01-basics"],
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "warnings": [
    {
      "code": "API_KEY_MISSING",
      "message": "No API key detected. Progress is stored locally on this machine. Add an API key to sync progress across devices."
    }
  ]
}
```

### 9) Start/Resume Course
`POST /api/progress/:courseId/start`

Body:
```json
{
  "resume": true
}
```

Response `200`:
```json
{
  "data": {
    "courseId": "mastra",
    "lessonId": "01-basics",
    "stepId": "01-what-is-nextjs",
    "content": "# Markdown..."
  },
  "warnings": [
    {
      "code": "API_KEY_MISSING",
      "message": "No API key detected. Progress is stored locally on this machine. Add an API key to sync progress across devices."
    }
  ]
}
```

### 10) Next Step
`POST /api/progress/:courseId/next`

Response `200`:
```json
{
  "data": {
    "courseId": "mastra",
    "lessonId": "01-basics",
    "stepId": "02-setup",
    "content": "# Markdown..."
  },
  "warnings": [
    {
      "code": "API_KEY_MISSING",
      "message": "No API key detected. Progress is stored locally on this machine. Add an API key to sync progress across devices."
    }
  ]
}
```

Response `200` when completed:
```json
{
  "data": {
    "courseId": "mastra",
    "status": "completed"
  },
  "warnings": [
    {
      "code": "API_KEY_MISSING",
      "message": "No API key detected. Progress is stored locally on this machine. Add an API key to sync progress across devices."
    }
  ]
}
```

### 11) Reset Progress
`POST /api/progress/:courseId/reset`

Body:
```json
{
  "confirm": true
}
```

Response `200`:
```json
{
  "data": { "courseId": "mastra", "status": "reset" },
  "warnings": [
    {
      "code": "API_KEY_MISSING",
      "message": "No API key detected. Progress is stored locally on this machine. Add an API key to sync progress across devices."
    }
  ]
}
```

## Admin (Optional)

These are optional management endpoints for content ingestion.

### 12) Create Course
`POST /api/admin/courses`

Status: **TBD**

Body:
```json
{
  "id": "mastra",
  "title": "Mastra",
  "description": "Short summary",
  "tags": ["agent", "tools"],
  "version": "v1",
  "status": "active"
}
```

### 13) Create Lesson
`POST /api/admin/courses/:courseId/lessons`

Body:
```json
{
  "id": "01-basics",
  "title": "Basics",
  "order": 1
}
```

### 14) Create Step
`POST /api/admin/courses/:courseId/lessons/:lessonId/steps`

Body:
```json
{
  "id": "01-what-is-nextjs",
  "title": "What Is Next.js",
  "order": 1,
  "content": "# Markdown..."
}
```
