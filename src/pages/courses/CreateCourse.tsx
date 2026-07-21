import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseForm from "@/components/course/CourseForm";
import { createCourse } from "@/services/course.service";
import type { CreateCourse } from "@/types/course";
import { Card,CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CreateCoursePage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
uploading
  const handleCreate = async (data: CreateCourse) => {
    try {
      setLoading(true);

      const course = await createCourse(data,(percent) => {
  setUploading(true);
  setProgress(percent);
});
setUploading(false);
      navigate(`/courses/${course._id}/edit`);
    } catch (error) {
      console.error(error);
      alert("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

return (
  <>
    {uploading && (
      <Card className="mb-4">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Uploading Course</h3>
              <p className="text-sm text-muted-foreground">
                Please don't close this page.
              </p>
            </div>

            <span className="font-semibold">{progress}%</span>
          </div>

          <Progress value={progress} />

          <p className="text-xs text-muted-foreground">
            {progress === 100
              ? "Finalizing upload..."
              : `Uploaded ${progress}%`}
          </p>
        </CardContent>
      </Card>
    )}

    {!uploading && (<div className="container mx-auto space-y-6 py-2">
      <div>
        <h1 className="text-3xl font-bold">Create Course</h1>
        <p className="text-muted-foreground">
          Add a new course, then add chapters to it.
        </p>
      </div>

      <CourseForm loading={loading} onSubmit={handleCreate} />
    </div>)}
  </>
);
}
