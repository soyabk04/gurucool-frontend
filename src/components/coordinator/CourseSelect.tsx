import { useEffect, useState } from "react";

import { getCourses } from "@/services/course.service";
import type { Course } from "@/types/course";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function CourseSelect({
  value,
  onChange,
}: CourseSelectProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getCourses();

        console.log("COURSE RESPONSE:", response);

        const courseList = response?.res ?? [];

        setCourses(courseList);
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Find selected course from ID
  const selectedCourse = courses.find(
    (course) => String(course._id) === String(value)
  );

  return (
    <Select
      value={value ? String(value) : undefined}
      onValueChange={(courseId) => {
        onChange(courseId);
      }}
      disabled={loading}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {loading
            ? "Loading courses..."
            : selectedCourse?.title || "Select a course"}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {courses.map((course) => (
          <SelectItem
            key={String(course._id)}
            value={String(course._id)}
          >
            {course.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}