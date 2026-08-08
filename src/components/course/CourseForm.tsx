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
<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#efe6ff] via-[#ffe7ef] to-[#fff4df] px-4 py-10">
  {/* Background Blobs */}
  <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-300/40 blur-3xl" />

  <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-pink-300/40 blur-3xl" />

  <div className="pointer-events-none absolute bottom-[-150px] left-1/3 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />

  {/* Subtle Grid */}
  <div
    className="pointer-events-none absolute inset-0 opacity-[0.25]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
    }}
  />

  {/* Content */}
  <div className="relative z-10 mx-auto max-w-3xl">
    {/* Header */}
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 shadow-lg backdrop-blur-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-7 w-7 text-purple-600"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Create Course
      </h1>

      <p className="mt-2 text-sm text-gray-600">
        Create a new course and start adding your content.
      </p>
    </div>

    {/* Glass Card */}
    <Card className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl">
      <CardHeader className="border-b border-white/40 px-6 py-6 sm:px-8">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Course Information
        </CardTitle>

        <p className="text-sm text-gray-500">
          Add the basic details of your course.
        </p>
      </CardHeader>

      <CardContent className="px-6 py-8 sm:px-8">
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="course-title"
              className="text-sm font-medium text-gray-700"
            >
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
              className="h-12 rounded-xl border-white/60 bg-white/70 shadow-sm transition-all placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-400/30"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="course-description"
              className="text-sm font-medium text-gray-700"
            >
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
              className="resize-none rounded-xl border-white/60 bg-white/70 shadow-sm transition-all placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-400/30"
            />
          </div>

          {/* Thumbnail */}
          <div className="space-y-3">
            <div>
              <Label
                htmlFor="course-thumbnail"
                className="text-sm font-medium text-gray-700"
              >
                Course Thumbnail
              </Label>

              <p className="mt-1 text-xs text-gray-500">
                Upload a 16:9 image for your course.
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-gray-300/80 bg-white/40 p-4 transition hover:bg-white/60">
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
                className="cursor-pointer border-0 bg-transparent shadow-none"
              />
            </div>

            {preview && (
              <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/50 shadow-lg">
                <img
                  src={preview}
                  alt="Course thumbnail preview"
                  className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/20 transition-all hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/30"
            >
              {loading ? "Creating Course..." : "Create Course"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    {/* Bottom hint */}
    <p className="mt-6 text-center text-xs text-gray-500">
      You can add chapters, videos, and other course content after creating
      the course.
    </p>
  </div>
</div>
  );
}