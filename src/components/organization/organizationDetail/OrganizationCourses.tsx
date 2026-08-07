import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  Calendar,
  Plus,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { getCourses } from "@/services/course.service";

interface Props {
  organizationId?: string;
}

interface Course {
  _id: string;
  title: string;
  thumbnail?: string;
  description?: string;
  students: number;
  assignedAt: string;
}

export default function OrganizationCourses({
  organizationId,
}: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourses(
          organizationId
        );
        console.log(res);
        setCourses(res.res??[]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [organizationId]);

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Assigned Courses</CardTitle>

          <p className="text-sm text-muted-foreground">
            Courses available in this organization.
          </p>
        </div>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Assign Course
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-72 rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course._id}
                className="group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden bg-muted">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <Badge className="absolute right-3 top-3">
                    Active
                  </Badge>
                </div>

                <CardContent className="space-y-4 p-5">
                  <div>
                    <h3 className="line-clamp-1 text-lg font-semibold">
                      {course.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />

                      {course.students} Students
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />

                      {new Date(
                        course.assignedAt
                      ).toLocaleDateString()}
                    </div>
                  </div>

                  <Button className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />

                    Open Course

                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !courses.length && (
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />

            <h3 className="text-lg font-semibold">
              No courses assigned
            </h3>

            <p className="mb-6 text-muted-foreground">
              Assign your first course to this organization.
            </p>

            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Assign Course
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}