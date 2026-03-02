/*
 * SCHIMMILAB – App Router
 * Design: Deep Space Lab – Dark Sci-Fi / Cyberpunk Minimal
 * Routes: Home, Experimente, Infrastruktur, Gedankenraum, Medien
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Experimente from "./pages/Experimente";
import Infrastruktur from "./pages/Infrastruktur";
import Gedankenraum from "./pages/Gedankenraum";
import Medien from "./pages/Medien";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/experimente" component={Experimente} />
      <Route path="/infrastruktur" component={Infrastruktur} />
      <Route path="/gedankenraum" component={Gedankenraum} />
      <Route path="/medien" component={Medien} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      {/* Dark theme is default for Deep Space Lab aesthetic */}
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
