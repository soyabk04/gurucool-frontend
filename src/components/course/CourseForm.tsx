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
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create Course</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Title */}

          <div className="space-y-2">
            <Label>Course Title</Label>

            <Input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="React Complete Course"
            />
          </div>

          {/* Description */}

          <div className="space-y-2">
            <Label>Description</Label>

            <Textarea
              rows={5}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Write course description..."
            />
          </div>

          {/* Thumbnail */}

          <div className="space-y-2">
            <Label>Thumbnail</Label>

            <Input
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
              <img
                src={preview}
                alt="Thumbnail Preview"
                className="h-40 rounded-md border object-cover"
              />
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}