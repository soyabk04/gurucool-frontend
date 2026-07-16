import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { checklogin } from "@/services/auth.service";
import { generateAccessToken } from "./accessToken";
import { genAccessToken } from "@/services/auth.service";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    async function verify() {
      try {
        const res = await checklogin();
        
        setAuthenticated(res.success);
      } catch (err:any) {
        console.log(err.message)
      } finally {
        setLoading(false);
      }
    }
    verify()
 
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authenticated ? <>{children}</> : <Navigate to="/" replace />;
}