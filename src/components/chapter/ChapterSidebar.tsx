import {
  CheckCircle2,
  PlayCircle,
  BookOpen,
  Lock,
  Clock,
  TimerOff,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";

import ProgressBar from "./ProgressBar";

interface ChapterAccess {
  accessDate: string;
  lastDate: string;
}

interface Chapter {
  _id: string;
  title: string;
  duration?: number;
  order: number;
  completed?: boolean;

  /*
   * Chapter access schedule
   */
  access?: ChapterAccess;
}

interface ChapterSidebarProps {
  courseId: string;
  chapters: Chapter[];
  currentChapterId: string;
}

type ChapterAccessStatus =
  | "available"
  | "upcoming"
  | "expired"
  | "locked";

export default function ChapterSidebar({
  courseId,
  chapters,
  currentChapterId,
}: ChapterSidebarProps) {
  const sortedChapters = [...chapters].sort(
    (a, b) => a.order - b.order
  );

  const completedChapters =
    sortedChapters.filter(
      (chapter) => chapter.completed
    ).length;

  /*
   * --------------------------------------------------
   * Get chapter access status
   * --------------------------------------------------
   */

  const getAccessStatus = (
    chapter: Chapter,
    index: number
  ): ChapterAccessStatus => {
    /*
     * Previous chapter must be completed.
     *
     * First chapter has no previous chapter.
     */

    const previousChapter =
      index > 0
        ? sortedChapters[index - 1]
        : null;

    const previousCompleted =
      index === 0 ||
      previousChapter?.completed === true;

    /*
     * If previous chapter isn't completed,
     * chapter remains locked.
     */

    if (!previousCompleted) {
      return "locked";
    }

    /*
     * If access dates aren't configured,
     * keep it locked.
     */

    if (!chapter.access) {
      return "locked";
    }

    const now = new Date();

    const accessDate = new Date(
      chapter.access.accessDate
    );

    const lastDate = new Date(
      chapter.access.lastDate
    );

    /*
     * Upcoming
     */

    if (now < accessDate) {
      return "upcoming";
    }

    /*
     * Expired
     */

    if (now > lastDate) {
      return "expired";
    }

    /*
     * Available
     */

    return "available";
  };

  /*
   * --------------------------------------------------
   * Format date
   * --------------------------------------------------
   */

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
      }
    );
  };

  return (
    <Card className="overflow-hidden rounded-2xl border bg-card shadow-sm">

      {/* ==================================================
          Header
      =================================================== */}

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

      {/* ==================================================
          Progress
      =================================================== */}

      <div className="border-b px-4 py-4">
        <ProgressBar
          completed={
            completedChapters
          }
          total={
            sortedChapters.length
          }
        />
      </div>

      {/* ==================================================
          Chapters
      =================================================== */}

      <CardContent className="p-0">

        <ScrollArea className="h-[650px]">

          <div className="space-y-1.5 p-2">

            {sortedChapters.map(
              (chapter, index) => {

                const isCurrent =
                  chapter._id ===
                  currentChapterId;

                const isCompleted =
                  chapter.completed ===
                  true;

                const status =
                  getAccessStatus(
                    chapter,
                    index
                  );

                /*
                 * --------------------------------------------------
                 * Available
                 * --------------------------------------------------
                 */

                if (
                  status ===
                  "available"
                ) {
                  return (
                    <Link
                      key={
                        chapter._id
                      }
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
                          flex h-9 w-9 shrink-0
                          items-center justify-center
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
                          String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )
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
                              {Math.floor(
                                chapter.duration /
                                  60
                              )}{" "}
                              min
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

                          {!isCompleted &&
                            isCurrent && (
                              <span className="text-xs text-primary-foreground/70">
                                Current
                              </span>
                          )}

                        </div>
                      </div>

                      {/* Current Indicator */}

                      {isCurrent && (
                        <PlayCircle className="h-4 w-4 shrink-0" />
                      )}

                    </Link>
                  );
                }

                /*
                 * --------------------------------------------------
                 * Upcoming
                 * --------------------------------------------------
                 */

                if (
                  status ===
                  "upcoming"
                ) {
                  return (
                    <div
                      key={
                        chapter._id
                      }
                      className="
                        group relative flex
                        cursor-not-allowed
                        items-center gap-3
                        rounded-xl px-3 py-3
                        opacity-60
                      "
                      title={`Available from ${formatDate(
                        chapter.access?.accessDate
                      )}`}
                    >

                      {/* Clock */}

                      <div
                        className="
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-lg bg-muted
                          text-muted-foreground
                        "
                      >
                        <Clock className="h-4 w-4" />
                      </div>

                      {/* Info */}

                      <div className="min-w-0 flex-1">

                        <p
                          className="
                            truncate text-sm font-medium
                            text-muted-foreground
                          "
                        >
                          {chapter.title}
                        </p>

                        <div className="mt-1 flex items-center gap-2">

                          {chapter.duration && (
                            <p className="text-xs text-muted-foreground">
                              {Math.floor(
                                chapter.duration /
                                  60
                              )}{" "}
                              min
                            </p>
                          )}

                          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

                          <span className="text-xs text-muted-foreground">
                            Available{" "}
                            {formatDate(
                              chapter.access?.accessDate
                            )}
                          </span>

                        </div>
                      </div>

                      <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />

                    </div>
                  );
                }

                /*
                 * --------------------------------------------------
                 * Expired
                 * --------------------------------------------------
                 */

                if (
                  status ===
                  "expired"
                ) {
                  return (
                    <div
                      key={
                        chapter._id
                      }
                      className="
                        group relative flex
                        cursor-not-allowed
                        items-center gap-3
                        rounded-xl px-3 py-3
                        opacity-50
                      "
                      title={`Access expired on ${formatDate(
                        chapter.access?.lastDate
                      )}`}
                    >

                      {/* Icon */}

                      <div
                        className="
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-lg bg-muted
                          text-muted-foreground
                        "
                      >
                        <TimerOff className="h-4 w-4" />
                      </div>

                      {/* Info */}

                      <div className="min-w-0 flex-1">

                        <p
                          className="
                            truncate text-sm font-medium
                            text-muted-foreground
                          "
                        >
                          {chapter.title}
                        </p>

                        <div className="mt-1 flex items-center gap-2">

                          {chapter.duration && (
                            <p className="text-xs text-muted-foreground">
                              {Math.floor(
                                chapter.duration /
                                  60
                              )}{" "}
                              min
                            </p>
                          )}

                          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

                          <span className="text-xs text-muted-foreground">
                            Access expired
                          </span>

                        </div>
                      </div>

                      <TimerOff className="h-4 w-4 shrink-0 text-muted-foreground" />

                    </div>
                  );
                }

                /*
                 * --------------------------------------------------
                 * Locked
                 *
                 * Previous chapter isn't completed.
                 * --------------------------------------------------
                 */

                return (
                  <div
                    key={
                      chapter._id
                    }
                    className="
                      group relative flex
                      cursor-not-allowed
                      items-center gap-3
                      rounded-xl px-3 py-3
                      opacity-50
                    "
                    title={
                      index > 0
                        ? "Complete the previous chapter first"
                        : "Chapter access is not configured"
                    }
                  >

                    {/* Lock Icon */}

                    <div
                      className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-lg bg-muted
                        text-muted-foreground
                      "
                    >
                      <Lock className="h-4 w-4" />
                    </div>

                    {/* Chapter Info */}

                    <div className="min-w-0 flex-1">

                      <p
                        className="
                          truncate text-sm font-medium
                          text-muted-foreground
                        "
                      >
                        {chapter.title}
                      </p>

                      <div className="mt-1 flex items-center gap-2">

                        {chapter.duration && (
                          <p className="text-xs text-muted-foreground">
                            {Math.floor(
                              chapter.duration /
                                60
                            )}{" "}
                            min
                          </p>
                        )}

                        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

                        <span className="text-xs text-muted-foreground">
                          {index > 0
                            ? "Complete previous chapter"
                            : "Access unavailable"}
                        </span>

                      </div>
                    </div>

                    <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />

                  </div>
                );
              }
            )}

          </div>

        </ScrollArea>

      </CardContent>

    </Card>
  );
}

