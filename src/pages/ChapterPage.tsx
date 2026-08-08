import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import VideoPlayer from "@/components/chapter/VideoPlayer";
import ChapterSidebar from "@/components/chapter/ChapterSidebar";
import { getChapter } from "@/services/chapter.service";
import { getChapters } from "@/services/chapter.services";
import axios from "axios";
import { toast } from "sonner";


export default function ChapterPage() {
  const { chapterId, courseId } = useParams();

  const [chapter, setChapter] = useState<any>(null);
  const [chapters, setChapters] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!chapterId || !courseId) return;

        const [chapterData, chaptersData] = await Promise.all([
          getChapter(chapterId),
          getChapters(courseId),
        ]);

        setChapter(chapterData);
        setChapters(chaptersData);
      } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.status);
        console.error(error.response?.data?.message);
        toast.error(error.response?.data?.message)
      } else {
        console.error(error);
      }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chapterId, courseId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex h-screen items-center justify-center">
        Chapter not found.
      </div>
    );
  }

return (
  <main className="mx-auto w-full max-w-7xl p-6">
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* Main Content */}
      <div className="min-w-0 space-y-5">
        {/* Chapter Header */}
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
                Chapter {chapters.findIndex(
                  (item:any) => item._id === chapterId
                ) + 1}{" "}
                of {chapters.length}
              </p>
            </div>
          </div>
        </div>

        {/* Video */}
        <div className="overflow-hidden rounded-2xl border bg-black shadow-sm">
          <VideoPlayer videoUrl={chapter.videoUrl} />
        </div>

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

            <div className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Video
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