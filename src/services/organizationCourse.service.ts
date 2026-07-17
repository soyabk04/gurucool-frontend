import {api} from "@/api/axios";

export const assignCourseToOrganization = async (data: {
  organizationId: string;
  courseId: string;
}) => {
  const res = await api.post("courses/enroll/org", data);
  
  return res.data;
};


export const getOrganizationCourses = async () => {
  const res = await api.get("/courses/enroll/org");
  return res.data;
};