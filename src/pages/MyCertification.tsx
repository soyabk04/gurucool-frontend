import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Award,
  Calendar,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getMyCertificates } from "@/services/course.service";
import type { MyCertificate } from "@/types/course";

export default function MyCertification() {
  const [certificates, setCertificates] = useState<
    MyCertificate[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  // -----------------------------------------
  // Fetch certificates
  // -----------------------------------------

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);

        const data =
          await getMyCertificates();

        console.log(
          "Fetched certificates:",
          data
        );

        setCertificates(data);
      } catch (error) {
        console.error(error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load certifications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // -----------------------------------------
  // View certificate
  // -----------------------------------------

  const handleView = (
    certificate: MyCertificate
  ) => {
    if (!certificate.certificateLink) {
      toast.error(
        "Certificate link is not available."
      );
      return;
    }

    window.open(
      certificate.certificateLink,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // -----------------------------------------
  // Download certificate
  // -----------------------------------------

  const handleDownload = async (
    certificate: MyCertificate
  ) => {
    if (!certificate.certificateLink) {
      toast.error(
        "Certificate link is not available."
      );
      return;
    }

    try {
      const response = await fetch(
        certificate.certificateLink
      );

      if (!response.ok) {
        throw new Error(
          "Failed to download certificate"
        );
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${certificate.courseTitle || "certificate"}-certificate.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Certificate download failed:",
        error
      );

      toast.error(
        "Failed to download certificate."
      );
    }
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (loading) {
    return (
      <div className="container mx-auto space-y-6 py-8">
        <div>
          <div className="h-9 w-64 animate-pulse rounded bg-muted" />

          <div className="mt-2 h-5 w-80 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card
              key={item}
              className="overflow-hidden"
            >
              <div className="h-40 animate-pulse bg-muted" />

              <CardContent className="space-y-4 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />

                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />

                <div className="h-10 w-full animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // Empty state
  // -----------------------------------------

  if (certificates.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            My Certifications
          </h1>

          <p className="mt-1 text-muted-foreground">
            View and manage your course certificates.
          </p>
        </div>

        <Card>
          <CardContent className="flex min-h-[350px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-semibold">
              No certifications yet
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Complete a course to earn your first certificate.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // -----------------------------------------
  // Certificates
  // -----------------------------------------

  return (
    <div className="container mx-auto space-y-8 py-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          My Certifications
        </h1>

        <p className="mt-1 text-muted-foreground">
          View and manage your course certificates.
        </p>
      </div>

      {/* Certificate count */}

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Award className="h-5 w-5 text-primary" />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Certificates earned
          </p>

          <p className="text-xl font-semibold">
            {certificates.length}
          </p>
        </div>
      </div>

      {/* Certificate grid */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {certificates.map(
          (certificate) => {

            /*
             * Your CertificateSchema uses
             * timestamps: true, therefore use
             * createdAt instead of issuedAt.
             */

            const issuedDate =
              certificate.createdAt
                ? new Date(
                    certificate.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "Unknown";

            return (
              <Card
                key={certificate._id}
                className="group overflow-hidden transition-shadow hover:shadow-md"
              >

                {/* Certificate visual */}

                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-muted/40">

                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

                  <div className="relative flex flex-col items-center text-center">

                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border bg-background shadow-sm">
                      <Award className="h-7 w-7 text-primary" />
                    </div>

                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Certificate
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      Achievement
                    </p>

                  </div>
                </div>

                {/* Content */}

                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-2 text-lg">
                    {certificate.courseTitle}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                  {/* Date */}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />

                    <span>
                      Issued {issuedDate}
                    </span>
                  </div>

                  {/* Certificate ID */}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-4 w-4" />

                    <span className="truncate">
                      ID:{" "}
                      {certificate.key}
                    </span>
                  </div>

                  {/* Actions */}

                  <div className="flex gap-2 pt-2">

                    <Button
                      className="flex-1"
                      onClick={() =>
                        handleView(
                          certificate
                        )
                      }
                      disabled={
                        !certificate.certificateLink
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />

                      View
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleDownload(
                          certificate
                        )
                      }
                      disabled={
                        !certificate.certificateLink
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                  </div>

                </CardContent>
              </Card>
            );
          }
        )}

      </div>
    </div>
  );
}