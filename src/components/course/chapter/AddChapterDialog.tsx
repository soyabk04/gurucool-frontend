import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ChapterForm from "./ChapterForm";
import type { CreateChapter } from "@/types/course";

interface AddChapterDialogProps {
  open: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateChapter) => Promise<void>;
}

export default function AddChapterDialog({
  open,
  loading = false,
  onOpenChange,
  onSubmit,
}: AddChapterDialogProps) {
  const handleSubmit = async (data: CreateChapter) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
<Dialog
  open={open}
  onOpenChange={(open) => onOpenChange(open)}
>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Chapter</DialogTitle>
        </DialogHeader>

        <ChapterForm
          loading={loading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}