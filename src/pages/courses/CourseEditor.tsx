import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import ChapterList from "@/components/course/chapter/ChapterList";

import type { Chapter } from "@/types/course";

import {
  getChapters,
} from "@/services/chapter.services";

export default function CourseEditor() {
  const { courseId } = useParams<{
    courseId: string;
  }>();

  const navigate = useNavigate();

  const [chapters, setChapters] =
    useState<Chapter[]>([]);

  useEffect(() => {
    if (courseId) {
      fetchChapters();
    }
  }, [courseId]);

  const fetchChapters = async () => {
    if (!courseId) return;

    try {
      const data =
        await getChapters(courseId);
        console.log("Fetched chapters:", data);
      setChapters(data);
    } catch (error) {
      console.error(
        "Failed to fetch chapters:",
        error
      );
    }
  };

  const handleAddChapter = () => {
    if (!courseId) return;

    navigate(
      `/courses/${courseId}/chapters/create`
    );
  };

  const handleEditChapter = (
    chapterId: string
  ) => {
    if (!courseId) return;

    navigate(
      `/courses/${courseId}/chapters/${chapterId}/edit`
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Course Editor
          </h1>

          <p className="text-muted-foreground">
            Manage chapters and upload new content.
          </p>
        </div>

        <Button
          onClick={handleAddChapter}
        >
          Add Chapter
        </Button>

      </div>

      {/* Chapter List */}

      <Card>
        <CardContent className="p-6">

          <h2 className="mb-6 text-xl font-semibold">
            Chapters
          </h2>

          <ChapterList
            chapters={chapters}
            onEdit={handleEditChapter}
          />

        </CardContent>
      </Card>

    </div>
  );
}