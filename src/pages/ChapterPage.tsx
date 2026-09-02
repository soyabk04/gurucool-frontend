import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import VideoPlayer from "@/components/chapter/VideoPlayer";
import ChapterSidebar from "@/components/chapter/ChapterSidebar";
import ChapterQuiz from "@/components/course/chapter/ChapterQuiz";

import {
  getChapters,
  getChapter,
} from "@/services/chapter.services";

import {
  getQuizQuestions,
} from "@/services/quiz.service";

import type {
  Chapter,
  ChapterWithProgress,
  QuizQuestion,
} from "@/types/course";

import {
  getCourseProgress,
  updateChapterProgress,
  type CourseProgress,
} from "@/services/course.service";

import axios from "axios";
import { toast } from "sonner";

export default function ChapterPage() {
  const {
    chapterId,
    courseId,
  } = useParams<{
    chapterId: string;
    courseId: string;
  }>();

  const [chapter, setChapter] =
    useState<ChapterWithProgress | null>(null);

  const [chapters, setChapters] =
    useState<ChapterWithProgress[]>([]);

  const [courseProgress, setCourseProgress] =
    useState<CourseProgress | null>(null);

  const [quizQuestions, setQuizQuestions] =
    useState<QuizQuestion[]>([]);

  const [showQuiz, setShowQuiz] =
    useState(false);

  const [quizLoading, setQuizLoading] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  /*
   * --------------------------------------------------
   * Chapter access error
   * --------------------------------------------------
   */

  const [accessError, setAccessError] =
    useState<{
      code: string;
      message: string;
    } | null>(null);
   courseProgress
  /**
   * --------------------------------------------------
   * Fetch chapter + chapters + progress
   * --------------------------------------------------
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!chapterId || !courseId) {
        return;
      }

      try {
        setLoading(true);
        setAccessError(null);

        /*
         * --------------------------------------------------
         * First request chapter.
         *
         * Backend performs:
         * - enrollment check
         * - chapter access-date check
         * - expiration check
         * - previous chapter check
         * --------------------------------------------------
         */

        const chapterData =
          await getChapter(chapterId);

        /*
         * --------------------------------------------------
         * Only fetch the rest if chapter access succeeds.
         * --------------------------------------------------
         */

        const [
          chaptersData,
          progressData,
        ] = await Promise.all([
          getChapters(courseId),
          getCourseProgress(courseId),
        ]);

        /*
         * --------------------------------------------------
         * Merge backend progress with chapters
         * --------------------------------------------------
         */

        const progressMap = new Map(
          progressData.chapters.map((item) => [
            item._id,
            item,
          ])
        );

        const chaptersWithProgress =
          chaptersData.map(
            (item: Chapter) => {
              const progress =
                progressMap.get(item._id);

              return {
                ...item,
                completed:
                  progress?.completed ??
                  false,
                watchedDuration:
                  progress?.watchedDuration ??
                  0,
              };
            }
          );

        setChapters(
          chaptersWithProgress
        );

        /*
         * --------------------------------------------------
         * Current chapter progress
         * --------------------------------------------------
         */

        const currentProgress =
          progressMap.get(chapterId);

        setChapter({
          ...chapterData,
          completed:
            currentProgress?.completed ??
            false,
          watchedDuration:
            currentProgress?.watchedDuration ??
            0,
        });

        setCourseProgress(
          progressData
        );

        /*
         * --------------------------------------------------
         * Reset quiz state whenever user
         * navigates to another chapter.
         * --------------------------------------------------
         */

        setQuizQuestions([]);
        setShowQuiz(false);
      } catch (error) {
        console.error(
          "Failed to load chapter:",
          error
        );

        if (axios.isAxiosError(error)) {
          const status =
            error.response?.status;

          const code =
            error.response?.data?.code;

          const message =
            error.response?.data?.message;

          /*
           * --------------------------------------------------
           * Chapter access errors
           * --------------------------------------------------
           */

          if (
            status === 403 &&
            (
              code ===
                "CHAPTER_NOT_AVAILABLE" ||
              code ===
                "CHAPTER_ACCESS_EXPIRED" ||
              code ===
                "CHAPTER_LOCKED" ||
              code ===
                "CHAPTER_ACCESS_NOT_CONFIGURED"
            )
          ) {
            setAccessError({
              code:
                code ||
                "CHAPTER_ACCESS_DENIED",
              message:
                message ||
                "You cannot access this chapter.",
            });

            return;
          }

          toast.error(
            message ||
              "Failed to load chapter"
          );
        } else {
          toast.error(
            "Failed to load chapter"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chapterId, courseId]);

  /**
   * --------------------------------------------------
   * Save watched duration
   * --------------------------------------------------
   */
  const handleProgress = async (
    watchedDuration: number
  ) => {
    if (!courseId || !chapterId) {
      return;
    }

    try {
      await updateChapterProgress({
        courseId,
        chapterId,
        watchedDuration,
      });
    } catch (error) {
      console.error(
        "Failed to save video progress:",
        error
      );
    }
  };

  /**
   * --------------------------------------------------
   * Video ended
   *
   * IMPORTANT:
   * We DO NOT complete the chapter here.
   *
   * Instead, fetch the quiz and display it
   * in the same location as the video.
   * --------------------------------------------------
   */
  const handleVideoEnded =
    async () => {
      if (!chapterId) {
        return;
      }

      try {
        setQuizLoading(true);

        const questions =
          await getQuizQuestions(
            chapterId
          );

        setQuizQuestions(
          questions
        );

        setShowQuiz(true);
      } catch (error) {
        console.error(
          "Failed to load chapter quiz:",
          error
        );

        if (
          axios.isAxiosError(error)
        ) {
          toast.error(
            error.response?.data
              ?.message ||
              "Failed to load quiz"
          );
        } else {
          toast.error(
            "Failed to load quiz"
          );
        }
      } finally {
        setQuizLoading(false);
      }
    };

  /**
   * --------------------------------------------------
   * Called ONLY after the student passes the quiz.
   * --------------------------------------------------
   */
  const handleChapterComplete =
    async () => {
      if (
        !courseId ||
        !chapterId ||
        !chapter
      ) {
        return;
      }

      try {
        const watchedDuration =
          chapter.watchedDuration ||
          0;

        const updated =
          await updateChapterProgress({
            courseId,
            chapterId,
            watchedDuration,
            completed: true,
          });

        /*
         * --------------------------------------------------
         * Update current chapter
         * --------------------------------------------------
         */

        setChapter((prev) =>
          prev
            ? {
                ...prev,
                completed: true,
              }
            : prev
        );

        /*
         * --------------------------------------------------
         * Update sidebar
         * --------------------------------------------------
         */

        setChapters((prev) =>
          prev.map((item) =>
            item._id === chapterId
              ? {
                  ...item,
                  completed: true,
                }
              : item
          )
        );

        /*
         * --------------------------------------------------
         * Update course progress
         *
         * We calculate the new completed count
         * instead of blindly adding 1 because the
         * chapter might already have been completed.
         * --------------------------------------------------
         */

        setCourseProgress((prev) => {
          if (!prev) {
            return prev;
          }

          const wasAlreadyCompleted =
            chapter.completed;

          const completedChapters =
            wasAlreadyCompleted
              ? prev.completedChapters
              : prev.completedChapters +
                1;

          const totalChapters =
            prev.totalChapters ??
            chapters.length;

          const percentage =
            totalChapters === 0
              ? 0
              : Math.round(
                  (completedChapters /
                    totalChapters) *
                    100
                );

          return {
            ...prev,
            completedChapters,
            percentage,
            progress:
              updated.courseProgress ??
              prev.progress,
          };
        });

        toast.success(
          "Chapter completed"
        );
      } catch (error) {
        if (
          axios.isAxiosError(error)
        ) {
          toast.error(
            error.response?.data
              ?.message ||
              "Failed to update progress"
          );
        } else {
          toast.error(
            "Failed to update progress"
          );
        }
      }
    };

  /**
   * --------------------------------------------------
   * Loading
   * --------------------------------------------------
   */

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
      </main>
    );
  }

  /**
   * --------------------------------------------------
   * Chapter access denied
   * --------------------------------------------------
   */

  if (accessError) {
    let title =
      "Chapter Unavailable";

    let icon = "🔐";

    if (
      accessError.code ===
      "CHAPTER_NOT_AVAILABLE"
    ) {
      title =
        "Chapter Not Available Yet";

      icon = "🔒";
    }

    if (
      accessError.code ===
      "CHAPTER_ACCESS_EXPIRED"
    ) {
      title =
        "Chapter Access Expired";

      icon = "⌛";
    }

    if (
      accessError.code ===
      "CHAPTER_LOCKED"
    ) {
      title =
        "Chapter Locked";

      icon = "🔒";
    }

    if (
      accessError.code ===
      "CHAPTER_ACCESS_NOT_CONFIGURED"
    ) {
      title =
        "Chapter Unavailable";

      icon = "🔐";
    }

    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">
            {icon}
          </div>

          <h1 className="text-xl font-semibold">
            {title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {accessError.message}
          </p>

          <button
            type="button"
            onClick={() =>
              window.history.back()
            }
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  /**
   * --------------------------------------------------
   * Chapter not found
   * --------------------------------------------------
   */

  if (!chapter) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Chapter not found.
        </p>
      </main>
    );
  }

  /*
   * --------------------------------------------------
   * Find current chapter index
   * --------------------------------------------------
   */

  const chapterIndex =
    chapters.findIndex(
      (item) =>
        item._id === chapterId
    );

  return (
    <main className="mx-auto w-full max-w-7xl p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

        {/* ==================================================
            Main Content
        =================================================== */}

        <div className="min-w-0 space-y-5">

          {/* Header */}

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Course
              </span>

              <span>
                /
              </span>

              <span>
                Chapter
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {chapter.title}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  Chapter{" "}
                  {chapterIndex + 1}{" "}
                  of{" "}
                  {chapters.length}
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              Video / Quiz Area
          =================================================== */}

          {showQuiz ? (
            <ChapterQuiz
              questions={
                quizQuestions
              }
              onPassed={
                handleChapterComplete
              }
            />
          ) : quizLoading ? (
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl border bg-card">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

                <p className="text-sm font-medium">
                  Loading quiz...
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Get ready for the chapter quiz.
                </p>
              </div>
            </div>
          ) : (
            <VideoPlayer
              videoUrl={
                chapter.videoUrl!
              }
              title={
                chapter.title
              }
              onProgress={
                handleProgress
              }
              onEnded={
                handleVideoEnded
              }
            />
          )}

          {/* ==================================================
              Bottom Information
          =================================================== */}

          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Current Chapter
                </p>

                <h2 className="mt-1 text-base font-semibold">
                  {chapter.title}
                </h2>
              </div>

              <div
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  chapter.completed
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {chapter.completed
                  ? "Completed"
                  : showQuiz
                    ? "Quiz Required"
                    : "In Progress"}
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            Sidebar
        =================================================== */}

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <ChapterSidebar
            courseId={
              courseId!
            }
            chapters={
              chapters
            }
            currentChapterId={
              chapterId!
            }
          />
        </aside>
      </div>
    </main>
  );
}
