import { ImagePlus, Palette } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BrandingCardProps {
  logoPreview?: string;

  register: any;

  errors: any;

  onLogoChange: (
    file: File | null
  ) => void;

  loading?: boolean;
}

export function BrandingCard({
  logoPreview,
  register,
  errors,
  onLogoChange,
  loading,
}: BrandingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Branding
        </CardTitle>

        <CardDescription>
          Customize your organization's branding.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Logo */}

        <div className="space-y-3">
          <Label>Organization Logo</Label>

          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border bg-muted">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="h-full w-full object-contain"
                />
              ) : (
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            <Input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={(e) =>
                onLogoChange(
                  e.target.files?.[0] ?? null
                )
              }
            />
          </div>
        </div>

        {/* Colors */}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Primary */}

          <div className="space-y-2">
            <Label>Primary Color</Label>

            <div className="flex items-center gap-3">
              <Input
                type="color"
                className="h-12 w-16 cursor-pointer p-1"
                {...register("primaryColor")}
              />

              <Input
                {...register("primaryColor")}
              />
            </div>

            {errors.primaryColor && (
              <p className="text-sm text-destructive">
                {
                  errors.primaryColor
                    .message
                }
              </p>
            )}
          </div>

          {/* Secondary */}

          <div className="space-y-2">
            <Label>Secondary Color</Label>

            <div className="flex items-center gap-3">
              <Input
                type="color"
                className="h-12 w-16 cursor-pointer p-1"
                {...register("secondaryColor")}
              />

              <Input
                {...register("secondaryColor")}
              />
            </div>

            {errors.secondaryColor && (
              <p className="text-sm text-destructive">
                {
                  errors.secondaryColor
                    .message
                }
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}