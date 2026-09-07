import { api } from "@/api/axios";
import type { Course, CreateCourse } from "@/types/course";

/* =========================================================
   CREATE COURSE
========================================================= */

export const createCourse = async (
  form: CreateCourse,
  onProgress?: (progress: number) => void
): Promise<Course> => {
  const formData = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await api.post(
    "/courses/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          const progress = Math.round(
            (event.loaded * 100) / event.total
          );

          onProgress(progress);
        }
      },
    }
  );

  return response.data.data;
};

/* =========================================================
   COORDINATOR COURSE
========================================================= */

export interface CoordinatorCourse {
  _id: string;

  groupId: {
    _id: string;
    name: string;
    organization: string;
    groupCode: string;
    coordinator: string;
  };

  courseId: {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    createdAt: string;
    updatedAt: string;
    thumbnail?: string;
  };
}

/* =========================================================
   GET COORDINATOR COURSES
========================================================= */

export const getCourses = async (organizationId?: string) => {
  if (organizationId) {
    const response = await api.get(
      `/courses/cour/?organizationId=${organizationId}`
    );

    return response.data ?? [];
  }

  const response = await api.get("/courses/cour");

  return response.data ?? [];
}

/* =========================================================
   ORGANIZATION COURSES
========================================================= */

export const getOrgCourses = async () => {
  const response = await api.get(
    "/courses/orgcourses"
  );

  return response.data;
};

/* =========================================================
   MY COURSES
========================================================= */

export const getMyCourses = async () => {
  const response = await api.get(
    "/courses/cour"
  );

  return response.data;
};

/* =========================================================
   CERTIFICATES
========================================================= */

export const getMyCertificates = async () => {
  const response = await api.get(
    "/courses/mycertificates"
  );

  return response.data.data;
};

/* =========================================================
   CHAPTER PROGRESS
========================================================= */

export interface ChapterProgress {
  _id: string;
  title: string;
  order: number;
  type: "video" | "pdf";
  watchedDuration: number;
  completed: boolean;
}

export interface CourseProgress {
  courseId: string;
  progress: number;
  percentage: number;
  totalChapters: number;
  completedChapters: number;
  chapters: ChapterProgress[];
}

export interface UpdateChapterProgressData {
  courseId: string;
  chapterId: string;
  watchedDuration: number;
  completed?: boolean;
}

export const getCourseProgress = async (
  courseId: string
) => {
  const response = await api.get(
    `/courses/progress/${courseId}`
  );

  return response.data.data;
};

export const updateChapterProgress = async (
  courseId: string,
  chapterId: string,
  data: {
    watchedDuration: number;
    completed?: boolean;
  }
) => {
  const response = await api.patch(
    `/courses/${courseId}/chapters/${chapterId}/progress`,
    data
  );

  return response.data.data;
};

/* =========================================================
   COORDINATOR USER PROGRESS
========================================================= */

export interface CoordinatorUserProgress {
  user: {
    _id: string;
    name: string;
    email: string;
  };

  progress: number;

  completedChapters: number;

  totalChapters: number;

  lastActivity: string | null;

  status:
    | "completed"
    | "in-progress"
    | "not-started";
}

/* =========================================================
   GET USER PROGRESS FOR SELECTED COURSE
========================================================= */

export const getCoordinatorUserProgress =
  async (
    courseId: string
  ) => {
    const response = await api.get(
      `/courses/coordinator/courses/${courseId}/progress`
    );

    return response.data.data ?? [];
  };