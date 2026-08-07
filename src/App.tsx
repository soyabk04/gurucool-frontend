import AppRoutes from "./routes/app.routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import {AppearanceProvider} from "./context/AppearanceContext";
import "@fontsource/inter";

function App() {
  return (
    <AuthProvider>
      <AppearanceProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AppearanceProvider>
    </AuthProvider>
  );
}

export default App;

