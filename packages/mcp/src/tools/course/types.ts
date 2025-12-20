export type CourseMeta = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  source: string;
  version?: string;
  updatedAt: string;
  status: "active" | "draft" | "archived";
};

export type CourseContent = {
  courseId: string;
  lessons: Array<{
    id: string;
    title: string;
    steps: Array<{
      id: string;
      title: string;
      contentPath: string;
      order: number;
    }>;
  }>;
};

export type CourseProgress = {
  courseId: string;
  currentLessonId: string;
  currentStepId: string;
  completedSteps: string[];
  completedLessons: string[];
  updatedAt: string;
};
