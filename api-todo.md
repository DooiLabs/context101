# API Todo — Course Overview

Goal: add a lightweight overview to course list responses so MCP doesn't need to fan-out to lessons/steps.

## Proposed Response Change

`GET /api/courses` should include an `overview` object per course:

```json
{
  "id": "mastra",
  "title": "Mastra",
  "description": "",
  "tags": ["mastra"],
  "version": "v1",
  "status": "active",
  "updatedAt": "2025-12-20T11:36:56.098134+00:00",
  "overview": {
    "lessons": ["First Agent", "Agent Tools MCP"],
    "lessonIds": ["01-first-agent", "02-agent-tools-mcp"],
    "stepCounts": [18, 32],
    "totalSteps": 50
  }
}
```

## Notes

- `overview.lessons`: display titles for quick UI/tool output
- `overview.lessonIds`: stable IDs for drill-down (optional but useful)
- `overview.stepCounts`: counts aligned with `overview.lessons`
- `overview.totalSteps`: sum of all steps in the course

## Implementation Ideas

- Precompute and store in a `course_overview` table or materialized view.
- Update on content publish/change.
- Keep `GET /api/courses/:courseId` unchanged (optional: add `overview` there too).

## MCP Impact

- MCP can render richer search results without extra API calls.
- Reduces N+1 calls to lessons/steps endpoints.
