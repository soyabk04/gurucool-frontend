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
    certTemplate: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [certificateName, setCertificateName] = useState<string | null>(
    null
  );

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

    if (!form.certTemplate && !initialValues?.certTemplate) {
      alert("Certificate template is required");
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
                            <circle
                              cx="8.5"
                              cy="8.5"
                              r="1.5"
                            />
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
                      const file =
                        e.target.files?.[0] ?? null;

                      setForm((prev) => ({
                        ...prev,
                        thumbnail: file,
                      }));

                      if (file) {
                        setPreview(
                          URL.createObjectURL(file)
                        );
                      } else {
                        setPreview(null);
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

            {/* Certificate Template */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="certificate-template">
                  Certificate Template
                </Label>

                <p className="mt-1 text-xs text-muted-foreground">
                  Upload the PDF template that will be used to generate
                  certificates for students.
                </p>
              </div>

              <div className="rounded-xl border border-dashed bg-muted/20 p-6">
                <div className="flex flex-col items-center justify-center gap-4 text-center">

                  {/* PDF Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <path d="M8 13h2" />
                      <path d="M8 17h2" />
                      <path d="M14 13h2" />
                      <path d="M14 17h2" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {certificateName
                        ? certificateName
                        : "No certificate template selected"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      PDF files only
                    </p>
                  </div>

                  <Input
                    id="certificate-template"
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => {
                      const file =
                        e.target.files?.[0] ?? null;

                      if (file) {
                        if (
                          file.type !==
                            "application/pdf" &&
                          !file.name
                            .toLowerCase()
                            .endsWith(".pdf")
                        ) {
                          alert(
                            "Please select a PDF certificate template."
                          );

                          e.target.value = "";

                          return;
                        }

                        setForm((prev) => ({
                          ...prev,
                          certTemplate: file,
                        }));

                        setCertificateName(
                          file.name
                        );
                      } else {
                        setForm((prev) => ({
                          ...prev,
                          certTemplate: null,
                        }));

                        setCertificateName(null);
                      }
                    }}
                    className="w-full max-w-md cursor-pointer"
                  />

                  <p className="text-xs text-muted-foreground">
                    Select your certificate PDF template
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
                onClick={() =>
                  window.history.back()
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="min-w-[140px]"
              >
                {loading
                  ? "Creating..."
                  : "Create Course"}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
