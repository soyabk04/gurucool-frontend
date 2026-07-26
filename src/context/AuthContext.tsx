import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import { me, logout as logoutRequest, type AuthUser } from "@/services/auth.service";
import { getOrgTheme } from "@/services/theme.service";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  theme: any | null;
  // Re-checks the session with the backend. Returns the user (or null).
  refresh: () => Promise<AuthUser | null>;
  // Optimistically set the user right after a successful login, without
  // waiting on a second round-trip to the server.
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  setTheme: any;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme,settheme]=useState<any |null>(null)
const setTheme = useCallback(async () => {
  let myTheme;

  try {
    const domain = window.location.hostname;
    myTheme = await getOrgTheme('gurucool-frontend.vercel.app');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.status);
      console.log(error.response?.data?.message);
    }

    myTheme = {
          name: "GuruCool",
          logoUrl: "/logo.png",
          primaryColor: "#063B00",
          secondaryColor: "#64748b",
        };
  }

  settheme(myTheme.data);
  console.log(myTheme.data)

  document.title = myTheme.data.name;

  const siteIcon = document.getElementById("siteIcon");
  siteIcon?.setAttribute("href", myTheme.data.logoUrl);

  document.documentElement.style.setProperty(
    "--primary",
    myTheme.data.primaryColor
  );

  document.documentElement.style.setProperty(
    "--secondary",
    myTheme.data.secondaryColor
  );
}, []);
  useEffect(() => {
    setTheme();
  }, [setTheme]);
  const refresh = useCallback(async () => {
    try {
      const res = await me();
      setUserState(res.user);
      return res.user;
    } catch {
      setUserState(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUserState(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, setUser,setTheme,theme, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
