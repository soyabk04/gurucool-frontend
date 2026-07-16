import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import CourseForm from "@/components/course/CourseForm";
import { createCourse } from "@/services/course.service";
import type { CreateCourse } from "@/types/course";

export default function CreateCourse() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (data: CreateCourse) => {
    try {
      setLoading(true);

      const course = await createCourse(data);
      console.log(course)
      navigate(`/courses/${course._id}/edit`);
    } catch (error) {
      console.error(error);
      alert("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
        <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger />
          <h1 className="ml-4 text-xl font-semibold">
            GuruCool
          </h1>
        </header>
    <CourseForm
      loading={loading}
      onSubmit={handleCreate}
    />
          </SidebarInset>
    </SidebarProvider>
  );
}