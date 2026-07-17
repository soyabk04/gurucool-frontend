import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

import AddChapterDialog from "@/components/course/chapter/AddChapterDialog";
import ChapterList from "@/components/course/chapter/ChapterList";

import type { Chapter, CreateChapter } from "@/types/course";

import {
  createChapter,
  getChapters,
} from "@/services/chapter.services";

export default function CourseEditor() {
  const { courseId } = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (!courseId) return;

    fetchChapters();
  }, [courseId]);

  const fetchChapters = async () => {
    if (!courseId) return;

    try {
      const data = await getChapters(courseId);
      setChapters(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateChapter = async (data: CreateChapter) => {
    if (!courseId) return;

    try {
      setLoading(true);

      const chapter = await createChapter(courseId, data);

      setChapters((prev) => [...prev, chapter]);

      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create chapter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Course Editor</h1>

        <Button onClick={() => setOpen(true)}>
          Add Chapter
        </Button>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Chapters
        </h2>

        <ChapterList chapters={chapters} />
      </div>

      <AddChapterDialog
        open={open}
        loading={loading}
        onOpenChange={setOpen}
        onSubmit={handleCreateChapter}
      />
    </div>
  );
}