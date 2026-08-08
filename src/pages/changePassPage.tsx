import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { changePassword} from "@/services/user.service"

export default function ChangePasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await changePassword({
        token,
        newpass: password,
      });

      setSuccess(
        response.message || "Password changed successfully."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to change password. The reset link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">
              Change Password
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Enter your new password below.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={loading}
                className="w-full rounded-lg border bg-background px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
                disabled={loading}
                className="w-full rounded-lg border bg-background px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}