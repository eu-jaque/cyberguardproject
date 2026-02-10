import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contato" className="bg-card border-t border-border py-12">
      <div className="max-w-[1366px] mx-auto px-[2%]">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-display text-lg font-bold text-foreground">
                Cyber<span className="text-primary">Guarda</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Educando e protegendo pessoas contra fraudes e golpes digitais.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-foreground mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://www.gov.br/pf/pt-br" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Polícia Federal</a></li>
              <li><a href="https://www.procon.sp.gov.br/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Procon</a></li>
              <li><a href="https://www.cert.br/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">CERT.br</a></li>
              <li><a href="https://www.bcb.gov.br/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Banco Central</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-foreground mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contato@cyberguarda.com.br</li>
              <li>Denuncie golpes: 181</li>
              <li>Disque-denúncia: 0800-123-4567</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          © 2026 CyberGuarda. Todos os direitos reservados. Site educativo sem fins lucrativos.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
