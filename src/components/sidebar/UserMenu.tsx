import {
  ChevronUp,
} from "lucide-react";

// import {
//   Avatar,
//   AvatarFallback,
// } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


// import { useAuth } from "@/context/AuthContext";
// import { useTheme } from "@/context/ThemeContext";

export function UserMenu() {
  // const { user, logout } = useAuth();
  // const { theme } = useTheme();

  // if (!user) return null;

  // const initials = (user as { name: string }).name
  //   .split(" ")
  //   .map((part) => part[0])
  //   .join("")
  //   .toUpperCase();

  // async function handleLogout() {
  //   await logout();
  //   window.location.href = "/login";
  // }

  return (
<DropdownMenu>
  <DropdownMenuTrigger
    render={
      <Button
        variant="ghost"
        className="h-auto w-full justify-between rounded-xl p-3"
      >
        User Menu
        <ChevronUp className="h-4 w-4" />
      </Button>
    }
  />

  <DropdownMenuContent align="end" className="w-72">
    <div className="p-2">
      Test
    </div>
  </DropdownMenuContent>
</DropdownMenu>
  )
}