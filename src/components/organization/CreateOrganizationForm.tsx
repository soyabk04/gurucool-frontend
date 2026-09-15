import { useEffect, useState } from "react";
import {
  Building2,
  Globe,
  Image as ImageIcon,
  Palette,
  UserRound,
  Info,
  Copy,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import { createOrg } from "@/services/organization.service";
import { toast } from "sonner";

export default function CreateOrganization() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    name: "",
    domain: "",
    primaryColor: "#2563eb",
    secondaryColor: "#ffffff",
    firstName: "",
    email: "",
    id: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const SERVER_IP = import.meta.env.VITE_SERVER_IP;

  useEffect(() => {
    if (!logo) {
      setLogoPreview(null);
      return;
    }

    const url = URL.createObjectURL(logo);
    setLogoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [logo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLogo(file);
  };

  const copyServerIp = async () => {
    if (!SERVER_IP) return;

    await navigator.clipboard.writeText(SERVER_IP);

    setCopied(true);
    toast.success("Server IP copied");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Organization name is required");
      return;
    }

    if (!form.domain.trim()) {
      toast.error("Domain is required");
      return;
    }

    if (!form.firstName.trim()) {
      toast.error("Admin name is required");
      return;
    }

    if (!form.id.trim()) {
      toast.error("Admin ID is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Admin email is required");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      const normalizedDomain = form.domain
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");

      const response = await createOrg(
        {
          name: form.name.trim(),
          domain: normalizedDomain,
          primaryColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
          users: [
            {
              name: form.firstName.trim(),
              ID: form.id.trim(),
              email: form.email.trim(),
              role: "admin",
            },
          ],
        },
        logo ?? undefined,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      if (response.success) {
        toast.success(
          response.message ||
            "Organization created successfully"
        );

        setUploadProgress(100);

        setForm({
          name: "",
          domain: "",
          primaryColor: "#2563eb",
          secondaryColor: "#ffffff",
          firstName: "",
          email: "",
          id: "",
        });

        setLogo(null);
      } else {
        toast.error(
          response.message ||
            "Failed to create organization"
        );
      }
    } catch (error: any) {
      console.error(
        "Failed to create organization:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to create organization"
      );
    } finally {
      setLoading(false);

      setTimeout(() => {
        setUploadProgress(0);
      }, 500);
    }
  };

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Create Organization
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Set up a new organization and its administrator.
              </p>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* ORGANIZATION INFORMATION */}
        {/* ================================================= */}

        <Card className="mb-6 overflow-hidden">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-4 w-4 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Organization Information
                </h2>

                <p className="text-sm text-muted-foreground">
                  Basic details for the organization.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">

              {/* Organization Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Organization Name
                </Label>

                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Acme Corporation"
                  disabled={loading}
                />
              </div>

              {/* Domain */}
              <div className="space-y-2">
                <Label htmlFor="domain">
                  Domain
                </Label>

                <Input
                  id="domain"
                  name="domain"
                  value={form.domain}
                  onChange={handleChange}
                  placeholder="acme.com"
                  disabled={loading}
                />

                <p className="text-xs text-muted-foreground">
                  Enter the domain without https://
                </p>

                {/* DNS NOTICE */}
                {form.domain.trim() && (
                  <div className="mt-3 rounded-lg border bg-muted/30 p-3.5">
                    <div className="flex gap-3">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          DNS configuration
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          Add an A record at your domain
                          provider pointing to this server.
                        </p>

                        <div className="mt-3 grid grid-cols-[55px_1fr] gap-x-4 gap-y-2 text-xs">
                          <span className="text-muted-foreground">
                            Type
                          </span>
                          <code>A</code>

                          <span className="text-muted-foreground">
                            Name
                          </span>
                          <code>@</code>

                          <span className="text-muted-foreground">
                            Value
                          </span>

                          <div className="flex items-center gap-2">
                            <code>
                              {SERVER_IP ||
                                "Server IP not configured"}
                            </code>

                            {SERVER_IP && (
                              <button
                                type="button"
                                onClick={copyServerIp}
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                              >
                                {copied ? (
                                  <>
                                    <Check className="h-3 w-3" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    Copy
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================================================= */}
        {/* BRANDING */}
        {/* ================================================= */}

        <Card className="mb-6 overflow-hidden">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Palette className="h-4 w-4 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Branding
                </h2>

                <p className="text-sm text-muted-foreground">
                  Customize the organization's appearance.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-8 md:grid-cols-2">

              {/* Logo */}
              <div className="space-y-3">
                <Label>
                  Organization Logo
                </Label>

                <div className="flex items-center gap-5">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Organization logo"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="h-7 w-7 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      disabled={loading}
                    />

                    <p className="mt-2 text-xs text-muted-foreground">
                      PNG, JPG or SVG recommended.
                    </p>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">
                    Primary Color
                  </Label>

                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      name="primaryColor"
                      value={form.primaryColor}
                      onChange={handleChange}
                      disabled={loading}
                      className="h-10 w-14 cursor-pointer p-1"
                    />

                    <Input
                      name="primaryColor"
                      value={form.primaryColor}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">
                    Secondary Color
                  </Label>

                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      name="secondaryColor"
                      value={form.secondaryColor}
                      onChange={handleChange}
                      disabled={loading}
                      className="h-10 w-14 cursor-pointer p-1"
                    />

                    <Input
                      name="secondaryColor"
                      value={form.secondaryColor}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================================================= */}
        {/* ADMIN */}
        {/* ================================================= */}

        <Card className="mb-6 overflow-hidden">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <UserRound className="h-4 w-4 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Organization Administrator
                </h2>

                <p className="text-sm text-muted-foreground">
                  Assign the first administrator for this
                  organization.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">

              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name
                </Label>

                <Input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  disabled={loading}
                />
              </div>

              {/* ID */}
              <div className="space-y-2">
                <Label htmlFor="id">
                  Admin ID
                </Label>

                <Input
                  id="id"
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  placeholder="ADM001"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">
                  Email Address
                </Label>

                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@acme.com"
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================================================= */}
        {/* ACTION BAR */}
        {/* ================================================= */}

        <div className="flex items-center justify-end gap-3 border-t pt-6">
          <Button
            variant="outline"
            type="button"
            disabled={loading}
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="min-w-[180px]"
          >
            {loading
              ? uploadProgress < 100
                ? `Uploading ${uploadProgress}%`
                : "Creating..."
              : "Create Organization"}
          </Button>
        </div>
      </div>
    </div>
  );
}