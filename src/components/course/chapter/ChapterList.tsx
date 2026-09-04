
import {
  ChevronRight,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Video,
  FileText,
  Trash2,
} from "lucide-react";

import type { Chapter } from "@/types/course";
import { deleteChapter } from "@/services/chapter.services";
import { toast } from "sonner";

interface ChapterListProps {
  chapters: Chapter[];
  onEdit: (chapterId: string) => void;
  onDelete?: (chapterId: string) => void;
}

export default function ChapterList({
  chapters,
  onEdit,
  onDelete,
}: ChapterListProps) {
  const handleDelete = async (chapterId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this chapter?\n\nThis will also delete its quiz and questions. This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteChapter(chapterId);

      toast.success("Chapter deleted successfully");

      onDelete?.(chapterId);
    } catch (error) {
      console.error("Delete chapter error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete chapter"
      );
    }
  };

  if (chapters.length === 0) {
    return (
      <p className="text-muted-foreground">
        No chapters yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {chapters.map((chapter, index) => (
        <div
          key={chapter._id}
          className="
            group relative flex items-center gap-4
            rounded-xl border border-border/60
            bg-card px-4 py-3
            transition-all duration-200
            hover:border-border
            hover:bg-muted/30
            hover:shadow-sm
          "
        >
          {/* Drag Handle */}

          <button
            type="button"
            className="
              flex h-8 w-6 shrink-0
              cursor-grab items-center justify-center
              rounded-md text-muted-foreground/40
              opacity-0 transition
              hover:bg-muted hover:text-muted-foreground
              group-hover:opacity-100
            "
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Chapter Number */}

          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-lg
              bg-primary/10
              text-sm font-semibold text-primary
            "
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Content */}

          <div className="min-w-0 flex-1">
            <h3
              className="
                truncate text-sm font-medium
                text-foreground
              "
            >
              {chapter.title}
            </h3>

            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                {chapter.videoUrl ? (
                  <>
                    <Video className="h-3.5 w-3.5" />
                    Video
                  </>
                ) : (
                  <>
                    <FileText className="h-3.5 w-3.5" />
                    PDF
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Status */}

          <div className="hidden items-center gap-2 sm:flex">
            <span
              className="
                inline-flex items-center gap-1.5
                rounded-full
                border border-emerald-500/20
                bg-emerald-500/10
                px-2.5 py-1
                text-xs font-medium
                text-emerald-600
                dark:text-emerald-400
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Published
            </span>
          </div>

          {/* Actions */}

          <div className="flex items-center gap-1">
            {/* Edit */}

            <button
              type="button"
              onClick={() => onEdit(chapter._id)}
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg
                text-muted-foreground
                opacity-0
                transition
                hover:bg-muted
                hover:text-foreground
                group-hover:opacity-100
              "
              title="Edit chapter"
            >
              <Pencil className="h-4 w-4" />
            </button>

            {/* More / Delete */}

            <details className="relative">
              <summary
                className="
                  flex h-8 w-8
                  cursor-pointer
                  list-none
                  items-center justify-center
                  rounded-lg
                  text-muted-foreground
                  transition
                  hover:bg-muted
                  hover:text-foreground
                  [&::-webkit-details-marker]:hidden
                "
                title="More options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </summary>

              <div
                className="
                  absolute right-0 top-10 z-50
                  w-44
                  overflow-hidden
                  rounded-lg
                  border border-border
                  bg-popover
                  p-1
                  shadow-lg
                "
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.currentTarget
                      .closest("details")
                      ?.removeAttribute("open");

                    handleDelete(chapter._id);
                  }}
                  className="
                    flex w-full items-center gap-2
                    rounded-md px-3 py-2
                    text-sm
                    text-destructive
                    transition
                    hover:bg-destructive/10
                  "
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Chapter
                </button>
              </div>
            </details>

            <ChevronRight
              className="
                ml-1 h-4 w-4
                text-muted-foreground/50
                transition-transform
                group-hover:translate-x-0.5
              "
            />
          </div>
        </div>
      ))}
    </div>
  );
}
