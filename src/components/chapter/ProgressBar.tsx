import { CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  completed: number;
  total: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  completed,
  total,
  showLabel = true,
}: ProgressBarProps) {
  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-3">
      {showLabel && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2
              className={`h-4 w-4 ${
                percentage === 100
                  ? "text-green-500"
                  : "text-primary"
              }`}
            />

            <span className="text-sm font-medium">
              Course Progress
            </span>
          </div>

          <span className="text-sm text-muted-foreground">
            {completed}/{total}{" "}
            <span className="text-foreground/80">
              ({percentage}%)
            </span>
          </span>
        </div>
      )}

      <Progress
        value={percentage}
        className="h-2"
      />

      {percentage === 100 && (
        <p className="text-xs font-medium text-green-600 dark:text-green-400">
          Course completed
        </p>
      )}
    </div>
  );
}