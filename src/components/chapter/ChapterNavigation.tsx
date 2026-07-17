import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Chapter {
  _id: string;
  title: string;
  order: number;
  completed?: boolean;
}

interface ChapterNavigationProps {
  courseId: string;
  chapters: Chapter[];
  currentChapterId: string;
  onMarkComplete?: () => void;
  loading?: boolean;
}

export default function ChapterNavigation({
  courseId,
  chapters,
  currentChapterId,
  onMarkComplete,
  loading = false,
}: ChapterNavigationProps) {
  const sorted = [...chapters].sort((a, b) => a.order - b.order);

  const currentIndex = sorted.findIndex(
    (chapter) => chapter._id === currentChapterId
  );

  const previousChapter =
    currentIndex > 0 ? sorted[currentIndex - 1] : null;

  const nextChapter =
    currentIndex < sorted.length - 1
      ? sorted[currentIndex + 1]
      : null;

  const currentChapter = sorted[currentIndex];

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <Button
          
          variant="outline"
          disabled={!previousChapter}
        >
          {previousChapter ? (
            <Link
              to={`/courses/${courseId}/chapters/${previousChapter._id}`}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Link>
          ) : (
            <span>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </span>
          )}
        </Button>

        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Chapter {currentIndex + 1} of {sorted.length}
          </p>

          {!currentChapter?.completed && (
            <Button
              onClick={onMarkComplete}
              disabled={loading}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark Complete
            </Button>
          )}
        </div>

        <Button
          
          disabled={!nextChapter}
        >
          {nextChapter ? (
            <Link
              to={`/courses/${courseId}/chapters/${nextChapter._id}`}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <span>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}