d# Public API (Implemented) — context101

This document describes the public, unauthenticated endpoints that are currently implemented and verified on `https://api.context101.org`.
All endpoints are under the base URL `/api`. Authentication is **not** required for the public endpoints listed here.

Conventions:
- **Content-Type**: `application/json`
- **Timestamps**: ISO 8601 (e.g., `2025-12-20T11:36:56.098134+00:00`)
- **Errors**: Standard error envelope

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": { "any": "json" }
  }
}
```

## Data Shapes

### Course
Returned by course list/detail endpoints.

```json
{
  "id": "mastra",
  "title": "Mastra",
  "description": "Short summary",
  "tags": ["tag1", "tag2"],
  "version": "v1",
  "status": "active",
  "updatedAt": "2025-12-20T11:36:56.098134+00:00"
}
```

### Lesson
Returned by lesson list/detail endpoints.

```json
{
  "id": "01-first-agent",
  "title": "First Agent",
  "order": 1
}
```

### Step (List View)
Returned by step list endpoints (no content).

```json
{
  "id": "01-introduction-to-mastra",
  "title": "Introduction To Mastra",
  "order": 1
}
```

### Step (Detail View)
Returned by step detail endpoint (includes content).

```json
{
  "id": "01-introduction-to-mastra",
  "title": "Introduction To Mastra",
  "order": 1,
  "content": "# Markdown..."
}
```

### Step Search Result
Returned by course step search endpoint.

```json
{
  "lessonId": "01-first-agent",
  "stepId": "01-introduction-to-mastra",
  "title": "Introduction To Mastra",
  "snippet": "Short matching excerpt..."
}
```

---

## 1) List Courses
`GET /api/courses`

Returns a paginated list of courses.

### Query Parameters
- `query` (string, optional): Free-text search on `title` or `description`.
- `tag` (string, optional): Filter by tag. (Course must include this tag.)
- `status` (string, optional): `active | draft | archived`
- `limit` (number, optional, default `20`, max `100`)
- `offset` (number, optional, default `0`)

### Response 200
```json
{
  "data": [
    {
      "id": "mastra",
      "title": "Mastra",
      "description": "",
      "tags": ["mastra"],
      "version": "v1",
      "status": "active",
      "updatedAt": "2025-12-20T11:36:56.098134+00:00"
    }
  ],
  "meta": { "limit": 20, "offset": 0, "total": 2 }
}
```

### Example
```bash
curl -sS "https://api.context101.org/api/courses?limit=20&offset=0"
```

---

## 2) Get Course
`GET /api/courses/:courseId`

Returns a single course by slug (recommended) or UUID.

### Path Parameters
- `courseId` (string, required): Course slug (e.g., `mastra`) or UUID.

### Response 200
```json
{
  "data": {
    "id": "mastra",
    "title": "Mastra",
    "description": "",
    "tags": ["mastra"],
    "version": "v1",
    "status": "active",
    "updatedAt": "2025-12-20T11:36:56.098134+00:00"
  }
}
```

### Example
```bash
curl -sS "https://api.context101.org/api/courses/mastra"
```

---

## 3) List Lessons (Course)
`GET /api/courses/:courseId/lessons`

Returns all lessons for the given course, ordered by `order` ascending.

### Path Parameters
- `courseId` (string, required): Course slug or UUID.

### Response 200
```json
{
  "data": [
    { "id": "01-first-agent", "title": "First Agent", "order": 1 },
    { "id": "02-agent-tools-mcp", "title": "Agent Tools Mcp", "order": 2 }
  ]
}
```

### Example
```bash
curl -sS "https://api.context101.org/api/courses/mastra/lessons"
```

---

## 4) Get Lesson (Course)
`GET /api/courses/:courseId/lessons/:lessonId`

Returns a single lesson by slug (recommended) or UUID.

### Path Parameters
- `courseId` (string, required)
- `lessonId` (string, required): Lesson slug or UUID.

### Response 200
```json
{
  "data": { "id": "01-first-agent", "title": "First Agent", "order": 1 }
}
```

### Example
```bash
curl -sS "https://api.context101.org/api/courses/mastra/lessons/01-first-agent"
```

---

## 5) List Steps (Lesson)
`GET /api/courses/:courseId/lessons/:lessonId/steps`

Returns all steps for the given lesson, ordered by `order` ascending.

### Path Parameters
- `courseId` (string, required)
- `lessonId` (string, required)

### Response 200
```json
{
  "data": [
    { "id": "01-introduction-to-mastra", "title": "Introduction To Mastra", "order": 1 },
    { "id": "02-what-is-mastra", "title": "What Is Mastra", "order": 2 }
  ]
}
```

### Example
```bash
curl -sS "https://api.context101.org/api/courses/mastra/lessons/01-first-agent/steps"
```

---

## 6) Get Step (Lesson)
`GET /api/courses/:courseId/lessons/:lessonId/steps/:stepId`

Returns a single step including Markdown content.

### Path Parameters
- `courseId` (string, required)
- `lessonId` (string, required)
- `stepId` (string, required)

### Response 200
```json
{
  "data": {
    "id": "01-introduction-to-mastra",
    "title": "Introduction To Mastra",
    "order": 1,
    "content": "# Getting Started with Mastra\n..."
  }
}
```

### Example
```bash
curl -sS "https://api.context101.org/api/courses/mastra/lessons/01-first-agent/steps/01-introduction-to-mastra"
```

---

## 7) Search Steps (Course)
`GET /api/courses/:courseId/steps/search`

Searches steps by query across all lessons in a course.
Results include the lesson/step identifiers, the step title, and a short snippet.

### Query Parameters
- `query` (string, required): Search term.
- `limit` (number, optional, default `10`, max `50`)
- `offset` (number, optional, default `0`)

### Response 200
```json
{
  "data": [
    {
      "lessonId": "02-agent-tools-mcp",
      "stepId": "01-introduction-to-mcp",
      "title": "Introduction To Mcp",
      "snippet": "...matching excerpt..."
    }
  ],
  "meta": { "limit": 10, "offset": 0, "total": 80 }
}
```

### Example
```bash
curl -sS "https://api.context101.org/api/courses/mastra/steps/search?query=agent&limit=3"
```

---

## Notes for Consumers

- **Identifiers:** Public endpoints accept either UUIDs or slugs. Responses use slugs when available.
- **Ordering:** Lessons and steps are sorted by their `order` field ascending.
- **Search Behavior:** Current implementation uses basic text search over step `title` and `content` (case-insensitive).
- **Stability:** Public endpoints are read-only and safe to cache.
