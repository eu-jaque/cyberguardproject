import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/cyberguard-logo.png";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contato" className="bg-card border-t border-border py-12">
      <div className="max-w-[1366px] mx-auto px-[2%]">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="CyberGuard Logo" className="w-8 h-8 object-contain" />
              <span className="font-display text-lg font-bold text-foreground">
                Cyber<span className="text-gradient-gold">Guard</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{t("footer.desc")}</p>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-gradient-gold mb-4">{t("footer.sobre")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
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

          <div>
            <h4 className="font-display text-sm font-bold text-gradient-gold mb-4">{t("footer.contato")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contato@cyberguard.com.br</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          {t("footer.copy")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
