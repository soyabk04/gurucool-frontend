import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export function SidebarHeader() {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="border-b bg-sidebar p-4">
      <div
        className="overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg"
        style={{
          background: `linear-gradient(
            135deg,
            ${theme?.primaryColor}18,
            ${theme?.secondaryColor}12
          )`,
          borderColor: `${theme?.primaryColor}35`,
        }}
      >
        <div className="flex items-center gap-4 p-4">
          {/* Logo */}
          <div
            className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl shadow-md"
            style={{
              backgroundColor: theme?.primaryColor,
            }}
          >
            <img
              src={theme?.logoUrl || "/logo.png"}
              alt={theme?.name}
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
              }}
            />
          </div>

          {/* Organization */}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold">
              {theme?.name ?? "GuruCool"}
            </h2>

            <p className="truncate text-xs text-muted-foreground">
              {theme?.domain}
            </p>

            {user && (
              <Badge
                variant="default"
                className="mt-2 capitalize"
              >
                {user.role}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}