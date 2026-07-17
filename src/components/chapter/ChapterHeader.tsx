import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock3, PlayCircle } from "lucide-react";

interface Chapter {
  _id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  completed?: boolean;
}

interface ChapterHeaderProps {
  chapter: Chapter;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  if (minutes === 0) {
    return `${remaining}s`;
  }

  if (remaining === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${remaining}s`;
}

export default function ChapterHeader({
  chapter,
}: ChapterHeaderProps) {
  return (
    <div className="space-y-5">
      {/* Top */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary">
            Chapter {chapter.order}
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight">
            {chapter.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <Clock3 className="h-4 w-4" />
            {formatDuration(chapter.duration)}
          </Badge>

          {chapter.completed ? (
            <Badge className="gap-1 bg-green-600 hover:bg-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <PlayCircle className="h-4 w-4" />
              In Progress
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">
          About this chapter
        </h2>

        <p className="leading-7 text-muted-foreground">
          {chapter.description}
        </p>
      </div>
    </div>
  );
}