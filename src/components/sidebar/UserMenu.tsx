import {
  ChevronUp,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function UserMenu() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  if (!user) return null;

  const initials = (user as { name: string }).name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  async function handleLogout() {
    await logout();
    window.location.href = "/login";
  }

  return (
<DropdownMenu>
  <DropdownMenuTrigger
    render={
      <Button
        variant="ghost"
        className="h-auto w-full justify-between rounded-xl p-3"
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback
              style={{
                backgroundColor: theme?.primaryColor,
                color: "white",
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-semibold">
              {user.name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {user.role}
            </p>
          </div>
        </div>

        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      </Button>
    }
  />

  <DropdownMenuContent align="end" className="w-72">
    <DropdownMenuLabel>
      <div className="space-y-1">
        <p className="font-semibold">{user.name}</p>

        <p className="text-xs text-muted-foreground">
          {user.role}
        </p>
      </div>
    </DropdownMenuLabel>

    <DropdownMenuSeparator />

    <DropdownMenuItem>
      Profile
    </DropdownMenuItem>

    <DropdownMenuItem>
      Settings
    </DropdownMenuItem>

    <DropdownMenuSeparator />

    <DropdownMenuItem onClick={handleLogout}>
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
  )
}