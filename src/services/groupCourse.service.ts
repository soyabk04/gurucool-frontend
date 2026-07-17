import {api} from "@/api/axios";

export const assignCourseToGroup = async (data: {
  groupId: string;
  courseId: string;
}) => {
  const res = await api.post("courses/enroll/group", data);

  return res.data;
};


export const getGroupCourses = async () => {
  const res = await api.get("/courses/enroll/group");
  return res.data;
};