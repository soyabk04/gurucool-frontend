import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronRight,
  Loader2,
} from "lucide-react";
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
<div className="mx-auto w-full max-w-5xl space-y-6 p-6">
  {/* Page Header */}
  <div className="flex items-end justify-between gap-4">
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <BookOpen className="h-4 w-4" />
        <span>Course</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>Content</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">
        Course Content
      </h1>

      <p className="mt-1 text-sm text-muted-foreground">
        Browse the chapters and continue learning.
      </p>
    </div>

    {!loading && !error && chapters.length > 0 && (
      <div className="shrink-0 rounded-lg border bg-muted/40 px-3 py-2 text-sm">
        <span className="font-medium">{chapters.length}</span>{" "}
        <span className="text-muted-foreground">
          {chapters.length === 1 ? "chapter" : "chapters"}
        </span>
      </div>
    )}
  </div>

  {/* Loading */}
  {loading ? (
    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border bg-card">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />

        <p className="text-sm text-muted-foreground">
          Loading course content...
        </p>
      </div>
    </div>
  ) : error ? (
    /* Error */
    <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
          <span className="text-sm font-semibold text-destructive">
            !
          </span>
        </div>

        <h3 className="text-sm font-semibold">
          Unable to load chapters
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {error}
        </p>
      </div>
    </div>
  ) : chapters.length === 0 ? (
    /* Empty */
    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed bg-card">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </div>

        <h3 className="text-sm font-semibold">
          No chapters yet
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          This course doesn't have any chapters yet.
        </p>
      </div>
    </div>
  ) : (
    /* Chapter List */
    <div className="overflow-hidden rounded-2xl border bg-card">
      {/* List Header */}
      <div className="flex items-center justify-between border-b bg-muted/20 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">
            Chapters
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Select a chapter to continue
          </p>
        </div>
      </div>

      <div className="divide-y">
        {chapters.map((chapter, index) => {
          const isVideo = chapter.type === "video";

          return (
            <div
              key={chapter._id}
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate(
                  `/courses/${courseId}/chapter/${chapter._id}`
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(
                    `/courses/${courseId}/chapter/${chapter._id}`
                  );
                }
              }}
              className="
                group flex cursor-pointer items-center gap-4
                px-5 py-4
                transition-colors
                hover:bg-muted/40
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
                focus-visible:ring-inset
              "
            >
              {/* Number */}
              <div
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl
                  bg-muted
                  text-sm font-semibold
                  text-muted-foreground
                  transition-colors
                  group-hover:bg-primary/10
                  group-hover:text-primary
                "
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Type Icon */}
              <div
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl border bg-background
                  text-muted-foreground
                "
              >
                {isVideo ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3
                    className="
                      truncate text-sm font-medium
                      text-foreground
                      transition-colors
                      group-hover:text-primary
                    "
                  >
                    {chapter.title}
                  </h3>

                  <span
                    className="
                      hidden shrink-0 rounded-full
                      border bg-muted/50
                      px-2 py-0.5
                      text-[11px] font-medium
                      text-muted-foreground
                      sm:inline-flex
                    "
                  >
                    {isVideo ? "Video" : "Document"}
                  </span>
                </div>

                {chapter.description && (
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {chapter.description}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <ChevronRight
                className="
                  h-4 w-4 shrink-0
                  text-muted-foreground/40
                  transition-all
                  group-hover:translate-x-0.5
                  group-hover:text-foreground
                "
              />
            </div>
          );
        })}
      </div>
    </div>
  )}
</div>
  );
}
