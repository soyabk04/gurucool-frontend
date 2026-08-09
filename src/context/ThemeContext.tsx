import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import { getOrgTheme } from "@/services/theme.service";
import { toast } from "sonner";

interface Theme {
  name: string;
  domain:string
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

interface ThemeContextValue {
  loading: boolean;
  theme: Theme | null;
  refreshTheme: () => Promise<void>;
}

const defaultTheme: Theme = {
  name: "GuruCool",
  domain:'none',
  logoUrl: "https://i.ibb.co/ks9vGD5k/TWE-logo.png",
  primaryColor: "#063B00",
  secondaryColor: "#64748b",
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(theme: Theme) {
  document.title = theme.name;

  const favicon = document.querySelector(
    "link[rel*='icon']"
  ) as HTMLLinkElement | null;

  if (favicon) {
    favicon.href = theme.logoUrl;
  }

  document.documentElement.style.setProperty(
    "--primary",
    theme.primaryColor
  );

  document.documentElement.style.setProperty(
    "--secondary",
    theme.secondaryColor
  );
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme | null>(null);

  const refreshTheme = useCallback(async () => {
    setLoading(true);

    try {
      const domain = window.location.hostname;

      const { data } = await getOrgTheme(domain);

      setTheme(data);
      applyTheme(data);
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        

        console.error(error.response?.data?.message);
        toast.error(error.response?.data?.message)
      } else {
        console.error(error);
      }

      setTheme(defaultTheme);
      applyTheme(defaultTheme);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTheme();
  }, [refreshTheme]);

  return (
    <ThemeContext.Provider
      value={{
        loading,
        theme,
        refreshTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}