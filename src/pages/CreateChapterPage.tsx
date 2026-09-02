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

  const handleSubmit = async (data: CreateChapter) => {
    if (!courseId) {
      alert("Course ID is missing");
      return;
    }

    try {
      setLoading(true);
      setUploading(true);
      setProgress(0);

      await createChapter(courseId, data, (percent) => {
        setProgress(percent);
      });

      setProgress(100);

      // Give the user a moment to see "Finalizing upload..."
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      setUploading(false);

      // Go back to the course after successful creation
      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error("Failed to create chapter:", error);

      setUploading(false);

      alert("Failed to create chapter");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (courseId) {
      navigate(`/courses/${courseId}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Upload Progress */}
        {uploading && (
          <div className="sticky top-4 z-50 mb-6">
            <Card className="border-primary shadow-lg">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between">
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

        {/* Chapter Form */}
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