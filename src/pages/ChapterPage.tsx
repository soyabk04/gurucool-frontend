import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import VideoPlayer from "@/components/chapter/videoplayer";
import { getChapter } from "@/services/chapter.service";



export default function ChapterPage() {
  const { chapterId } = useParams();

  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        if (!chapterId) return;

        const data = await getChapter(chapterId);
        
        setChapter(data);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId]);

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
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        {chapter.title}
      </h1>

      <VideoPlayer videoUrl={chapter.videoUrl} />
    </main>
  );
}