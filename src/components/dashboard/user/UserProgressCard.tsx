import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

interface Props {
  averageProgress: number;
  completionRate: number;
}

export function UserProgressCard({
  averageProgress,
  completionRate,
}: Props) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Overall Progress
            </span>

            <span className="font-semibold">
              {averageProgress}%
            </span>
          </div>

          <Progress value={averageProgress} />
        </div>

        <div className="flex items-center justify-between rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="font-medium">
                Completion Rate
              </p>

              <p className="text-sm text-muted-foreground">
                Percentage of courses completed
              </p>
            </div>
          </div>

          <span className="text-2xl font-bold">
            {completionRate}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}