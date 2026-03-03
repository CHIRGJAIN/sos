import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import SosRoutes from "@/sos/routes";
import { SosAppProvider } from "@/sos/context/SosAppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SosWebProvider } from "@/web/context/SosWebContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SosAppProvider>
        <SosWebProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SosRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </SosWebProvider>
      </SosAppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
