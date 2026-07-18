import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Chapter {
  _id: string;
  title: string;
  description?: string;
  duration?: number;
  order: number;
  completed?: boolean;
}

interface ChapterSidebarProps {
  courseId: string;
  chapters: Chapter[];
  currentChapterId: string;
}

export default function ChapterSidebar({
  courseId,
  chapters,
  currentChapterId,
}: ChapterSidebarProps) {
  const sortedChapters = [...chapters].sort(
    (a, b) => a.order - b.order
  );

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Course Content</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[650px]">
          <div className="space-y-1 p-2">
            {sortedChapters.map((chapter) => {
              const isCurrent =
                chapter._id === currentChapterId;

              return (
                <Link
                  key={chapter._id}
                  to={`/courses/${courseId}/chapter/${chapter._id}`}
                  className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="mt-1">
                    {chapter.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : isCurrent ? (
                      <PlayCircle className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      {chapter.order}. {chapter.title}
                    </p>

                    {chapter.duration && (
                      <p
                        className={`text-sm ${
                          isCurrent
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {Math.floor(chapter.duration / 60)} min
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}