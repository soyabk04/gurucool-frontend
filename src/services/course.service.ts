import {api} from "@/api/axios";
import type { Course, CreateCourse } from "@/types/course";

export const createCourse = async (
  form: CreateCourse
): Promise<Course> => {
const formData = new FormData();

formData.append(
  "course",
  JSON.stringify({
    title: form.title,
    description: form.description,
  })
);

if (form.thumbnail) {
  formData.append("thumbnail", form.thumbnail);
}

  const response = await api.post(
    "/courses",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.course.course;
};
// Full course list — superadmin/admin only (matches GET /courses/cour on the backend).
export const getCourses = async () => {
  const res = await api.get("/courses/cour");
  return res.data;
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