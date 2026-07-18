"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { login } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

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
  heading = "Login",
  logo = {
    url: "/",
    src: "https://i.ibb.co/Dhx9YXm/TWE-logo.png",
    alt: "logo",
    title: "The Wisdom Essentials",
  },
  buttonText = "Login",
  className,
}: Login2Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

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
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={cn("h-screen bg-muted", className)}>
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <a href={logo.url}>
            <img
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              className="h-25 dark:invert"
            />
          </a>

          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-sm min-w-sm flex-col gap-y-4 rounded-md border bg-background px-6 py-8 shadow-md"
          >
            {heading && (
              <h1 className="text-xl font-semibold text-center">
                {heading}
              </h1>
            )}

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : buttonText}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login2;