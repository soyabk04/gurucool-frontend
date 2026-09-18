import AppRoutes from "./routes/app.routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import {AppearanceProvider} from "./context/AppearanceContext";
import { Analytics } from '@vercel/analytics/react';
import "@fontsource/inter";

function App() {
  return (
    <AuthProvider>
      <AppearanceProvider>
        <ThemeProvider>
          <AppRoutes />
          <Analytics />
        </ThemeProvider>
      </AppearanceProvider>
    </AuthProvider>
  );
}

export default App;

