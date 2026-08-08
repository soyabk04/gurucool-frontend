import {
  LogOut,
  Settings,
  UserCircle2,
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function UserMenu() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  if (!user) {
    return null;
  }

  const initials = (user as {name:string}).name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  async function handleLogout() {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <DropdownMenu>
      {/* User button */}
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-auto w-full justify-between rounded-xl p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar
                className="h-10 w-10 shrink-0 border"
                style={{
                  borderColor:
                    theme?.primaryColor ?? "hsl(var(--border))",
                }}
              >
                <AvatarFallback
                  style={{
                    backgroundColor:
                      theme?.primaryColor ?? "#2563eb",
                    color: "#ffffff",
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold">
                  {user.name}
                </p>

                <p className="truncate text-xs capitalize text-muted-foreground">
                  {user.role}
                </p>
              </div>
            </div>

            <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        }
      />

      {/* Dropdown */}
      <DropdownMenuContent
        align="end"
        side="top"
        sideOffset={8}
        className="w-72"
      >
        {/* User information */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="space-y-2">
              <div>
                <p className="font-semibold">
                  {user.name}
                </p>

                <p className="text-xs capitalize text-muted-foreground">
                  {user.role}
                </p>
              </div>

              <Badge
                variant="secondary"
                className="capitalize"
              >
                {user.role}
              </Badge>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Profile */}
        <DropdownMenuItem>
          <UserCircle2 className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}