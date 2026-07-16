import {api} from "@/api/axios";
import type { Course, CreateCourse } from "@/types/course";

export const createCourse = async (
  form: CreateCourse
): Promise<Course> => {
    console.log(form)
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
export const getCourses = async () => {
  const res = await api.get("/courses/cour");
 
  return res.data;
};
export const getOrgCourses = async () => {
  const res = await api.get("/courses/orgcourses");
  console.log("bou",res)
  return res.data;
};