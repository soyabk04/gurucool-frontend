import ChapterCard from "./ChapterCard";

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
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <ChapterCard
          key={chapter._id}
          chapter={chapter}
        />
      ))}
    </div>
  );
}