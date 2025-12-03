import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import CriteriaPage from "@/pages/criteria";
import AlternativesPage from "@/pages/alternatives";
import CalculationPage from "@/pages/calculation";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/criteria" component={CriteriaPage} />
        <Route path="/alternatives" component={AlternativesPage} />
        <Route path="/calculation" component={CalculationPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
