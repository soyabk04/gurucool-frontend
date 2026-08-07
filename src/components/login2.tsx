"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { login } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";

interface Login2Props {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
    className?: string;
  };
  buttonText?: string;
  className?: string;
}

const Login2 = ({
  className,
}: Login2Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const {theme}=useTheme()




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) return;

    try {
      setLoading(true);

      const { user } = await login({ email, password });
      setUser(user);

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.response.data.message|| "Login failed");
      toast.error(err.response.data.message)
    } finally {
      setLoading(false);
    }

  };

 return (
<section
  className={cn(
    "relative flex min-h-screen items-center justify-center overflow-hidden",
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

  {/* Login Card */}
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
          className="h-16 w-16 rounded-2xl border border-white/30 bg-white object-cover shadow-lg"
        />
      </div>
    )}

    {/* Badge */}
    <div className="mb-6 flex justify-center">
      <span
        className="rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md"
        style={{
          backgroundColor: `${theme?.primaryColor}55`,
        }}
      >
        {theme?.name}
      </span>
    </div>

    {/* Heading */}
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold text-white">
        Welcome Back
      </h1>

      <p className="mt-2 text-sm text-white/70">
        Sign in to continue to your dashboard.
      </p>
    </div>

    {/* Error */}
    {error && (
      <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/15 p-3 text-sm text-red-100 backdrop-blur-md">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <Label className="mb-2 block text-sm font-medium text-white/80">
          Email Address
        </Label>

        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
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

      {/* Password */}
      <div>
        <Label className="mb-2 block text-sm font-medium text-white/80">
          Password
        </Label>

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
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

      {/* Remember */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-white/80">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white/30"
          />
          Remember me
        </label>

        <button
          type="button"
          className="font-medium text-white/80 transition hover:text-white"
          onClick={() => (window.location.href = "/forgot-password")}
        >
          Forgot password?
        </button>
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
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  </div>
</section>
);
};

export default Login2;