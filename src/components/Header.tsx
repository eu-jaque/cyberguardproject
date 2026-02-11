import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 h-[80px] flex items-center justify-between transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="w-full max-w-[1366px] mx-auto px-[2%] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("inicio")}>
          <Shield className="w-8 h-8 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">
            Cyber<span className="text-primary">Guard</span>
          </span>
        </div>

        {/* Nav + Login */}
        <div className="flex items-center gap-5">
          <button onClick={() => scrollTo("inicio")} className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
            Início
          </button>
          <button onClick={() => scrollTo("sobre")} className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
            Sobre
          </button>
          <button onClick={() => scrollTo("contato")} className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
            Contato
          </button>
          <button className="btn-login bg-primary text-primary-foreground px-5 py-1.5 rounded-[5px] text-sm font-semibold cursor-pointer">
            Login / Cadastrar
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
