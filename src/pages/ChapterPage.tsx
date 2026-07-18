import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import VideoPlayer from "@/components/chapter/VideoPlayer";
import ChapterSidebar from "@/components/chapter/ChapterSidebar";
import { getChapter } from "@/services/chapter.service";
import { getChapters } from "@/services/chapter.services";


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
        console.error(error);
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
    <main className="mx-auto max-w-7xl p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{chapter.title}</h1>

            {chapter.description && (
              <p className="mt-2 text-muted-foreground">
                {chapter.description}
              </p>
            )}
          </div>

          <VideoPlayer videoUrl={chapter.videoUrl} />
        </div>

        {/* Sidebar */}
        <ChapterSidebar
          courseId={courseId!}
          chapters={chapters}
          currentChapterId={chapterId!}
        />
      </div>
    </main>
  );
}