import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CreateChapter, ChapterType } from "@/types/course";

interface ChapterFormProps {
  loading?: boolean;
  initialValues?: Partial<CreateChapter>;
  onSubmit: (data: CreateChapter) => Promise<void>;
}

export default function ChapterForm({
  loading = false,
  initialValues,
  onSubmit,
}: ChapterFormProps) {
  const [form, setForm] = useState<CreateChapter>({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    type: initialValues?.type ?? "video",
    file: null,
  });

  const [fileName, setFileName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Chapter title is required");
      return;
    }

    if (!form.file) {
      alert("Please select a file");
      return;
    }

    await onSubmit(form);

    setForm({
      title: "",
      description: "",
      type: "video",
      file: null,
    });

    setFileName("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}

      <div className="space-y-2">
        <Label htmlFor="title">Chapter Title</Label>

        <Input
          id="title"
          placeholder="Introduction"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />
      </div>

      {/* Description */}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <Textarea
          id="description"
          rows={4}
          placeholder="Chapter description..."
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </div>

      {/* Content Type */}

      <div className="space-y-2">
        <Label>Content Type</Label>

        <Select
          value={form.type}
onValueChange={(value) => {
  if (!value) return;

  setForm((prev) => ({
    ...prev,
    type: value as ChapterType,
    file: null,
  }));
}}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* File */}

      <div className="space-y-2">
        <Label>
          {form.type === "video"
            ? "Upload Video"
            : "Upload PDF"}
        </Label>

        <Input
          type="file"
          accept={
            form.type === "video"
              ? "video/*"
              : ".pdf"
          }
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;

            setForm((prev) => ({
              ...prev,
              file,
            }));

            setFileName(file?.name ?? "");
          }}
        />

        {fileName && (
          <p className="text-sm text-muted-foreground">
            Selected: {fileName}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Chapter"}
      </Button>
    </form>
  );
}