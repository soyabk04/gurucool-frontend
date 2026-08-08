import { api } from "@/api/axios";
import type { Chapter } from "@/types/course";

export const getChapter = async (
  chapterId: string
): Promise<Chapter> => {
  const { data } = await api.get(
    `/courses/chapter/${chapterId}`
  );

  console.log(data);

  return data;
};