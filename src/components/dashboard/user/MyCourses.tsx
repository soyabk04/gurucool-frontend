import { BookOpen } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

interface Course {
  id: string;
  name: string;
  progress: number;
  status: string;
  updatedAt: string;
}

interface Props {
  courses: Course[];
}

export function MyCourses({ courses }: Props) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          My Courses
        </CardTitle>

        <CardDescription>
          Your enrolled courses and current progress
        </CardDescription>
      </CardHeader>

      <CardContent>
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-muted p-3">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>

            <p className="mt-3 font-medium">
              No courses yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              You are not enrolled in any courses.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium">
                      {course.name}
                    </h3>

                    <p className="mt-1 text-xs capitalize text-muted-foreground">
                      {course.status}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold">
                    {course.progress}%
                  </span>
                </div>

                <Progress value={course.progress} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}