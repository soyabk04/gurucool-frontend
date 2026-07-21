import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (courseId) {
      fetchChapters();
    }
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
      setUploading(true);
      setProgress(0);

      const chapter = await createChapter(
        courseId,
        data,
        (percent) => {
          setProgress(percent);
        }
      );

      setProgress(100);

      // Let the user briefly see "Finalizing..."
      await new Promise((resolve) => setTimeout(resolve, 700));

      setChapters((prev) => [...prev, chapter]);
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create chapter");
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Editor</h1>
          <p className="text-muted-foreground">
            Manage chapters and upload new content.
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>
          Add Chapter
        </Button>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="sticky top-4 z-50">
          <Card className="border-primary shadow-lg">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">
                    Uploading Chapter
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Please don't close this page while the upload is in progress.
                  </p>
                </div>

                <span className="text-lg font-bold">
                  {progress}%
                </span>
              </div>

              <Progress
                value={progress}
                className="h-3"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {progress < 100
                    ? "Uploading video..."
                    : "Finalizing upload..."}
                </span>

                <span>{progress}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chapter List */}
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-6 text-xl font-semibold">
            Chapters
          </h2>

          <ChapterList chapters={chapters} />
        </CardContent>
      </Card>

      {/* Add Chapter Dialog */}
      <AddChapterDialog
        open={open}
        loading={loading}
        onOpenChange={setOpen}
        onSubmit={handleCreateChapter}
      />
    </div>
  );
}