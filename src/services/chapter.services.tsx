import { api } from "@/api/axios";
import type { Chapter, CreateChapter } from "@/types/course";

export const createChapter = async (
  courseId: string,
  data: CreateChapter,
  onProgress?: (progress: number) => void
): Promise<Chapter> => {
  console.log("Creating chapter with data:", data);

  const formData = new FormData();

  formData.append(
    "chapter",
    JSON.stringify({
      title: data.title,
      description: data.description,
      courseId,
      type: data.type,
      quizData: data.quizData,
    })
  );

  if (data.file) {
    formData.append("file", data.file);
  }

  const response = await api.post(
    "/courses/chapter",
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

  return response.data;
};

export const getChapters = async (
  courseId: string
): Promise<Chapter[]> => {
  const response = await api.get(
    `/courses/course/${courseId}`
  );
  console.log("Fetched chapters response:", response.data);
  return response.data.chapters;
};
export const editChapter = async (
  chapterId: string,
  chapterData: Partial<Chapter>,
  quizData?: Record<string, unknown>,
  video?: File,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();

  formData.append(
    "chapter",
    JSON.stringify(chapterData)
  );

  if (quizData) {
    formData.append(
      "quiz",
      JSON.stringify(quizData)
    );
  }

  if (video) {
    formData.append(
      "video",
      video
    );
  }

  const response = await api.patch(
    `/courses/chapter/update/${chapterId}`,
    formData,
    {
      onUploadProgress: (event) => {
        if (
          onProgress &&
          event.total
        ) {
          const progress = Math.round(
            (event.loaded /
              event.total) *
              100
          );

          onProgress(progress);
        }
      },
    }
  );

  return response.data;
};
export const deleteChapter = async (
  chapterId: string
) => {
  const response = await api.delete(
    `/courses/chapters/${chapterId}`
  );

  return response.data;
};

export const getChapter = async (
  chapterId: string
): Promise<Chapter> => {
  const { data } = await api.get(
    `/courses/chapter/${chapterId}`
  );

  console.log(data);

  return data;
};