import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { CreateCourse } from "@/types/course";

interface CourseFormProps {
  loading?: boolean;
  initialValues?: Partial<CreateCourse>;
  onSubmit: (data: CreateCourse) => Promise<void>;
}

export default function CourseForm({
  loading = false,
  initialValues,
  onSubmit,
}: CourseFormProps) {
  const [form, setForm] = useState<CreateCourse>({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    thumbnail: null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!form.description.trim()) {
      alert("Description is required");
      return;
    }

    if (!form.thumbnail && !initialValues?.thumbnail) {
      alert("Thumbnail is required");
      return;
    }

    await onSubmit(form);
  };

  return (
<div className="mx-auto w-full max-w-5xl px-6 py-8">
  {/* Page Header */}
  <div className="mb-8">
    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
      Create Course
    </h1>

    <p className="mt-1 text-sm text-muted-foreground">
      Add a new course, then add chapters to it.
    </p>
  </div>

  {/* Form */}
  <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
    <CardHeader className="border-b border-border/60 px-6 py-5">
      <CardTitle className="text-lg">
        Course Information
      </CardTitle>

      <p className="text-sm text-muted-foreground">
        Add the basic details of your course.
      </p>
    </CardHeader>

    <CardContent className="p-6">
      <form onSubmit={handleSubmit} className="space-y-7">

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="course-title">
            Course Title
          </Label>

          <Input
            id="course-title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            placeholder="React Complete Course"
            className="h-11"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="course-description">
            Description
          </Label>

          <Textarea
            id="course-description"
            rows={6}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Write a description for your course..."
            className="resize-none"
          />
        </div>

        {/* Thumbnail */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="course-thumbnail">
              Course Thumbnail
            </Label>

            <p className="mt-1 text-xs text-muted-foreground">
              Upload a 16:9 image that represents your course.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-[280px_1fr]">

            {/* Preview */}
            <div className="overflow-hidden rounded-xl border bg-muted/30">
              {preview ? (
                <img
                  src={preview}
                  alt="Course thumbnail preview"
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="3"
                          rx="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      No thumbnail
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Upload */}
            <div className="flex flex-col justify-center gap-3">
              <Input
                id="course-thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;

                  setForm((prev) => ({
                    ...prev,
                    thumbnail: file,
                  }));

                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                className="cursor-pointer"
              />

              <p className="text-xs text-muted-foreground">
                Recommended size: 1280 × 720px
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/60" />

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="min-w-[140px]"
          >
            {loading ? "Creating..." : "Create Course"}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</div>
  );
}