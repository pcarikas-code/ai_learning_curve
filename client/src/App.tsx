import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Certificate from "./pages/Certificate";
import LearningPaths from "./pages/LearningPaths";
import PathDetail from "./pages/PathDetail";
import ModuleDetail from "./pages/ModuleDetail";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/paths" component={LearningPaths} />
      <Route path="/paths/:slug" component={PathDetail} />
      <Route path="/modules/:slug" component={ModuleDetail} />
      <Route path="/dashboard" component={Dashboard} />
        <Route path={"/"} component={Home} />
      <Route path="/certificate/:pathId" component={Certificate} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
