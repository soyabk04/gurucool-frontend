import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import VideoPlayer from "@/components/chapter/VideoPlayer";
import ChapterSidebar from "@/components/chapter/ChapterSidebar";

import { getChapter } from "@/services/chapter.service";
import { getChapters } from "@/services/chapter.services";
import type { Chapter, ChapterWithProgress } from "@/types/course"
import {
  getCourseProgress,
  updateChapterProgress,
  type CourseProgress,
} from "@/services/course.service";

import axios from "axios";
import { toast } from "sonner";


export default function ChapterPage() {
  const { chapterId, courseId } = useParams<{
    chapterId: string;
    courseId: string;
  }>();

  const [chapter, setChapter] =
    useState<ChapterWithProgress | null>(null);

  const [chapters, setChapters] =
    useState<ChapterWithProgress[]>([]);

  const [courseProgress, setCourseProgress] =
    useState<CourseProgress | null>(null);

  const [loading, setLoading] = useState(true);
  courseProgress
  /**
   * Fetch chapter + chapters + progress
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!chapterId || !courseId) {
        return;
      }

      try {
        setLoading(true);

        const [
          chapterData,
          chaptersData,
          progressData,
        ] = await Promise.all([
          getChapter(chapterId),
          getChapters(courseId),
          getCourseProgress(courseId),
        ]);
        console.log(chapterData,
          chaptersData,
          progressData,)
        setChapter({
          ...chapterData,
          completed: false,
          watchedDuration: 0,
        });

        /*
         * Merge backend progress with chapters.
         *
         * getChapters() gives us the course chapters.
         * getCourseProgress() gives us completed/
         * watchedDuration for the current user.
         */
        const progressMap = new Map(
          progressData.chapters.map((item) => [
            item._id,
            item,
          ])
        );

        const chaptersWithProgress =
          chaptersData.map((item: Chapter) => {
            const progress = progressMap.get(item._id);

            return {
              ...item,
              completed:
                progress?.completed ?? false,
              watchedDuration:
                progress?.watchedDuration ?? 0,
            };
          });

        setChapters(chaptersWithProgress);

        /*
         * Also update the current chapter with
         * the user's progress.
         */
        const currentProgress =
          progressMap.get(chapterId);

        setChapter({
          ...chapterData,
          completed:
            currentProgress?.completed ?? false,
          watchedDuration:
            currentProgress?.watchedDuration ?? 0,
        });

        setCourseProgress(progressData);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response?.status);
          console.error(
            error.response?.data?.message
          );

          toast.error(
            error.response?.data?.message ||
            "Failed to load chapter"
          );
        } else {
          console.error(error);
          toast.error("Failed to load chapter");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chapterId, courseId]);

  /**
   * Save watched duration
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
   * Complete chapter when video ends
   */
  const handleChapterComplete = async (
    watchedDuration: number
  ) => {
    if (!courseId || !chapterId) {
      return;
    }

    try {
      const updated =
        await updateChapterProgress({
          courseId,
          chapterId,
          watchedDuration,
          completed: true,
        });

      /*
       * Update current chapter
       */
      setChapter((prev) =>
        prev
          ? {
            ...prev,
            completed: true,
            watchedDuration,
          }
          : prev
      );

      /*
       * Update sidebar
       */
      setChapters((prev) =>
        prev.map((item) =>
          item._id === chapterId
            ? {
              ...item,
              completed: true,
              watchedDuration,
            }
            : item
        )
      );

      /*
       * Update course progress locally
       */
      setCourseProgress((prev) =>
        prev
          ? {
            ...prev,
            progress:
              updated.courseProgress ??
              prev.progress,
            percentage:
              updated.courseProgress ??
              prev.percentage,
            completedChapters:
              prev.completedChapters + 1,
          }
          : prev
      );

      toast.success("Chapter completed");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
          "Failed to update progress"
        );
      } else {
        toast.error("Failed to update progress");
      }
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
      </main>
    );
  }

  if (!chapter) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Chapter not found.
        </p>
      </main>
    );
  }

  const chapterIndex = chapters.findIndex(
    (item) => item._id === chapterId
  );

  return (
    <main className="mx-auto w-full max-w-7xl p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main Content */}
        <div className="min-w-0 space-y-5">
          {/* Header */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Course</span>
              <span>/</span>
              <span>Chapter</span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {chapter.title}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  Chapter {chapterIndex + 1} of{" "}
                  {chapters.length}
                </p>
              </div>
            </div>
          </div>

          {/* Video */}
          <VideoPlayer
            videoUrl={chapter.videoUrl!}
            title={chapter.title}
            onProgress={handleProgress}
            onEnded={handleChapterComplete}
          />

          {/* Bottom Information */}
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
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${chapter.completed
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
                  }`}
              >
                {chapter.completed
                  ? "Completed"
                  : "In Progress"}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <ChapterSidebar
            courseId={courseId!}
            chapters={chapters}
            currentChapterId={chapterId!}
          />
        </aside>
      </div>
    </main>
  );
}