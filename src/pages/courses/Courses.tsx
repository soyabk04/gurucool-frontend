import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getCourses, getMyCourses } from "@/services/course.service";

interface CourseListItem {
  _id: string;
  title: string;
  thumbnail?: string;
}

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManageCourses = user?.role === "superadmin" || user?.role === "admin" ;

  useEffect(() => {
    if (!user) return;

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        if (canManageCourses) {
          const res = await getCourses();
          console.log(res)
          setCourses(res.res ?? []);
        } else {
          const res = await getMyCourses();
          console.log(res)
          setCourses(res.res ?? []);
        }
      } catch (err: any) {
        // Backend returns 404 when a learner has no enrollments yet — treat
        // that as an empty list rather than an error state.
        if (err?.response?.status === 404) {
          setCourses([]);
        } else {
          setError(
            err?.response?.data?.message ?? "Failed to load courses."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, canManageCourses]);

  return (
<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
  {courses.map((course) => (
    <Link
      key={course._id}
      to={
        canManageCourses
          ? `/courses/${course._id}/edit`
          : `/courses/${course._id}`
      }
    >
      <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="aspect-video bg-muted">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Thumbnail
            </div>
          )}
        </div>

        <CardContent className="space-y-3 p-4">
          <h3 className="line-clamp-2 text-lg font-semibold">
            {course.title}
          </h3>

          <Button className="w-full">
            {canManageCourses ? "Manage Course" : "Open Course"}
          </Button>
        </CardContent>
      </Card>
    </Link>
  ))}
</div>
  );
}
