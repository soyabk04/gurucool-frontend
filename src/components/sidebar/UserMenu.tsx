// import {
//   ChevronUp,
// } from "lucide-react";

// import {
//   Avatar,
//   AvatarFallback,
// } from "@/components/ui/avatar";

// import { Button } from "@/components/ui/button";

import {
  // DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
  // DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { useAuth } from "@/context/AuthContext";
// import { useTheme } from "@/context/ThemeContext";

export function UserMenu() {
  const { user} = useAuth();
  // const { theme } = useTheme();

  if (!user) return null;

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
<DropdownMenuContent align="end" className="w-72">
  <div className="p-2">
    <p>{user.name}</p>
    <p>{user.role}</p>
  </div>

  <DropdownMenuSeparator />

  <DropdownMenuItem>
    Profile
  </DropdownMenuItem>

  <DropdownMenuItem>
    Settings
  </DropdownMenuItem>

  <DropdownMenuSeparator />

  <DropdownMenuItem>
    Logout
  </DropdownMenuItem>
</DropdownMenuContent>
  )
}