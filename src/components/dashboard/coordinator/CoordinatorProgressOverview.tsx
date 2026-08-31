import {
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  averageProgress: number;
  completionRate: number;
}

export function CoordinatorProgressOverview({
  averageProgress,
  completionRate,
}: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Average Progress
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {averageProgress}%
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Overall progress of your students
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Completion Rate
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {completionRate}%
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Courses completed by students
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}