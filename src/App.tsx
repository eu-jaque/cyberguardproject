import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Dash from "./pages/Dash";
import Services from "./pages/Services";
// import Experts from "./pages/Experts";
import Blog from "./pages/Blog";
import Policies from "./pages/Policies";
import SaibaMais from "./pages/SaibaMais";
import "./App.css";
// import Courses from "./pages/Courses.tsx"
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AuthRoute from "./components/AuthRoute";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Contact from "./pages/Contact.tsx";
import TicketsPage from "./pages/ViewTickets.tsx";
import Courses from "./pages/Courses.tsx";
import Experts from "./pages/Experts.tsx";
import AuthV2 from "./pages/AuthV2.tsx";
import Chatbot from "./components/Chatbot.tsx";
import ChatBotView from "./pages/ChatBotView.tsx";
import StudentDashboard from "./pages/StudentDashboard.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";
import ExpertProfile from "./components/experts/ExpertProfile.tsx";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/auth" element={
                  <AuthRoute>
                    <Auth />
                  </AuthRoute>
                } />
                 <Route path="/authv2" element={
                  <AuthRoute>
                    <AuthV2 />
                  </AuthRoute>
                } />
                <Route path="/courses" element={
                  
                    <Courses />
                  
                } />
                <Route path="/dash" element={
                  <ProtectedRoute>
                    <Dash />
                  </ProtectedRoute>
                } />
                <Route path="/chatBot" element={
                  // <ProtectedRoute>
                    <ChatBotView/>
                  // </ProtectedRoute>
                } />
                <Route path="/tickets" element={<TicketsPage />}></Route>
                <Route path="/servicos" element={<Services />} />
                <Route path="/especialistas" element={<Experts />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/politicas" element={<Policies />} />
                <Route path="/saiba-mais" element={<SaibaMais />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/cursos" element={<Courses />} />
                <Route path="/student-dashboard" element={
                  <ProtectedRoute><StudentDashboard /></ProtectedRoute>
                } />
                <Route path="/blog/:slug" element={<ArticlePage />} />
                <Route path="/expert-profile" element={
                  <ProtectedRoute><ExpertProfile /></ProtectedRoute>
                } />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
