import {api} from '@/api/axios';

export interface Chapter {
  _id: string;
  title: string;

  videoUrl: string;

}

export const getChapter = async (
  chapterId: string
): Promise<Chapter> => {
  const { data } = await api.get(`/courses/chapter/${chapterId}`);
  console.log(data)
  return data;
};