import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { getChapters } from "@/services/chapter.services";
import type { Chapter } from "@/types/course";

// Read-only chapter view for learners (coordinator/user roles). Course
// creation/editing lives in CourseEditor — this page intentionally has no
// edit/delete controls.
export default function CourseDetails() {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!courseId) return;

    const fetchChapters = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getChapters(courseId);
        setChapters(data);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [courseId]);
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Course Content</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : chapters.length === 0 ? (
        <p className="text-muted-foreground">No chapters yet.</p>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <Card
              key={chapter._id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() =>
                navigate(`/courses/${courseId}/chapter/${chapter._id}`)
              }
            >
              <CardContent className="flex items-center gap-3 p-4">
                {chapter.type === "video" ? (
                  <Video className="h-5 w-5 shrink-0" />
                ) : (
                  <FileText className="h-5 w-5 shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold">{chapter.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {chapter.description}
                  </p>
                  {chapter.fileUrl && (
                    <a
                      href={chapter.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm text-primary underline underline-offset-4"
                    >
                      Open {chapter.type === "video" ? "video" : "document"}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
