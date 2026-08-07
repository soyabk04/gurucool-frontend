import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import './index.css'
import App from './App.tsx'
import { queryClient } from "./lib/react-query.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
  <QueryClientProvider client={queryClient}>
     <App />
     </QueryClientProvider>
   
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand={false}
      toastOptions={{
        classNames: {
          toast: "rounded-xl border shadow-lg font-sans",
        },
      }}
    />
  </BrowserRouter>
);





