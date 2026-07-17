import {api} from "@/api/axios";

export const assignCourseToUsers = async (
  courseId: string,
  userIds: string[]
) => {
  const { data } = await api.post("/courses/enroll", {
    courseId,
    userIds,
  });

  return data;
};