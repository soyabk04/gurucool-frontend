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
<Card className="mx-auto w-full max-w-3xl">
  <CardHeader>
    <CardTitle className="text-xl">Create Course</CardTitle>
    <p className="text-sm text-muted-foreground">
      Add the basic information for your new course.
    </p>
  </CardHeader>

  <CardContent>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course Title */}
      <div className="space-y-2">
        <Label htmlFor="course-title">Course Title</Label>

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
        <Label htmlFor="course-description">Description</Label>

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
          <Label htmlFor="course-thumbnail">Course Thumbnail</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload an image that represents your course.
          </p>
        </div>

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
        />

        {preview && (
          <div className="overflow-hidden rounded-lg border bg-muted">
            <img
              src={preview}
              alt="Course thumbnail preview"
              className="aspect-video w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="h-11 w-full"
        disabled={loading}
      >
        {loading ? "Creating Course..." : "Create Course"}
      </Button>
    </form>
  </CardContent>
</Card>
  );
}