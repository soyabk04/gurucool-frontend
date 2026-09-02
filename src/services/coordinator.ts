import { api } from "@/api/axios";

export interface ChapterSchedule {
  chapterId: string;
  accessDate: string;
  lastDate: string;
}

export const assignCourseToUsers = async (
  courseId: string,
  userIds: string[],
  chapters: ChapterSchedule[]
) => {
  const { data } = await api.post("/courses/enroll", {
    courseId,
    userIds,
    chapters,
  });

  return data;
};
