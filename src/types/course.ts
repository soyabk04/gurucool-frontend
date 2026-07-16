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

export type ChapterType = "video" | "pdf";

export interface CreateChapter {
  title: string;
  description: string;
  type: ChapterType;
  file: File | null;
}

export interface Chapter {
  _id: string;
  title: string;
  description: string;
  type: ChapterType;
  fileUrl: string;
  order: number;
  course: string;
  createdAt: string;
  updatedAt: string;
}