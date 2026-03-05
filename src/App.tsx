import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Article from "./pages/Article";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dash from "./pages/Dash";
import Antivirus from "./pages/Antivirus";
import Services from "./pages/Services";
import Experts from "./pages/Experts";
import Blog from "./pages/Blog";
import Policies from "./pages/Policies";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/artigo/:slug" element={<Article />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dash" element={<Dash />} />
            <Route path="/antivirus" element={<Antivirus />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/especialistas" element={<Experts />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/politicas" element={<Policies />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
