import {
  CheckCircle2,
  PlayCircle,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import ProgressBar from "./ProgressBar";

interface Chapter {
  _id: string;
  title: string;
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

  const completedChapters = sortedChapters.filter(
    (chapter) => chapter.completed
  ).length;

  return (
    <Card className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* Header */}
      <div className="border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">
              Course Content
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {sortedChapters.length}{" "}
              {sortedChapters.length === 1
                ? "chapter"
                : "chapters"}
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="border-b px-4 py-4">
        <ProgressBar
          completed={completedChapters}
          total={sortedChapters.length}
        />
      </div>

      {/* Chapters */}
      <CardContent className="p-0">
        <ScrollArea className="h-[650px]">
          <div className="space-y-1.5 p-2">
            {sortedChapters.map((chapter, index) => {
              const isCurrent =
                chapter._id === currentChapterId;

              const isCompleted = chapter.completed;

              return (
                <Link
                  key={chapter._id}
                  to={`/courses/${courseId}/chapter/${chapter._id}`}
                  className={`
                    group relative flex items-center gap-3
                    rounded-xl px-3 py-3
                    transition-all duration-200
                    ${
                      isCurrent
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted/60"
                    }
                  `}
                >
                  {/* Chapter Number / Status */}
                  <div
                    className={`
                      flex h-9 w-9 shrink-0 items-center justify-center
                      rounded-lg text-xs font-semibold
                      ${
                        isCurrent
                          ? "bg-primary-foreground/15 text-primary-foreground"
                          : isCompleted
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-muted text-muted-foreground"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </div>

                  {/* Chapter Info */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`
                        truncate text-sm font-medium
                        ${
                          isCurrent
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }
                      `}
                    >
                      {chapter.title}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      {chapter.duration && (
                        <p
                          className={`
                            text-xs
                            ${
                              isCurrent
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }
                          `}
                        >
                          {Math.floor(chapter.duration / 60)} min
                        </p>
                      )}

                      {isCompleted && (
                        <>
                          {chapter.duration && (
                            <span
                              className={`
                                h-1 w-1 rounded-full
                                ${
                                  isCurrent
                                    ? "bg-primary-foreground/50"
                                    : "bg-muted-foreground/40"
                                }
                              `}
                            />
                          )}

                          <span
                            className={`
                              text-xs
                              ${
                                isCurrent
                                  ? "text-primary-foreground/70"
                                  : "text-green-600 dark:text-green-400"
                              }
                            `}
                          >
                            Completed
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Current Indicator */}
                  {isCurrent && (
                    <PlayCircle className="h-4 w-4 shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}