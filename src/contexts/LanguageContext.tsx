import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "pt" | "en" | "es";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Header
  "nav.inicio": { pt: "Início", en: "Home", es: "Inicio" },
  "nav.blog": { pt: "Blog", en: "Blog", es: "Blog" },
  "nav.cursos": { pt: "Cursos", en: "Courses", es: "Cursos" },
  "nav.servicos": { pt: "Serviços", en: "Services", es: "Servicios" },
  "nav.sobre": { pt: "Sobre", en: "About", es: "Acerca" },
  "nav.contato": { pt: "Contato", en: "Contact", es: "Contacto" },
  "nav.login": { pt: "Login / Cadastrar", en: "Login / Sign Up", es: "Login / Registro" },
  "nav.email_placeholder": { pt: "Seu e-mail", en: "Your email", es: "Tu correo" },
  "nav.email_invalid": { pt: "E-mail inválido", en: "Invalid email", es: "Correo inválido" },
  "nav.email_success": { pt: "E-mail cadastrado com sucesso", en: "Email registered successfully", es: "Correo registrado con éxito" },

  // Services dropdown
  "srv.verificador_seguranca": { pt: "Verificador de Segurança", en: "Security Checker", es: "Verificador de Seguridad" },
  "srv.conversa_especialistas": { pt: "Conversa com Especialistas", en: "Talk to Experts", es: "Hablar con Expertos" },
  "srv.servicos_page": { pt: "Serviços", en: "Services", es: "Servicios" },

  // Accessibility
  "a11y.title": { pt: "Acessibilidade", en: "Accessibility", es: "Accesibilidad" },
  "a11y.screen_reader": { pt: "Leitor de Tela", en: "Screen Reader", es: "Lector de Pantalla" },
  "a11y.high_contrast": { pt: "Alto Contraste", en: "High Contrast", es: "Alto Contraste" },
  "a11y.grayscale": { pt: "Tela P&B", en: "Grayscale", es: "Escala de Grises" },
  "a11y.font_size": { pt: "Tamanho da Fonte", en: "Font Size", es: "Tamaño de Fuente" },
  "a11y.highlight_links": { pt: "Destacar Links", en: "Highlight Links", es: "Resaltar Enlaces" },

  // Hero Carousel
  "hero.slide1.title": {
    pt: "Você confia em quem está do outro lado da tela?",
    en: "Do you trust who is on the other side of the screen?",
    es: "¿Confías en quién está al otro lado de la pantalla?",
  },
  "hero.slide1.desc": {
    pt: "A cada 6 segundos, alguém cai em um golpe digital no Brasil. O próximo pode ser você ou alguém que você ama.",
    en: "Every 6 seconds, someone falls for a digital scam in Brazil. You or someone you love could be next.",
    es: "Cada 6 segundos, alguien cae en una estafa digital en Brasil. El próximo puedes ser tú o alguien que amas.",
  },
  "hero.slide2.title": {
    pt: "Aquela mensagem urgente pode custar tudo que você tem",
    en: "That urgent message could cost you everything you have",
    es: "Ese mensaje urgente puede costarte todo lo que tienes",
  },
  "hero.slide2.desc": {
    pt: "Criminosos usam o medo e a pressa para roubar seu dinheiro. Aprenda a reconhecer os sinais antes que seja tarde.",
    en: "Criminals use fear and urgency to steal your money. Learn to recognize the signs before it is too late.",
    es: "Los criminales usan el miedo y la prisa para robar tu dinero. Aprende a reconocer las señales antes de que sea tarde.",
  },
  "hero.slide3.title": {
    pt: "Seus dados já podem estar nas mãos erradas",
    en: "Your data may already be in the wrong hands",
    es: "Tus datos ya pueden estar en las manos equivocadas",
  },
  "hero.slide3.desc": {
    pt: "Nome, CPF, senhas: tudo pode ser roubado sem você perceber. Descubra como blindar sua vida digital agora.",
    en: "Name, ID, passwords: everything can be stolen without you noticing. Discover how to protect your digital life now.",
    es: "Nombre, documento, contraseñas: todo puede ser robado sin que lo notes. Descubre cómo proteger tu vida digital ahora.",
  },
  "hero.cta": { pt: "Saiba Mais", en: "Learn More", es: "Saber Más" },

  // Stats Section
  "stats.title": { pt: "Números que você", en: "Numbers you", es: "Números que" },
  "stats.title_highlight": { pt: "precisa conhecer", en: "need to know", es: "necesitas conocer" },
  "stats.subtitle": {
    pt: "Os dados abaixo mostram a realidade das fraudes digitais no Brasil e no mundo. São números reais, de fontes oficiais, que revelam o tamanho desse problema.",
    en: "The data below shows the reality of digital fraud in Brazil and worldwide. These are real numbers from official sources that reveal the scale of this problem.",
    es: "Los datos a continuación muestran la realidad del fraude digital en Brasil y en el mundo. Son números reales de fuentes oficiales que revelan la magnitud del problema.",
  },
  "stats.subtitle2": {
    pt: "Quanto mais você souber, mais difícil será para um criminoso te enganar.",
    en: "The more you know, the harder it will be for a criminal to deceive you.",
    es: "Cuanto más sepas, más difícil será para un criminal engañarte.",
  },
  "stats.source": { pt: "Fonte", en: "Source", es: "Fuente" },
  "stats.0.value": { pt: "R$ 2,5 bilhões", en: "R$ 2.5 billion", es: "R$ 2.500 millones" },
  "stats.0.label": { pt: "Perdas com fraudes bancárias digitais em 2024", en: "Losses from digital banking fraud in 2024", es: "Pérdidas por fraude bancario digital en 2024" },
  "stats.1.value": { pt: "1 em cada 3", en: "1 in 3", es: "1 de cada 3" },
  "stats.1.label": { pt: "brasileiros já foi vítima de algum golpe digital", en: "Brazilians have been victims of a digital scam", es: "brasileños han sido víctimas de alguna estafa digital" },
  "stats.2.value": { pt: "+65%", en: "+65%", es: "+65%" },
  "stats.2.label": { pt: "aumento nos golpes via Pix desde 2022", en: "increase in Pix scams since 2022", es: "aumento en estafas vía Pix desde 2022" },
  "stats.3.value": { pt: "3,4 milhões", en: "3.4 million", es: "3,4 millones" },
  "stats.3.label": { pt: "tentativas de fraude com cartão de crédito por ano", en: "credit card fraud attempts per year", es: "intentos de fraude con tarjeta de crédito por año" },
  "stats.4.value": { pt: "208 mil", en: "208 thousand", es: "208 mil" },
  "stats.4.label": { pt: "registros de phishing no Brasil em 2024", en: "phishing records in Brazil in 2024", es: "registros de phishing en Brasil en 2024" },
  "stats.5.value": { pt: "US$ 10,3 trilhões", en: "US$ 10.3 trillion", es: "US$ 10,3 billones" },
  "stats.5.label": { pt: "custo global estimado do cibercrime até 2025", en: "estimated global cost of cybercrime by 2025", es: "costo global estimado del cibercrimen hasta 2025" },

  // Parallax
  "parallax.title": {
    pt: "Proteja-se. Informe-se. Não seja a próxima vítima.",
    en: "Protect yourself. Stay informed. Do not be the next victim.",
    es: "Protégete. Infórmate. No seas la próxima víctima.",
  },
  "parallax.desc": {
    pt: "O conhecimento é sua maior arma contra os golpes digitais.",
    en: "Knowledge is your greatest weapon against digital scams.",
    es: "El conocimiento es tu mayor arma contra las estafas digitales.",
  },

  // FlipCards Section
  "flip.title": { pt: "Você sabe", en: "Do you know how to", es: "¿Sabes" },
  "flip.title_highlight": { pt: "reconhecer um golpe?", en: "recognize a scam?", es: "reconocer una estafa?" },
  "flip.subtitle": {
    pt: "Conheça os tipos de fraude mais comuns e aprenda a identificar cada um deles antes que seja tarde.",
    en: "Learn about the most common types of fraud and how to identify each one before it is too late.",
    es: "Conoce los tipos de fraude más comunes y aprende a identificar cada uno antes de que sea tarde.",
  },
  "flip.hover": { pt: "Passe o mouse para saber mais", en: "Hover to learn more", es: "Pasa el mouse para saber más" },
  "flip.0.title": { pt: "Golpe do Pix", en: "Pix Scam", es: "Estafa del Pix" },
  "flip.0.back": {
    pt: "Criminosos se passam por conhecidos ou empresas e pedem transferências urgentes via Pix. Sempre confirme por ligação antes de enviar qualquer valor.",
    en: "Criminals impersonate acquaintances or companies and request urgent Pix transfers. Always confirm by phone before sending any amount.",
    es: "Los criminales se hacen pasar por conocidos o empresas y piden transferencias urgentes vía Pix. Siempre confirma por teléfono antes de enviar cualquier monto.",
  },
  "flip.1.title": { pt: "Phishing", en: "Phishing", es: "Phishing" },
  "flip.1.back": {
    pt: "Mensagens falsas por e-mail, SMS ou redes sociais imitam bancos e lojas. O objetivo é roubar suas senhas e dados bancários. Nunca clique em links suspeitos.",
    en: "Fake messages via email, SMS or social media imitate banks and stores. The goal is to steal your passwords and bank data. Never click on suspicious links.",
    es: "Mensajes falsos por correo, SMS o redes sociales imitan bancos y tiendas. El objetivo es robar tus contraseñas y datos bancarios. Nunca hagas clic en enlaces sospechosos.",
  },
  "flip.2.title": { pt: "Clonagem de WhatsApp", en: "WhatsApp Cloning", es: "Clonación de WhatsApp" },
  "flip.2.back": {
    pt: "Golpistas clonam seu número e pedem dinheiro aos seus contatos. Ative a verificação em duas etapas no WhatsApp para se proteger.",
    en: "Scammers clone your number and ask your contacts for money. Enable two-step verification on WhatsApp to protect yourself.",
    es: "Los estafadores clonan tu número y piden dinero a tus contactos. Activa la verificación en dos pasos en WhatsApp para protegerte.",
  },
  "flip.3.title": { pt: "Falso Boleto", en: "Fake Invoice", es: "Boleto Falso" },
  "flip.3.back": {
    pt: "Boletos adulterados desviam seu pagamento para contas de criminosos. Sempre confira os dados do beneficiário antes de pagar.",
    en: "Tampered invoices redirect your payment to criminal accounts. Always check the beneficiary details before paying.",
    es: "Boletos adulterados desvían tu pago a cuentas de criminales. Siempre verifica los datos del beneficiario antes de pagar.",
  },
  "flip.4.title": { pt: "Falsa Central de Atendimento", en: "Fake Call Center", es: "Falso Centro de Atención" },
  "flip.4.back": {
    pt: "Ligações que fingem ser do seu banco pedem senhas e códigos. Bancos nunca pedem senha por telefone. Desligue e ligue você mesmo para o número oficial.",
    en: "Calls pretending to be from your bank ask for passwords and codes. Banks never ask for passwords by phone. Hang up and call the official number yourself.",
    es: "Llamadas que fingen ser de tu banco piden contraseñas y códigos. Los bancos nunca piden contraseñas por teléfono. Cuelga y llama tú mismo al número oficial.",
  },
  "flip.5.title": { pt: "Golpe do Emprego Falso", en: "Fake Job Scam", es: "Estafa del Empleo Falso" },
  "flip.5.back": {
    pt: "Vagas falsas pedem pagamento antecipado ou seus documentos pessoais. Empresas sérias nunca cobram para contratar. Desconfie de ofertas boas demais.",
    en: "Fake jobs ask for upfront payment or personal documents. Serious companies never charge to hire. Be suspicious of offers that are too good.",
    es: "Empleos falsos piden pago anticipado o documentos personales. Las empresas serias nunca cobran para contratar. Desconfía de ofertas demasiado buenas.",
  },

  // Testimonials
  "test.title": { pt: "Quem aprendeu,", en: "Those who learned,", es: "Quien aprendió," },
  "test.title_highlight": { pt: "não caiu", en: "did not fall", es: "no cayó" },
  "test.subtitle": {
    pt: "Veja depoimentos de pessoas que reconheceram golpes a tempo graças à informação.",
    en: "See testimonials from people who recognized scams in time thanks to information.",
    es: "Ve testimonios de personas que reconocieron estafas a tiempo gracias a la información.",
  },

  // Footer
  "footer.desc": {
    pt: "Educando e protegendo pessoas contra fraudes e golpes digitais.",
    en: "Educating and protecting people against digital fraud and scams.",
    es: "Educando y protegiendo personas contra fraudes y estafas digitales.",
  },
  "footer.sobre": { pt: "Sobre a CyberGuard", en: "About CyberGuard", es: "Acerca de CyberGuard" },
  "footer.sobre_link": { pt: "Sobre nós", en: "About us", es: "Sobre nosotros" },
  "footer.blog_link": { pt: "Blog", en: "Blog", es: "Blog" },
  "footer.politicas_link": { pt: "Políticas", en: "Policies", es: "Políticas" },
  "footer.contato": { pt: "Contato", en: "Contact", es: "Contacto" },
  "footer.copy": {
    pt: "Copyright \u00A9 2026 CyberGuard. Todos os direitos reservados.",
    en: "Copyright \u00A9 2026 CyberGuard. All rights reserved.",
    es: "Copyright \u00A9 2026 CyberGuard. Todos los derechos reservados.",
  },

  // About
  "about.title": { pt: "Sobre a CyberGuard", en: "About CyberGuard", es: "Acerca de CyberGuard" },
  "about.desc": {
    pt: "A CyberGuard é uma plataforma educativa dedicada a conscientizar e proteger pessoas contra fraudes e golpes digitais. Nossa missão é democratizar o acesso à informação sobre segurança digital, oferecendo conteúdo gratuito e de qualidade para todos.",
    en: "CyberGuard is an educational platform dedicated to raising awareness and protecting people against digital fraud and scams. Our mission is to democratize access to digital security information, offering free and quality content for everyone.",
    es: "CyberGuard es una plataforma educativa dedicada a concientizar y proteger personas contra fraudes y estafas digitales. Nuestra misión es democratizar el acceso a la información sobre seguridad digital, ofreciendo contenido gratuito y de calidad para todos.",
  },

  // Dash
  "dash.profile": { pt: "Perfil do Usuário", en: "User Profile", es: "Perfil del Usuario" },
  "dash.subscriptions": { pt: "Assinaturas", en: "Subscriptions", es: "Suscripciones" },
  "dash.courses": { pt: "Cursos", en: "Courses", es: "Cursos" },
  "dash.verifiers": { pt: "Verificadores", en: "Verifiers", es: "Verificadores" },
  "dash.games": { pt: "Quiz e Jogos", en: "Quiz & Games", es: "Quiz y Juegos" },
  "dash.welcome": { pt: "Bem-vindo de volta", en: "Welcome back", es: "Bienvenido de vuelta" },
  "dash.member_since": { pt: "Membro desde", en: "Member since", es: "Miembro desde" },
  "dash.active": { pt: "Ativo", en: "Active", es: "Activo" },
  "dash.inactive": { pt: "Inativo", en: "Inactive", es: "Inactivo" },
  "dash.beginner": { pt: "Iniciante", en: "Beginner", es: "Principiante" },
  "dash.intermediate": { pt: "Intermediário", en: "Intermediate", es: "Intermedio" },
  "dash.advanced": { pt: "Avançado", en: "Advanced", es: "Avanzado" },
  "dash.expert": { pt: "Especialista", en: "Expert", es: "Especialista" },
  "dash.check_link": { pt: "Verificar Link", en: "Check Link", es: "Verificar Enlace" },
  "dash.check_email": { pt: "Verificar E-mail", en: "Check Email", es: "Verificar Correo" },
  "dash.check_pix": { pt: "Verificar Chave Pix", en: "Check Pix Key", es: "Verificar Clave Pix" },
  "dash.verify": { pt: "Verificar", en: "Verify", es: "Verificar" },
  "dash.safe": { pt: "Seguro — Nenhuma ameaça detectada", en: "Safe — No threats detected", es: "Seguro — Ninguna amenaza detectada" },
  "dash.danger": { pt: "Perigo — Ameaça detectada", en: "Danger — Threat detected", es: "Peligro — Amenaza detectada" },
  "dash.enter_link": { pt: "Cole o link aqui...", en: "Paste the link here...", es: "Pega el enlace aquí..." },
  "dash.enter_email": { pt: "Digite o e-mail...", en: "Enter the email...", es: "Escribe el correo..." },
  "dash.enter_pix": { pt: "Digite a chave Pix...", en: "Enter the Pix key...", es: "Escribe la clave Pix..." },
  "dash.scam_game": { pt: "Identifique o Golpe", en: "Identify the Scam", es: "Identifica la Estafa" },
  "dash.scam_game_desc": { pt: "Classifique cada situação como golpe ou legítimo", en: "Classify each situation as scam or legitimate", es: "Clasifica cada situación como estafa o legítima" },
  "dash.scam": { pt: "Golpe", en: "Scam", es: "Estafa" },
  "dash.legit": { pt: "Legítimo", en: "Legitimate", es: "Legítimo" },
  "dash.correct": { pt: "Correto!", en: "Correct!", es: "¡Correcto!" },
  "dash.wrong": { pt: "Errado!", en: "Wrong!", es: "¡Incorrecto!" },
  "dash.next": { pt: "Próximo", en: "Next", es: "Siguiente" },
  "dash.score": { pt: "Pontuação", en: "Score", es: "Puntuación" },
  "dash.tip_title": { pt: "Dica Rápida", en: "Quick Tip", es: "Consejo Rápido" },
  "dash.tip1": { pt: "Ative a verificação em duas etapas em todas as suas contas", en: "Enable two-factor authentication on all your accounts", es: "Activa la verificación en dos pasos en todas tus cuentas" },
  "dash.tip2": { pt: "Nunca compartilhe códigos de verificação recebidos por SMS", en: "Never share verification codes received via SMS", es: "Nunca compartas códigos de verificación recibidos por SMS" },

  // Chatbot - Cyntia
  "chat.title": { pt: "CYNTIA ASSISTENTE", en: "CYNTIA ASSISTANT", es: "CYNTIA ASISTENTE" },
  "chat.subtitle": { pt: "@CYNTIA", en: "@CYNTIA", es: "@CYNTIA" },
  "chat.welcome": {
    pt: "Olá! Sou a Cyntia, assistente de segurança digital da CyberGuard. Pergunte sobre qualquer tipo de golpe ou fraude e vou te ajudar a se proteger.",
    en: "Hello! I am Cyntia, CyberGuard's digital security assistant. Ask about any type of scam or fraud and I will help you protect yourself.",
    es: "¡Hola! Soy Cyntia, asistente de seguridad digital de CyberGuard. Pregunta sobre cualquier tipo de estafa o fraude y te ayudaré a protegerte.",
  },
  "chat.placeholder": { pt: "Digite sua dúvida...", en: "Type your question...", es: "Escribe tu duda..." },
  "chat.open": { pt: "Abrir chat", en: "Open chat", es: "Abrir chat" },
  "chat.fallback": {
    pt: "Não encontrei uma resposta específica para sua pergunta. Para mais informações, entre em contato: contato@cyberguard.com.br",
    en: "I could not find a specific answer. For more information, contact us: contato@cyberguard.com.br",
    es: "No encontré una respuesta específica. Para más información, contáctenos: contato@cyberguard.com.br",
  },
  "chat.contact_info": {
    pt: "Entre em contato: contato@cyberguard.com.br",
    en: "Contact us: contato@cyberguard.com.br",
    es: "Contáctenos: contato@cyberguard.com.br",
  },

  // Antivirus page
  "av.badge": { pt: "Antivírus Gratuito", en: "Free Antivirus", es: "Antivirus Gratuito" },
  "av.title": { pt: "Defenda seu PC contra ciberameaças com nosso premiado", en: "Defend your PC against cyber threats with our award-winning", es: "Defiende tu PC contra ciberamenazas con nuestro premiado" },
  "av.title_highlight": { pt: "antivírus gratuito CyberGuard", en: "free CyberGuard antivirus", es: "antivirus gratuito CyberGuard" },
  "av.desc": {
    pt: "Proteção em tempo real contra malware, ransomware, spyware e ameaças zero-day. Leve, rápido e completamente gratuito.",
    en: "Real-time protection against malware, ransomware, spyware, and zero-day threats. Lightweight, fast, and completely free.",
    es: "Protección en tiempo real contra malware, ransomware, spyware y amenazas zero-day. Ligero, rápido y completamente gratuito.",
  },
  "av.cta": { pt: "Download Gratuito", en: "Free Download", es: "Descarga Gratuita" },
  "av.features_title": { pt: "Recursos de Proteção", en: "Protection Features", es: "Funciones de Protección" },
  "av.features_desc": {
    pt: "Tecnologia avançada para manter você seguro no mundo digital.",
    en: "Advanced technology to keep you safe in the digital world.",
    es: "Tecnología avanzada para mantenerte seguro en el mundo digital.",
  },
  "av.feat1.title": { pt: "Proteção em Tempo Real", en: "Real-Time Protection", es: "Protección en Tiempo Real" },
  "av.feat1.desc": { pt: "Monitoramento constante contra ameaças, bloqueando malware antes que infecte seu sistema.", en: "Constant threat monitoring, blocking malware before it infects your system.", es: "Monitoreo constante contra amenazas, bloqueando malware antes de que infecte tu sistema." },
  "av.feat2.title": { pt: "Análise Inteligente", en: "Smart Analysis", es: "Análisis Inteligente" },
  "av.feat2.desc": { pt: "Motor de detecção com inteligência artificial que identifica ameaças desconhecidas.", en: "AI-powered detection engine that identifies unknown threats.", es: "Motor de detección con inteligencia artificial que identifica amenazas desconocidas." },
  "av.feat3.title": { pt: "Proteção de Rede", en: "Network Protection", es: "Protección de Red" },
  "av.feat3.desc": { pt: "Firewall integrado que monitora tráfego de rede e bloqueia conexões suspeitas.", en: "Integrated firewall that monitors network traffic and blocks suspicious connections.", es: "Firewall integrado que monitorea el tráfico de red y bloquea conexiones sospechosas." },
  "av.feat4.title": { pt: "Cofre Digital", en: "Digital Vault", es: "Cofre Digital" },
  "av.feat4.desc": { pt: "Armazene seus arquivos sensíveis em uma área criptografada e protegida.", en: "Store your sensitive files in an encrypted and protected area.", es: "Almacena tus archivos sensibles en un área encriptada y protegida." },
  "av.feat5.title": { pt: "Anti-Rastreamento", en: "Anti-Tracking", es: "Anti-Rastreo" },
  "av.feat5.desc": { pt: "Bloqueie rastreadores e proteja sua privacidade durante a navegação.", en: "Block trackers and protect your privacy while browsing.", es: "Bloquea rastreadores y protege tu privacidad durante la navegación." },
  "av.feat6.title": { pt: "Atualizações Automáticas", en: "Automatic Updates", es: "Actualizaciones Automáticas" },
  "av.feat6.desc": { pt: "Base de dados de ameaças atualizada automaticamente para proteção contra as últimas ameaças.", en: "Threat database automatically updated for protection against the latest threats.", es: "Base de datos de amenazas actualizada automáticamente para protección contra las últimas amenazas." },
  "av.cta_title": { pt: "Pronto para se proteger?", en: "Ready to protect yourself?", es: "¿Listo para protegerte?" },
  "av.cta_desc": { pt: "Baixe o CyberGuard Antivírus gratuitamente e tenha proteção completa para o seu computador.", en: "Download CyberGuard Antivirus for free and get complete protection for your computer.", es: "Descarga CyberGuard Antivirus gratis y ten protección completa para tu computadora." },

  // Services page
  "svc.title": { pt: "Nossos", en: "Our", es: "Nuestros" },
  "svc.title_highlight": { pt: "Serviços", en: "Services", es: "Servicios" },
  "svc.subtitle": { pt: "Ferramentas e recursos para proteger sua vida digital.", en: "Tools and resources to protect your digital life.", es: "Herramientas y recursos para proteger tu vida digital." },
  "svc.guide_title": { pt: "Guia de Informações", en: "Information Guide", es: "Guía de Información" },
  "svc.guide1.title": { pt: "Dicas para Redes Sociais", en: "Social Media Tips", es: "Consejos para Redes Sociales" },
  "svc.guide1.desc": { pt: "Aprenda a configurar a privacidade das suas redes sociais, evitar perfis falsos e proteger suas informações pessoais contra engenharia social.", en: "Learn to configure your social media privacy, avoid fake profiles, and protect your personal information against social engineering.", es: "Aprende a configurar la privacidad de tus redes sociales, evitar perfiles falsos y proteger tu información personal contra ingeniería social." },
  "svc.guide2.title": { pt: "Segurança em Pagamentos", en: "Payment Security", es: "Seguridad en Pagos" },
  "svc.guide2.desc": { pt: "Saiba como verificar sites de compras, usar cartões virtuais, identificar boletos falsos e proteger suas transações financeiras online.", en: "Learn how to verify shopping sites, use virtual cards, identify fake invoices, and protect your online financial transactions.", es: "Aprende a verificar sitios de compras, usar tarjetas virtuales, identificar boletos falsos y proteger tus transacciones financieras online." },
  "svc.guide3.title": { pt: "E-mails Fraudulentos", en: "Fraudulent Emails", es: "Correos Fraudulentos" },
  "svc.guide3.desc": { pt: "Identifique características de e-mails de phishing, verifique remetentes suspeitos e proteja-se contra anexos maliciosos e links falsos.", en: "Identify phishing email characteristics, verify suspicious senders, and protect yourself against malicious attachments and fake links.", es: "Identifica características de correos de phishing, verifica remitentes sospechosos y protégete contra archivos adjuntos maliciosos y enlaces falsos." },
  "svc.vuln_title": { pt: "Teste de Vulnerabilidade", en: "Vulnerability Test", es: "Prueba de Vulnerabilidad" },
  "svc.vuln_desc": { pt: "O teste de vulnerabilidade é uma análise estruturada que identifica, classifica e prioriza fraquezas de segurança em sistemas, redes e aplicações sem explorá-las ativamente.", en: "A vulnerability test is a structured analysis that identifies, classifies, and prioritizes security weaknesses in systems, networks, and applications without actively exploiting them.", es: "La prueba de vulnerabilidad es un análisis estructurado que identifica, clasifica y prioriza debilidades de seguridad en sistemas, redes y aplicaciones sin explotarlas activamente." },
  "svc.vuln_detail": { pt: "Ele funciona como um raio-x para detectar softwares obsoletos, configurações incorretas e falhas conhecidas, gerando relatórios para correção preventiva e mitigação de riscos.", en: "It works as an X-ray to detect obsolete software, incorrect configurations, and known flaws, generating reports for preventive correction and risk mitigation.", es: "Funciona como una radiografía para detectar software obsoleto, configuraciones incorrectas y fallas conocidas, generando informes para corrección preventiva y mitigación de riesgos." },
  "svc.lgpd_title": { pt: "LGPD e Vazamento de Dados", en: "LGPD & Data Breaches", es: "LGPD y Fuga de Datos" },
  "svc.lgpd_card_title": { pt: "LGPD — Lei Geral de Proteção de Dados", en: "LGPD — General Data Protection Law", es: "LGPD — Ley General de Protección de Datos" },
  "svc.lgpd_card_desc": { pt: "A LGPD é a legislação brasileira que estabelece regras para a coleta, armazenamento, tratamento e compartilhamento de dados pessoais, com o objetivo de proteger a privacidade e os direitos fundamentais dos cidadãos. Ela garante que empresas e órgãos públicos usem essas informações com transparência, consentimento e segurança, permitindo que você saiba o que é coletado, corrija, bloqueie ou peça a eliminação dos seus dados.", en: "The LGPD is the Brazilian legislation that establishes rules for the collection, storage, processing, and sharing of personal data, with the aim of protecting the privacy and fundamental rights of citizens. It ensures that companies and public bodies use this information with transparency, consent, and security.", es: "La LGPD es la legislación brasileña que establece reglas para la recolección, almacenamiento, tratamiento y compartición de datos personales, con el objetivo de proteger la privacidad y los derechos fundamentales de los ciudadanos." },
  "svc.vazamento_card_title": { pt: "Vazamento de Dados", en: "Data Breaches", es: "Fuga de Datos" },
  "svc.vazamento_card_desc": { pt: "Vazamentos de dados ocorrem quando informações pessoais ou confidenciais são acessadas, copiadas ou divulgadas sem autorização. Dados de CPFs, cartões e senhas tornam-se alvos para fraudes. As principais causas incluem ataques de hackers, negligência humana e configurações de segurança mal feitas. Os riscos envolvem roubo de identidade, fraudes financeiras, phishing e venda de dados no mercado negro.", en: "Data breaches occur when personal or confidential information is accessed, copied, or disclosed without authorization. CPF data, cards, and passwords become targets for fraud. Main causes include hacker attacks, human negligence, and poor security configurations.", es: "Las fugas de datos ocurren cuando información personal o confidencial es accedida, copiada o divulgada sin autorización. Datos de documentos, tarjetas y contraseñas se convierten en objetivos para fraudes." },

  // Experts page
  "exp.title": { pt: "Converse com nossos", en: "Talk to our", es: "Habla con nuestros" },
  "exp.title_highlight": { pt: "Especialistas", en: "Experts", es: "Especialistas" },
  "exp.subtitle": { pt: "Conecte-se com profissionais de cibersegurança para orientação personalizada.", en: "Connect with cybersecurity professionals for personalized guidance.", es: "Conéctate con profesionales de ciberseguridad para orientación personalizada." },
  "exp.our_experts": { pt: "Nossos Especialistas", en: "Our Experts", es: "Nuestros Especialistas" },
  "exp.available": { pt: "Disponível", en: "Available", es: "Disponible" },
  "exp.unavailable": { pt: "Indisponível", en: "Unavailable", es: "No disponible" },
  "exp.schedule": { pt: "Agendar Consulta", en: "Schedule Consultation", es: "Agendar Consulta" },
  "exp.confirm": { pt: "Confirmar Agendamento", en: "Confirm Booking", es: "Confirmar Agendamiento" },
  "exp.chat": { pt: "Chat com Especialista", en: "Chat with Expert", es: "Chat con Especialista" },
  "exp.chat_example": { pt: "Olá! Como posso ajudar com sua segurança digital hoje?", en: "Hello! How can I help with your digital security today?", es: "¡Hola! ¿Cómo puedo ayudarte con tu seguridad digital hoy?" },
  "exp.chat_placeholder": { pt: "Digite sua mensagem...", en: "Type your message...", es: "Escribe tu mensaje..." },
  "exp.send": { pt: "Enviar", en: "Send", es: "Enviar" },
  "exp.videos": { pt: "Vídeos de Instrução", en: "Instructional Videos", es: "Videos de Instrucción" },

  // Blog page
  "blog.title": { pt: "Blog", en: "Blog", es: "Blog" },
  "blog.title_highlight": { pt: "CyberGuard", en: "CyberGuard", es: "CyberGuard" },
  "blog.subtitle": { pt: "Artigos e notícias sobre cibersegurança para manter você informado e protegido.", en: "Articles and news about cybersecurity to keep you informed and protected.", es: "Artículos y noticias sobre ciberseguridad para mantenerte informado y protegido." },
  "blog.read_more": { pt: "Ler mais", en: "Read more", es: "Leer más" },
  "blog.post1.title": { pt: "Como proteger seu WhatsApp em 2026", en: "How to protect your WhatsApp in 2026", es: "Cómo proteger tu WhatsApp en 2026" },
  "blog.post1.summary": { pt: "Dicas essenciais para evitar clonagem e invasão da sua conta.", en: "Essential tips to avoid cloning and hacking your account.", es: "Consejos esenciales para evitar la clonación e invasión de tu cuenta." },
  "blog.post2.title": { pt: "Os 5 golpes mais comuns via Pix", en: "The 5 most common Pix scams", es: "Las 5 estafas más comunes vía Pix" },
  "blog.post2.summary": { pt: "Conheça as táticas mais usadas por criminosos e como se proteger.", en: "Learn about the most used tactics by criminals and how to protect yourself.", es: "Conoce las tácticas más usadas por criminales y cómo protegerte." },
  "blog.post3.title": { pt: "LGPD: seus direitos sobre seus dados", en: "LGPD: your rights over your data", es: "LGPD: tus derechos sobre tus datos" },
  "blog.post3.summary": { pt: "Entenda o que a lei garante e como exercer seus direitos.", en: "Understand what the law guarantees and how to exercise your rights.", es: "Entiende lo que la ley garantiza y cómo ejercer tus derechos." },
  "blog.post4.title": { pt: "Senhas seguras: guia definitivo", en: "Secure passwords: definitive guide", es: "Contraseñas seguras: guía definitiva" },
  "blog.post4.summary": { pt: "Aprenda a criar e gerenciar senhas que realmente protegem.", en: "Learn to create and manage passwords that truly protect.", es: "Aprende a crear y gestionar contraseñas que realmente protejan." },
  "blog.post5.title": { pt: "Engenharia social: a ameaça invisível", en: "Social engineering: the invisible threat", es: "Ingeniería social: la amenaza invisible" },
  "blog.post5.summary": { pt: "Como criminosos manipulam pessoas para obter informações.", en: "How criminals manipulate people to obtain information.", es: "Cómo los criminales manipulan personas para obtener información." },
  "blog.post6.title": { pt: "Antivírus em 2026: ainda é necessário?", en: "Antivirus in 2026: is it still necessary?", es: "¿Antivirus en 2026: sigue siendo necesario?" },
  "blog.post6.summary": { pt: "Análise sobre a importância dos antivírus nos dias atuais.", en: "Analysis on the importance of antivirus software today.", es: "Análisis sobre la importancia de los antivirus en la actualidad." },

  // Policies page
  "pol.title": { pt: "Políticas e Termos", en: "Policies & Terms", es: "Políticas y Términos" },
  "pol.terms_title": { pt: "Termos de Uso", en: "Terms of Use", es: "Términos de Uso" },
  "pol.terms_text": { pt: "Ao utilizar o site CyberGuard, você concorda com estes termos de uso. O conteúdo deste site tem caráter educativo e informativo. Não nos responsabilizamos por decisões tomadas com base nas informações aqui disponibilizadas. O uso do site e de suas ferramentas é de inteira responsabilidade do usuário. Reservamo-nos o direito de modificar estes termos a qualquer momento.", en: "By using the CyberGuard website, you agree to these terms of use. The content of this site is educational and informational. We are not responsible for decisions made based on the information provided here. The use of the site and its tools is the user's full responsibility.", es: "Al utilizar el sitio CyberGuard, usted acepta estos términos de uso. El contenido de este sitio tiene carácter educativo e informativo. No nos responsabilizamos por decisiones tomadas con base en la información aquí proporcionada." },
  "pol.privacy_title": { pt: "Política de Privacidade", en: "Privacy Policy", es: "Política de Privacidad" },
  "pol.privacy_text": { pt: "A CyberGuard respeita sua privacidade. Coletamos apenas dados necessários para o funcionamento do site, como e-mail para cadastro. Não compartilhamos seus dados com terceiros. Utilizamos cookies para melhorar sua experiência de navegação. Você pode solicitar a exclusão dos seus dados a qualquer momento entrando em contato conosco.", en: "CyberGuard respects your privacy. We only collect data necessary for the site's operation, such as email for registration. We do not share your data with third parties. We use cookies to improve your browsing experience. You can request the deletion of your data at any time by contacting us.", es: "CyberGuard respeta su privacidad. Solo recopilamos datos necesarios para el funcionamiento del sitio. No compartimos sus datos con terceros. Utilizamos cookies para mejorar su experiencia de navegación." },
  "pol.lgpd_title": { pt: "LGPD — Seus Direitos", en: "LGPD — Your Rights", es: "LGPD — Sus Derechos" },
  "pol.lgpd_text": { pt: "De acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a: confirmação da existência de tratamento de seus dados; acesso aos dados; correção de dados incompletos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade dos dados; eliminação dos dados pessoais tratados com seu consentimento; e revogação do consentimento.", en: "According to the General Data Protection Law (Law 13.709/2018), you have the right to: confirmation of the existence of processing of your data; access to data; correction of incomplete or outdated data; anonymization, blocking, or deletion of unnecessary data; data portability; deletion of personal data processed with your consent; and revocation of consent.", es: "De acuerdo con la Ley General de Protección de Datos (Ley 13.709/2018), usted tiene derecho a: confirmación de la existencia de tratamiento de sus datos; acceso a los datos; corrección de datos incompletos o desactualizados; anonimización, bloqueo o eliminación de datos innecesarios." },

  // Services dropdown - Assinaturas
  "srv.assinaturas": { pt: "Assinaturas", en: "Subscriptions", es: "Suscripciones" },

  // Subscription page
  "sub.choose_plan": { pt: "Escolha seu plano", en: "Choose your plan", es: "Elige tu plan" },
  "sub.benefit_1": { pt: "Sem compromisso, cancele quando quiser", en: "No commitment, cancel anytime", es: "Sin compromiso, cancela cuando quieras" },
  "sub.benefit_2": { pt: "Proteção completa para seus dispositivos", en: "Complete protection for your devices", es: "Protección completa para tus dispositivos" },
  "sub.benefit_3": { pt: "Monitore sua segurança em todos os aparelhos", en: "Monitor your security on all devices", es: "Monitorea tu seguridad en todos los dispositivos" },
  "sub.next": { pt: "Próximo", en: "Next", es: "Siguiente" },
  "sub.back": { pt: "Voltar", en: "Back", es: "Volver" },
  "sub.select_plan": { pt: "Selecione o melhor plano para você", en: "Select the best plan for you", es: "Selecciona el mejor plan para ti" },
  "sub.plan_basic": { pt: "Básico", en: "Basic", es: "Básico" },
  "sub.plan_standard": { pt: "Padrão", en: "Standard", es: "Estándar" },
  "sub.protection_essential": { pt: "Proteção essencial", en: "Essential protection", es: "Protección esencial" },
  "sub.protection_advanced": { pt: "Proteção avançada", en: "Advanced protection", es: "Protección avanzada" },
  "sub.protection_total": { pt: "Proteção total", en: "Total protection", es: "Protección total" },
  "sub.device_1": { pt: "1 dispositivo", en: "1 device", es: "1 dispositivo" },
  "sub.device_3": { pt: "3 dispositivos", en: "3 devices", es: "3 dispositivos" },
  "sub.device_unlimited": { pt: "Dispositivos ilimitados", en: "Unlimited devices", es: "Dispositivos ilimitados" },
  "sub.feat_realtime": { pt: "Proteção em tempo real", en: "Real-time protection", es: "Protección en tiempo real" },
  "sub.feat_malware": { pt: "Detecção de malware", en: "Malware detection", es: "Detección de malware" },
  "sub.feat_updates": { pt: "Atualizações automáticas", en: "Automatic updates", es: "Actualizaciones automáticas" },
  "sub.feat_firewall": { pt: "Firewall avançado", en: "Advanced firewall", es: "Firewall avanzado" },
  "sub.feat_antiphishing": { pt: "Anti-phishing", en: "Anti-phishing", es: "Anti-phishing" },
  "sub.feat_vpn": { pt: "VPN inclusa", en: "VPN included", es: "VPN incluida" },
  "sub.feat_vault": { pt: "Cofre digital", en: "Digital vault", es: "Cofre digital" },
  "sub.popular": { pt: "Mais popular", en: "Most popular", es: "Más popular" },
  "sub.month": { pt: "mês", en: "month", es: "mes" },
  "sub.finish_setup": { pt: "Termine de configurar sua conta", en: "Finish setting up your account", es: "Termina de configurar tu cuenta" },
  "sub.password": { pt: "Senha", en: "Password", es: "Contraseña" },
  "sub.confirm_title": { pt: "Confirmação de assinatura", en: "Subscription confirmation", es: "Confirmación de suscripción" },
  "sub.plan_label": { pt: "Plano", en: "Plan", es: "Plan" },
  "sub.price_label": { pt: "Preço", en: "Price", es: "Precio" },
  "sub.devices_label": { pt: "Dispositivos", en: "Devices", es: "Dispositivos" },
  "sub.subscribe": { pt: "Assinar", en: "Subscribe", es: "Suscribir" },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "pt",
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("pt");

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
