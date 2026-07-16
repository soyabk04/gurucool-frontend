import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { checklogin } from "@/services/auth.service";

type Props = {
  children: React.ReactNode;
};

export function LoggedInRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function verify() {
      const res = await checklogin();
      setAuthenticated(res.success);
      setLoading(false);
    }

    verify();
  }, []);

  if (loading) return <div>Loading...</div>;

  return authenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
}