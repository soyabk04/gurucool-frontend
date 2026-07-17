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
    <div className="container mx-auto space-y-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">
            {canManageCourses
              ? "Manage the courses on your platform."
              : "Courses you have access to."}
          </p>
        </div>

        {canManageCourses && (
          <Button render={<Link to="/courses/new" />}>Create Course</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{courses.length} course{courses.length === 1 ? "" : "s"}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading courses...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : courses.length === 0 ? (
            <p className="text-muted-foreground">No courses yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link
                  key={course._id}
                  to={canManageCourses ? `/courses/${course._id}/edit` : `/courses/${course._id}`}
                  className="rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <h3 className="font-medium">{course.title}</h3>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
