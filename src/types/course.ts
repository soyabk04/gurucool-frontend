export interface CreateCourse {
  title: string;
  description: string;
  thumbnail: File | null;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourse {
  title: string;
  description: string;
  thumbnail: File | null;
  certTemplate: File | null;
}

export interface Chapter {
  _id: string;
  title: string;
  description: string;
  type: ChapterType;
  videoUrl: string;
  order: number;
  course: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterWithProgress extends Chapter {
  completed: boolean;
  watchedDuration: number;
}

export type ChapterType = "video" | "pdf" | "quiz"|null;

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  marks: number;
}

export interface QuizData {
  passingMarks: number;
  totalMarks: number;
  questions: QuizQuestion[];
}

export interface CreateChapter {
  title: string;
  description: string;
  type: ChapterType;
  file: File | null;
  quizData?: QuizData;
}

export interface QuizQuestion {
  _id: string;
  question: string;
  options: string[];
  marks: number;
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
}

export interface QuizSubmitResponse {
  score: number;
  totalMarks: number;
  passingMarks: number;
  passed: boolean;
}

export interface MyCertificate {
  _id: string;

  userId: string;

  courseId: string;

  organizationId: string;

  groupId: string;

  key: string;

  courseTitle: string;

  certificateLink?: string;

  createdAt: string;

  updatedAt: string;
}