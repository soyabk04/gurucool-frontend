import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function SidebarSearch({
  value,
  onChange,
}: SidebarSearchProps) {
  return (
    <div className="border-b px-4 py-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search menu..."
          className="
            h-10
            rounded-xl
            border-muted
            bg-muted/40
            pl-10
            transition-all
            duration-200
            focus-visible:bg-background
            focus-visible:ring-2
          "
        />

        <kbd
          className="
            absolute
            right-3
            top-1/2
            hidden
            -translate-y-1/2
            rounded-md
            border
            bg-background
            px-1.5
            py-0.5
            text-[10px]
            text-muted-foreground
            md:inline-flex
          "
        >
          ⌘K
        </kbd>
      </div>
    </div>
  );
}