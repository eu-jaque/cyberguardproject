import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-foreground">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Página não encontrada</p>
          <a href="/" className="text-primary underline hover:text-primary/90">Voltar ao Início</a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
