/*
 * SCHIMMILAB – App Router
 * Design: Deep Space Lab – Dark Sci-Fi / Cyberpunk Minimal
 * Routes: Home, Experimente, Infrastruktur, Gedankenraum, Medien
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Route-based code splitting: each page is its own chunk, so the initial
// payload stays small and heavy pages (markdown detail views) load on demand.
const Home = lazy(() => import("./pages/Home"));
const Experimente = lazy(() => import("./pages/Experimente"));
const Infrastruktur = lazy(() => import("./pages/Infrastruktur"));
const Gedankenraum = lazy(() => import("./pages/Gedankenraum"));
const Medien = lazy(() => import("./pages/Medien"));
const ExperimentDetail = lazy(() => import("./pages/ExperimentDetail"));
const GedankenDetail = lazy(() => import("./pages/GedankenDetail"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function Router() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/experimente" component={Experimente} />
        <Route path="/experimente/:id" component={ExperimentDetail} />
        <Route path="/infrastruktur" component={Infrastruktur} />
        <Route path="/gedankenraum" component={Gedankenraum} />
        <Route path="/gedankenraum/:id" component={GedankenDetail} />
        <Route path="/medien" component={Medien} />
        <Route path="/impressum" component={Impressum} />
        <Route path="/datenschutz" component={Datenschutz} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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
