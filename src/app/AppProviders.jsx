import { ThemeProvider } from "@/shared/contexts/ThemeContext.jsx";
import { TooltipProvider } from "@/shared/ui/Tooltip.jsx";

export const AppProviders = ({ children }) => (
  <ThemeProvider>
    <TooltipProvider>{children}</TooltipProvider>
  </ThemeProvider>
);
