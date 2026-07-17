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
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      console.log(data)
      setCourses(data.res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
// console.log(courses)
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={
            loading
              ? "Loading courses..."
              : "Select a course"
          }
        />
      </SelectTrigger>

      <SelectContent>
        {courses.map((course) => (
          <SelectItem
            key={course._id}
            value={course._id}
          >
            {course.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}