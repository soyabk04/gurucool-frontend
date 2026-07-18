import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  const canManageCourses = user?.role === "superadmin" || user?.role === "admin";

  useEffect(() => {
    if (!user) return;

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        if (canManageCourses) {
          const res = await getCourses();
          console.log(res);
          setCourses(res.res ?? []);
        } else {
          const res = await getMyCourses();
          console.log(res);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>

        {canManageCourses && (
          <Link to="/courses/new">
            <Button>+ New Course</Button>
          </Link>
        )}
      </div>

      {loading && (
        <p className="text-muted-foreground">Loading courses...</p>
      )}

      {!loading && error && (
        <p className="text-destructive">{error}</p>
      )}

      {!loading && !error && courses.length === 0 && (
        <p className="text-muted-foreground">No courses found.</p>
      )}

      {!loading && !error && courses.length > 0 && (
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
      )}
    </div>
  );
}