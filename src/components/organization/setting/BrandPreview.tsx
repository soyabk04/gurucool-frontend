import {
  BookOpen,
  LayoutDashboard,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BrandPreviewProps {
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
}

export function BrandPreview({
  name,
  logo,
  primaryColor,
  secondaryColor,
}: BrandPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Live Preview
        </CardTitle>

        <CardDescription>
          See how your branding will look.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          className="overflow-hidden rounded-xl border shadow-sm"
          style={{
            borderColor: primaryColor,
          }}
        >
          {/* Sidebar Preview */}

          <div
            className="p-4"
            style={{
              background: `linear-gradient(
                180deg,
                ${primaryColor}15,
                ${secondaryColor}10
              )`,
            }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl"
                style={{
                  background: primaryColor,
                }}
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={name}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <span className="font-bold text-white">
                    {name.charAt(0)}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-semibold">
                  {name}
                </h3>

                <p className="text-xs text-muted-foreground">
                  Organization
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                {
                  icon: LayoutDashboard,
                  label: "Dashboard",
                  active: true,
                },
                {
                  icon: Users,
                  label: "Users",
                },
                {
                  icon: BookOpen,
                  label: "Courses",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-lg px-3 py-2"
                    style={
                      item.active
                        ? {
                            background:
                              `${primaryColor}20`,
                            color:
                              primaryColor,
                          }
                        : undefined
                    }
                  >
                    <Icon className="h-4 w-4" />

                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Preview */}

          <div className="bg-background p-5">
            <h2 className="mb-4 text-xl font-bold">
              Dashboard
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border p-4"
                >
                  <div
                    className="mb-3 h-2 rounded-full"
                    style={{
                      background:
                        primaryColor,
                    }}
                  />

                  <div className="h-2 w-16 rounded bg-muted" />

                  <div className="mt-2 h-2 w-10 rounded bg-muted" />
                </div>
              ))}
            </div>

            <button
              className="mt-6 rounded-lg px-4 py-2 text-sm font-medium text-white transition"
              style={{
                background:
                  primaryColor,
              }}
            >
              Primary Button
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}