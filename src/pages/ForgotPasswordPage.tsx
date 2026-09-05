
"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { forgotPassword } from "@/services/user.service";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";

interface ForgotPasswordPageProps {
  className?: string;
}

const ForgotPasswordPage = ({
  className,
}: ForgotPasswordPageProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { theme } = useTheme();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email) return;

    try {
      setLoading(true);

      await forgotPassword({ email });

      setSent(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Unable to process your request. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden px-4",
        className
      )}
      style={{
        background: `
          radial-gradient(circle at top left, ${theme?.primaryColor}40 0%, transparent 35%),
          radial-gradient(circle at bottom right, ${theme?.secondaryColor}40 0%, transparent 40%),
          linear-gradient(135deg, ${theme?.primaryColor}, ${theme?.secondaryColor})
        `,
      }}
    >
      {/* Background Glow */}
      <div
        className="absolute -left-32 -top-24 h-96 w-96 rounded-full blur-[140px]"
        style={{
          background: theme?.primaryColor,
          opacity: 0.35,
        }}
      />

      <div
        className="absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full blur-[160px]"
        style={{
          background: theme?.secondaryColor,
          opacity: 0.35,
        }}
      />

      {/* Perspective Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)
            `,
            backgroundSize: "70px 70px",
            transform: "perspective(1200px) rotateX(72deg)",
            transformOrigin: "top",
          }}
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Forgot Password Card */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-[32px]
          border
          border-white/20
          bg-white/15
          p-10
          shadow-[0_20px_80px_rgba(0,0,0,.25)]
          backdrop-blur-3xl
          animate-in
          fade-in
          zoom-in-95
          duration-500
        "
      >
        {/* Logo */}
        {theme?.logoUrl && (
          <div className="mb-6 flex justify-center">
            <img
              src={theme.logoUrl}
              alt={theme.name}
              className="
                h-16
                w-16
                rounded-2xl
                border
                border-white/30
                bg-white
                object-cover
                shadow-lg
              "
            />
          </div>
        )}

        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <span
            className="
              rounded-full
              border
              border-white/30
              px-5
              py-2
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-white
              backdrop-blur-md
            "
            style={{
              backgroundColor: `${theme?.primaryColor}55`,
            }}
          >
            {theme?.name}
          </span>
        </div>

        {!sent ? (
          <>
            {/* Icon */}
            <div className="mb-5 flex justify-center">
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/10
                  shadow-lg
                "
              >
                <Mail className="h-7 w-7 text-white" />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-white">
                Forgot Password?
              </h1>

              <p className="mt-2 text-sm leading-6 text-white/70">
                Enter your email address and we'll send you
                a link to reset your password.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Email */}
              <div>
                <Label
                  htmlFor="email"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-white/80
                  "
                >
                  Email Address
                </Label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="john@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="
                    h-14
                    rounded-2xl
                    border-white/20
                    bg-white/10
                    text-white
                    placeholder:text-white/40
                    backdrop-blur-sm
                    focus-visible:border-white/40
                    focus-visible:ring-2
                    focus-visible:ring-white/30
                  "
                />
              </div>

              {/* Button */}
              <Button
                type="submit"
                disabled={loading}
                className="
                  h-14
                  w-full
                  rounded-2xl
                  text-base
                  font-semibold
                  text-white
                  transition-all
                  hover:scale-[1.02]
                  active:scale-[.98]
                "
                style={{
                  backgroundColor: theme?.primaryColor,
                }}
              >
                {loading
                  ? "Sending..."
                  : "Send Reset Link"}
              </Button>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="text-center">
            <div className="mb-5 flex justify-center">
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/10
                  shadow-lg
                "
              >
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white">
              Check Your Email
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/70">
              If an account exists with this email address,
              we've sent a password reset link.
            </p>

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-white/15
                bg-white/10
                p-4
                text-sm
                leading-6
                text-white/70
                backdrop-blur-md
              "
            >
              Please check your inbox and spam folder.
              The reset link will expire after a limited
              time.
            </div>
          </div>
        )}

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-white/70
              transition
              hover:text-white
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;