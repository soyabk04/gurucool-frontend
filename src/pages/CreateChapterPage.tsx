import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import ChapterForm from "@/components/course/chapter/ChapterForm";

import type { CreateChapter } from "@/types/course";

import { createChapter } from "@/services/chapter.services";

export default function CreateChapterPage() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  /**
   * Create chapter
   */
  const handleSubmit = async (data: CreateChapter): Promise<void> => {
    if (!courseId) {
      alert("Course ID is missing");
      return;
    }

    try {
      setLoading(true);
      setUploading(true);
      setProgress(0);

      console.log("Creating chapter...");
      console.log("Course ID:", courseId);
      console.log("Chapter data:", data);

      await createChapter(
        courseId,
        data,
        (percent: number) => {
          setProgress(percent);
        }
      );

      // Upload completed
      setProgress(100);

      // Give the user a short moment to see completion
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 700);
      });

      setUploading(false);

      // Redirect to course page
      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error("Failed to create chapter:", error);

      setUploading(false);
      setProgress(0);

      alert("Failed to create chapter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel chapter creation
   */
  const handleCancel = () => {
    if (loading) {
      return;
    }

    if (courseId) {
      navigate(`/courses/${courseId}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <Button
            type="button"
            variant="ghost"
            className="mb-4 -ml-2"
            onClick={handleCancel}
            disabled={loading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create Chapter
            </h1>

            <p className="mt-1 text-muted-foreground">
              Add video or PDF content and optionally attach a
              quiz to this chapter.
            </p>
          </div>
        </div>

        {/* ================= UPLOAD PROGRESS ================= */}
        {uploading && (
          <div className="sticky top-4 z-50 mb-6">
            <Card className="border-primary shadow-lg">
              <CardContent className="space-y-4 p-5">

                {/* Progress Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      Uploading Chapter
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Please don't close this page while the
                      upload is in progress.
                    </p>
                  </div>

                  <span className="text-lg font-bold">
                    {progress}%
                  </span>
                </div>

                {/* Progress Bar */}
                <Progress
                  value={progress}
                  className="h-3"
                />

                {/* Progress Status */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {progress < 100
                      ? "Uploading chapter..."
                      : "Finalizing upload..."}
                  </span>

                  <span>
                    {progress}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= CHAPTER FORM ================= */}
        <Card>
          <CardContent className="p-6">
            <ChapterForm
              loading={loading}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}