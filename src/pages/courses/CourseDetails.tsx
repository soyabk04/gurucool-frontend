import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  BookOpen,
  ChevronRight,
  Clock,
  FileText,
  Lock,
  Loader2,
  TimerOff,
  Video,
} from "lucide-react";

import { getChapters } from "@/services/chapter.services";
import type { Chapter } from "@/types/course";

type ChapterAccessStatus =
  | "available"
  | "upcoming"
  | "expired"
  | "locked"
  | "not_configured";

interface ChapterWithAccess extends Chapter {
  completed?: boolean;
  access?: {
    accessDate: string;
    lastDate: string;
    status: ChapterAccessStatus;
  } | null;
}

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [chapters, setChapters] = useState<
    ChapterWithAccess[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /*
   * --------------------------------------------------
   * Fetch chapters
   * --------------------------------------------------
   */

  useEffect(() => {
    if (!courseId) return;

    const fetchChapters = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getChapters(courseId);

        setChapters(data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
            "Failed to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [courseId]);

  /*
   * --------------------------------------------------
   * Format date
   * --------------------------------------------------
   */

  const formatDate = (date?: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
   * --------------------------------------------------
   * Navigate to chapter
   * --------------------------------------------------
   */

  const openChapter = (
    chapter: ChapterWithAccess
  ) => {
    const status =
      chapter.access?.status;

    /*
     * Only available chapters can be opened.
     */

    if (status !== "available") {
      return;
    }

    navigate(
      `/courses/${courseId}/chapter/${chapter._id}`
    );
  };

  /*
   * --------------------------------------------------
   * Keyboard navigation
   * --------------------------------------------------
   */

  const handleKeyDown = (
    event: React.KeyboardEvent,
    chapter: ChapterWithAccess
  ) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      openChapter(chapter);
    }
  };

  /*
   * --------------------------------------------------
   * Get chapter display information
   * --------------------------------------------------
   */

  const getStatusText = (
    chapter: ChapterWithAccess
  ) => {
    const status =
      chapter.access?.status;

    switch (status) {
      case "available":
        return "Available";

      case "upcoming":
        return chapter.access?.accessDate
          ? `Available from ${formatDate(
              chapter.access.accessDate
            )}`
          : "Not available yet";

      case "expired":
        return chapter.access?.lastDate
          ? `Expired on ${formatDate(
              chapter.access.lastDate
            )}`
          : "Access expired";

      case "locked":
        return "Complete the previous chapter first";

      case "not_configured":
      default:
        return "Access not configured";
    }
  };

  /*
   * --------------------------------------------------
   * Render
   * --------------------------------------------------
   */

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">

      {/* ==================================================
          Header
          ================================================== */}

      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">

          <BookOpen className="h-4 w-4" />

          <span>Course</span>

          <ChevronRight className="h-3.5 w-3.5" />

          <span>Content</span>

        </div>

        <div className="flex items-end justify-between gap-4">

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Course Content
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Browse the chapters and continue learning.
            </p>
          </div>

          {!loading && !error && (
            <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">

              <span className="font-medium">
                {chapters.length}
              </span>{" "}

              <span className="text-muted-foreground">
                {chapters.length === 1
                  ? "chapter"
                  : "chapters"}
              </span>

            </div>
          )}

        </div>
      </div>

      {/* ==================================================
          Loading
          ================================================== */}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border bg-card">

          <div className="flex flex-col items-center gap-3">

            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />

            <p className="text-sm text-muted-foreground">
              Loading course content...
            </p>

          </div>

        </div>
      ) : error ? (

        /* ==================================================
           Error
           ================================================== */

        <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5">

          <div className="text-center">

            <h3 className="text-sm font-semibold">
              Unable to load chapters
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {error}
            </p>

          </div>

        </div>
      ) : chapters.length === 0 ? (

        /* ==================================================
           Empty
           ================================================== */

        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed bg-card">

          <div className="text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">

              <BookOpen className="h-5 w-5 text-muted-foreground" />

            </div>

            <h3 className="text-sm font-semibold">
              No chapters yet
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              This course doesn't have any chapters yet.
            </p>

          </div>

        </div>
      ) : (

        /* ==================================================
           Chapters
           ================================================== */

        <div className="overflow-hidden rounded-2xl border bg-card">

          {/* Section Header */}

          <div className="border-b bg-muted/20 px-5 py-4">

            <h2 className="text-sm font-semibold">
              Chapters
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Select an available chapter to start learning.
            </p>

          </div>

          {/* Chapter List */}

          <div className="divide-y">

            {chapters.map(
              (chapter, index) => {
                const isVideo =
                  chapter.type === "video";

                const status =
                  chapter.access?.status ??
                  "not_configured";

                const isAvailable =
                  status === "available";

                const isCompleted =
                  chapter.completed === true;

                return (
                  <div
                    key={chapter._id}
                    role={
                      isAvailable
                        ? "button"
                        : undefined
                    }
                    tabIndex={
                      isAvailable
                        ? 0
                        : -1
                    }
                    onClick={() =>
                      openChapter(
                        chapter
                      )
                    }
                    onKeyDown={(event) =>
                      handleKeyDown(
                        event,
                        chapter
                      )
                    }
                    className={`
                      group flex items-center gap-4
                      px-5 py-4
                      transition-colors

                      ${
                        isAvailable
                          ? `
                            cursor-pointer
                            hover:bg-muted/40
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary
                            focus-visible:ring-inset
                          `
                          : `
                            cursor-not-allowed
                            opacity-60
                          `
                      }
                    `}
                  >

                    {/* ==================================================
                        Chapter Number / Status Icon
                        ================================================== */}

                    <div
                      className={`
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-xl
                        text-sm font-semibold

                        ${
                          isCompleted
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : isAvailable
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                        }
                      `}
                    >

                      {isCompleted ? (
                        <span>✓</span>
                      ) : status ===
                        "upcoming" ? (
                        <Clock className="h-4 w-4" />
                      ) : status ===
                        "expired" ? (
                        <TimerOff className="h-4 w-4" />
                      ) : status ===
                        "locked" ||
                        status ===
                          "not_configured" ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        String(
                          index + 1
                        ).padStart(2, "0")
                      )}

                    </div>

                    {/* ==================================================
                        Type Icon
                        ================================================== */}

                    <div
                      className={`
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-xl border
                        bg-background
                        text-muted-foreground

                        ${
                          isAvailable
                            ? "group-hover:text-primary"
                            : ""
                        }
                      `}
                    >

                      {isVideo ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}

                    </div>

                    {/* ==================================================
                        Title + Status
                        ================================================== */}

                    <div className="min-w-0 flex-1">

                      <h3
                        className={`
                          truncate text-sm font-medium
                          ${
                            isAvailable
                              ? "group-hover:text-primary"
                              : "text-muted-foreground"
                          }
                        `}
                      >
                        {chapter.title}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-2">

                        <span className="text-xs text-muted-foreground">
                          {isVideo
                            ? "Video lesson"
                            : "Document"}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

                        <span
                          className={`
                            text-xs

                            ${
                              status ===
                              "available"
                                ? "text-green-600 dark:text-green-400"
                                : "text-muted-foreground"
                            }
                          `}
                        >
                          {getStatusText(
                            chapter
                          )}
                        </span>

                      </div>

                    </div>

                    {/* ==================================================
                        Type Badge
                        ================================================== */}

                    <span
                      className="
                        hidden rounded-full
                        border bg-muted/50
                        px-2.5 py-1
                        text-[11px] font-medium
                        text-muted-foreground
                        sm:inline-flex
                      "
                    >
                      {isVideo
                        ? "Video"
                        : "Document"}
                    </span>

                    {/* ==================================================
                        Right Icon
                        ================================================== */}

                    {isAvailable ? (
                      <ChevronRight
                        className="
                          h-4 w-4 shrink-0
                          text-muted-foreground/40
                          transition-all
                          group-hover:translate-x-0.5
                          group-hover:text-foreground
                        "
                      />
                    ) : status ===
                      "upcoming" ? (
                      <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : status ===
                      "expired" ? (
                      <TimerOff className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}

                  </div>
                );
              }
            )}

          </div>
        </div>
      )}

    </div>
  );
}