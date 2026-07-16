import { FileText, Video } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { Chapter } from "@/types/course";

interface ChapterCardProps {
  chapter: Chapter;
  onEdit?: (chapter: Chapter) => void;
  onDelete?: (chapter: Chapter) => void;
}

export default function ChapterCard({
  chapter,
  onEdit,
  onDelete,
}: ChapterCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <div className="flex items-center gap-2">
            {chapter.type === "video" ? (
              <Video className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}

            <h3 className="font-semibold">
              {chapter.title}
            </h3>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {chapter.description}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onEdit?.(chapter)}
          >
            Edit
          </Button>

          <Button
            variant="destructive"
            onClick={() => onDelete?.(chapter)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}