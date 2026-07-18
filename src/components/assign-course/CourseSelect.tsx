import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getCourses } from "@/services/course.service";

interface Course {
  _id: string;
  title: string;
}

interface CourseSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

export default function CourseSelect({
  value,
  onChange,
}: CourseSelectProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getCourses();

      console.log(res)
      setCourses(res.data.res ?? res.data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-2">
      <Label htmlFor="course">Course</Label>

      <Select
        value={value}
        onValueChange={(value) => {
          if (value !== null) {
            onChange(value);
          }
        }}
      >
        <SelectTrigger id="course" className="w-full">
          <SelectValue
            placeholder={
              loading ? "Loading courses..." : "Select a course"
            }
          />
        </SelectTrigger>

        <SelectContent>
          {courses.length === 0 ? (
            <SelectItem value="no-course" disabled>
              No courses found
            </SelectItem>
          ) : (
            courses.map((course) => (
              <SelectItem
                key={course._id}
                value={course._id}
              >
                {course.title}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}