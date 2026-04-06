import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logooriginal.png";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contato" className="bg-card border-t border-border py-12">
      {/* Ajustei o max-width para 1200px para alinhar com o conteúdo superior */}
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Grid com 4 colunas no desktop para melhor distribuição */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Coluna 1: Logo e Descrição - Ocupa 2 colunas para dar peso à marca */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="CyberGuard Logo" className="w-8 h-8 object-contain" />
              <span className="font-display text-lg font-bold text-foreground">
                Cyber<span className="text-gradient-gold">Guard</span>
              </span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              {t("footer.desc")}
            </p>
            <br></br>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="break-all">contato@cyberguard.com.br</li>
              <li className="break-all">Rua da Alegria</li>
              <li className="break-all">+55 (16) 1234-5678</li>
            </ul>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h4 className="font-display text-sm font-bold text-gradient-gold mb-5 uppercase tracking-wider">
              {t("footer.sobre")}
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/sobre" className="hover:text-primary transition-colors">{t("footer.sobre_link")}</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">{t("footer.blog_link")}</Link>
              </li>
              <li>
                <Link to="/politicas" className="hover:text-primary transition-colors">{t("footer.politicas_link")}</Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h4 className="font-display text-sm font-bold text-gradient-gold mb-5 uppercase tracking-wider">
              {t("footer.contato")}
            </h4>
            
          </div>
        </div>

        {/* Linha de Copyright mais discreta e espaçada */}
        <div className="mt-16 pt-8 border-t border-border/50 text-center text-[10px] uppercase tracking-[0.1em] text-muted-foreground/60">
          {t("footer.copy")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;