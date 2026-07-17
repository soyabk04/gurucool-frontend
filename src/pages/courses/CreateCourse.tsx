import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseForm from "@/components/course/CourseForm";
import { createCourse } from "@/services/course.service";
import type { CreateCourse } from "@/types/course";

export default function CreateCoursePage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (data: CreateCourse) => {
    try {
      setLoading(true);

      const course = await createCourse(data);
      navigate(`/courses/${course._id}/edit`);
    } catch (error) {
      console.error(error);
      alert("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto space-y-6 py-2">
      <div>
        <h1 className="text-3xl font-bold">Create Course</h1>
        <p className="text-muted-foreground">
          Add a new course, then add chapters to it.
        </p>
      </div>

      <CourseForm loading={loading} onSubmit={handleCreate} />
    </div>
  );
}
