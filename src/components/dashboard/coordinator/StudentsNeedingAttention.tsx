import { AlertTriangle, UserRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  status: string;
  updatedAt: string;
}

interface Props {
  students: Student[];
}

export function StudentsNeedingAttention({
  students,
}: Props) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Students Needing Attention
        </CardTitle>

        <CardDescription>
          Students with low course progress
        </CardDescription>
      </CardHeader>

      <CardContent>
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-green-100 p-3">
              <UserRound className="h-6 w-6 text-green-600" />
            </div>

            <p className="mt-3 font-medium">
              Everyone is on track
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              No students currently need attention.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {students.map((student) => (
              <div
                key={`${student.id}-${student.course}`}
                className="space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {student.name}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                      {student.course}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold">
                    {student.progress}%
                  </span>
                </div>

                <Progress value={student.progress} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}