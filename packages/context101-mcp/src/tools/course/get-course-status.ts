import { getCourseStatusInputSchema } from "./schemas.js";
import { getCourseSession } from "./course-content.js";

export const getCourseStatusTool = {
  name: "getCourseStatus",
  description: "Get status for a course.",
  parameters: getCourseStatusInputSchema,
  execute: async (args: { courseId: string }) => {
    const session = await getCourseSession(args.courseId);
    if (!session) {
      return "No course progress found. Start the course first.";
    }
    const currentStep = session.steps[session.index];
    if (!currentStep) {
      return "No course progress found. Start the course first.";
    }
    const completedSteps = Math.max(session.index, 0);
    const completedLessons = Object.values(session.lessonLastIndex).filter(
      (lastIndex) => lastIndex < session.index,
    ).length;

    return [
      `Course: ${args.courseId}`,
      `Current lesson: ${currentStep.lessonId}`,
      `Current step: ${currentStep.stepId}`,
      `Completed steps: ${completedSteps}`,
      `Completed lessons: ${completedLessons}`,
      `Updated at: ${session.updatedAt}`,
    ].join("\n");
  },
};
