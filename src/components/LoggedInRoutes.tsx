import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface LoggedInRouteProps {
  children: React.ReactNode;
}

/**
 * Public-only route.
 * - Logged-out users can access the page.
 * - Logged-in users are redirected to the dashboard.
 */
export default function LoggedInRoute({
  children,
}: LoggedInRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}