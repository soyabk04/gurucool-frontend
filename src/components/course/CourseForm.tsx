import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface CourseFormValues {
  title: string;
  description: string;
  thumbnail: string;
}

interface CourseFormProps {
  initialValues?: CourseFormValues;
  loading?: boolean;
  onSubmit: (data: CourseFormValues) => Promise<void>;
}

export default function CourseForm({
  initialValues,
  loading = false,
  onSubmit,
}: CourseFormProps) {
  const [form, setForm] = useState<CourseFormValues>({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    thumbnail: initialValues?.thumbnail ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.thumbnail.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    await onSubmit(form);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialValues ? "Edit Course" : "Create Course"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="React Complete Course"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              placeholder="Write course description..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/image.png"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : initialValues
              ? "Update Course"
              : "Create Course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}