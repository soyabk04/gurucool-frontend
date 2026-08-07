import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Mode = "light" | "dark" | "system";

interface AppearanceContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const AppearanceContext =
  createContext<AppearanceContextType | null>(null);

export function AppearanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<Mode>(() => {
    return (
      (localStorage.getItem("appearance") as Mode) ??
      "system"
    );
  });

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");

    const isDark =
      mode === "dark" ||
      (mode === "system" &&
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches);

    root.classList.add(
      isDark ? "dark" : "light"
    );

    localStorage.setItem(
      "appearance",
      mode
    );
  }, [mode]);

  return (
    <AppearanceContext.Provider
      value={{
        mode,
        setMode,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(
    AppearanceContext
  );

  if (!context) {
    throw new Error(
      "useAppearance must be used within AppearanceProvider"
    );
  }

  return context;
}