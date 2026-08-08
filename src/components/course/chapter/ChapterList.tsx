import {
  BookOpen,
  ChevronRight,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Video,
  FileText,
} from "lucide-react";
import type { Chapter } from "@/types/course";

interface ChapterListProps {
  chapters: Chapter[];
}

export default function ChapterList({
  chapters,
}: ChapterListProps) {
  if (chapters.length === 0) {
    return (
      <p className="text-muted-foreground">
        No chapters yet.
      </p>
    );
  }

  return (
<div className="space-y-2">
  {chapters.length > 0 ? (
    chapters.map((chapter, index) => (
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
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-lg
            bg-primary/10
            text-sm font-semibold text-primary
          "
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className="
                truncate text-sm font-medium
                text-foreground
              "
            >
              {chapter.title}
            </h3>
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            {/* Type */}
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

            {/* Divider */}

            
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
          <button
            type="button"
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

          <button
            type="button"
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg
              text-muted-foreground
              transition
              hover:bg-muted
              hover:text-foreground
            "
            title="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

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
    ))
  ) : (
    /* Empty State */
    <div
      className="
        flex flex-col items-center justify-center
        rounded-xl border border-dashed
        border-border/70
        bg-muted/10
        px-6 py-14
        text-center
      "
    >
      <div
        className="
          mb-4 flex h-12 w-12
          items-center justify-center
          rounded-xl
          bg-muted
        "
      >
        <BookOpen className="h-5 w-5 text-muted-foreground" />
      </div>

      <h3 className="text-sm font-semibold">
        No chapters yet
      </h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Add your first chapter to start building your course.
      </p>
    </div>
  )}
</div>
  );
}