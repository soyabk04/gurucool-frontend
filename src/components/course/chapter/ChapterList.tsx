import ChapterCard from "./ChapterCard";
// import { BookOpen } from "lucide-react";
import type { Chapter } from "@/types/course";

interface ChapterListProps {
  chapters: Chapter[];
}

export default function ChapterList({
  chapters,
}: ChapterListProps) {
  if (chapters.length === 0) {
    return (
      <p className="text-muted-foreground">
        No chapters yet.
      </p>
    );
  }

  return (
<div className="space-y-3">
  {chapters.map((chapter, index) => (
    <div
      key={chapter._id}
      className="flex items-start gap-3"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-sm font-medium text-muted-foreground">
        {index + 1}
      </div>

      <div className="min-w-0 flex-1">
        <ChapterCard chapter={chapter} />
      </div>
    </div>
  ))}
</div>
  );
}