import {api} from "@/api/axios";
import type { Course, CreateCourse } from "@/types/course";

export const createCourse = async (
  form: CreateCourse,
  onProgress?: (progress: number) => void
): Promise<Course> => {
  const formData = new FormData();

  // Course data
  formData.append(
    "course",
    JSON.stringify({
      title: form.title,
      description: form.description,
    })
  );

  // Course thumbnail
  if (form.thumbnail) {
    formData.append(
      "thumbnail",
      form.thumbnail
    );
  }

  // Certificate template
  if (form.certTemplate) {
    formData.append(
      "certTemplate",
      form.certTemplate
    );
  }

  const response = await api.post(
    "/courses",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          const percent = Math.round(
            (event.loaded * 100) / event.total
          );

          onProgress(percent);
        }
      },
    }
  );

  return response.data.course.course;
};
// Full course list — superadmin/admin only (matches GET /courses/cour on the backend).
export const getCourses = async (organizationId?: string) => {
  if (!organizationId) {
    const res = await api.get("/courses/cour");
    console.log(res.data)
    return res.data;
  } else {
    const res = await api.get(`/courses/cour/?organizationId=${organizationId}`);
    return res.data;
  }

};
export const getOrgCourses = async () => {
  const res = await api.get("/courses/orgcourses");
  return res.data;
};
// Courses the current user has access to (any role) — matches GET /courses/mycourses.
export const getMyCourses = async () => {
  const res = await api.get("/courses/cour");
  return res.data;
};

export const getMyCertificates = async () => {
  const res = await api.get("/courses/mycertificates");
  return res.data.data;
};




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

interface UpdateChapterProgressData {
  courseId: string;
  chapterId: string;
  watchedDuration: number;
  completed?: boolean;
}

/**
 * Get the current user's progress for a course.
 */
export const getCourseProgress = async (
  courseId: string
): Promise<CourseProgress> => {
  const { data } = await api.get(
    `/courses/progress/${courseId}`
  );

  return data.data;
};

/**
 * Update watched duration / completion for a chapter.
 *
 * If the progress document doesn't exist on the backend,
 * the backend creates it using upsert.
 */
export const updateChapterProgress = async ({
  courseId,
  chapterId,
  watchedDuration,
  completed = false,
}: UpdateChapterProgressData) => {
  const response = await api.patch(
    `/courses/${courseId}/chapters/${chapterId}/progress`,
    {
      watchedDuration,
      completed,
    }
  );
  console.log(response)
  return response.data.data;
};

