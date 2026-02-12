import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "pt" | "en" | "es";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Header
  "nav.inicio": { pt: "Inicio", en: "Home", es: "Inicio" },
  "nav.blog": { pt: "Blog", en: "Blog", es: "Blog" },
  "nav.cursos": { pt: "Cursos", en: "Courses", es: "Cursos" },
  "nav.servicos": { pt: "Servicos", en: "Services", es: "Servicios" },
  "nav.sobre": { pt: "Sobre", en: "About", es: "Acerca" },
  "nav.contato": { pt: "Contato", en: "Contact", es: "Contacto" },
  "nav.login": { pt: "Login / Cadastrar", en: "Login / Sign Up", es: "Login / Registro" },
  "nav.email_placeholder": { pt: "Seu e-mail", en: "Your email", es: "Tu correo" },
  "nav.email_invalid": { pt: "E-mail invalido", en: "Invalid email", es: "Correo invalido" },
  "nav.email_success": { pt: "E-mail cadastrado com sucesso", en: "Email registered successfully", es: "Correo registrado con exito" },

  // Services dropdown
  "srv.testa_pix": { pt: "Testa PIX", en: "Test PIX", es: "Probar PIX" },
  "srv.verificador_link": { pt: "Verificador de Link", en: "Link Checker", es: "Verificador de Enlace" },
  "srv.verificador_email": { pt: "Verificador de E-mail", en: "Email Checker", es: "Verificador de Correo" },
  "srv.verificador_seguranca": { pt: "Verificador de Seguranca", en: "Security Checker", es: "Verificador de Seguridad" },
  "srv.guia_informacoes": { pt: "Guia de Informacoes", en: "Info Guide", es: "Guia de Informacion" },
  "srv.teste_vulnerabilidades": { pt: "Teste de Vulnerabilidades", en: "Vulnerability Test", es: "Prueba de Vulnerabilidades" },
  "srv.lgpd": { pt: "LGPD", en: "LGPD", es: "LGPD" },
  "srv.vazamento_dados": { pt: "Vazamento de Dados", en: "Data Breach", es: "Fuga de Datos" },
  "srv.dicas_protecao": { pt: "Dicas de Protecao", en: "Protection Tips", es: "Consejos de Proteccion" },
  "srv.conversa_especialistas": { pt: "Conversa com Especialistas", en: "Talk to Experts", es: "Hablar con Expertos" },

  // Accessibility
  "a11y.title": { pt: "Acessibilidade", en: "Accessibility", es: "Accesibilidad" },
  "a11y.screen_reader": { pt: "Leitor de Tela", en: "Screen Reader", es: "Lector de Pantalla" },
  "a11y.high_contrast": { pt: "Alto Contraste", en: "High Contrast", es: "Alto Contraste" },
  "a11y.grayscale": { pt: "Tela P&B", en: "Grayscale", es: "Escala de Grises" },
  "a11y.font_size": { pt: "Tamanho da Fonte", en: "Font Size", es: "Tamano de Fuente" },
  "a11y.dark_mode": { pt: "Modo Escuro", en: "Dark Mode", es: "Modo Oscuro" },
  "a11y.light_mode": { pt: "Modo Claro", en: "Light Mode", es: "Modo Claro" },
  "a11y.highlight_links": { pt: "Destacar Links", en: "Highlight Links", es: "Resaltar Enlaces" },
  "a11y.increase": { pt: "Aumentar", en: "Increase", es: "Aumentar" },
  "a11y.decrease": { pt: "Diminuir", en: "Decrease", es: "Disminuir" },

  // Hero Carousel
  "hero.slide1.title": {
    pt: "Voce confia em quem esta do outro lado da tela?",
    en: "Do you trust who is on the other side of the screen?",
    es: "Confias en quien esta al otro lado de la pantalla?",
  },
  "hero.slide1.desc": {
    pt: "A cada 6 segundos, alguem cai em um golpe digital no Brasil. O proximo pode ser voce ou alguem que voce ama.",
    en: "Every 6 seconds, someone falls for a digital scam in Brazil. You or someone you love could be next.",
    es: "Cada 6 segundos, alguien cae en una estafa digital en Brasil. El proximo puedes ser tu o alguien que amas.",
  },
  "hero.slide2.title": {
    pt: "Aquela mensagem urgente pode custar tudo que voce tem",
    en: "That urgent message could cost you everything you have",
    es: "Ese mensaje urgente puede costarte todo lo que tienes",
  },
  "hero.slide2.desc": {
    pt: "Criminosos usam o medo e a pressa para roubar seu dinheiro. Aprenda a reconhecer os sinais antes que seja tarde.",
    en: "Criminals use fear and urgency to steal your money. Learn to recognize the signs before it is too late.",
    es: "Los criminales usan el miedo y la prisa para robar tu dinero. Aprende a reconocer las senales antes de que sea tarde.",
  },
  "hero.slide3.title": {
    pt: "Seus dados ja podem estar nas maos erradas",
    en: "Your data may already be in the wrong hands",
    es: "Tus datos ya pueden estar en las manos equivocadas",
  },
  "hero.slide3.desc": {
    pt: "Nome, CPF, senhas: tudo pode ser roubado sem voce perceber. Descubra como blindar sua vida digital agora.",
    en: "Name, ID, passwords: everything can be stolen without you noticing. Discover how to protect your digital life now.",
    es: "Nombre, documento, contrasenas: todo puede ser robado sin que lo notes. Descubre como proteger tu vida digital ahora.",
  },
  "hero.cta": { pt: "Saiba Mais", en: "Learn More", es: "Saber Mas" },

  // Stats Section
  "stats.title": { pt: "Numeros que voce", en: "Numbers you", es: "Numeros que" },
  "stats.title_highlight": { pt: "precisa conhecer", en: "need to know", es: "necesitas conocer" },
  "stats.subtitle": {
    pt: "Os dados abaixo mostram a realidade das fraudes digitais no Brasil e no mundo. Sao numeros reais, de fontes oficiais, que revelam o tamanho desse problema.",
    en: "The data below shows the reality of digital fraud in Brazil and worldwide. These are real numbers from official sources that reveal the scale of this problem.",
    es: "Los datos a continuacion muestran la realidad del fraude digital en Brasil y en el mundo. Son numeros reales de fuentes oficiales que revelan la magnitud del problema.",
  },
  "stats.subtitle2": {
    pt: "Quanto mais voce souber, mais dificil sera para um criminoso te enganar.",
    en: "The more you know, the harder it will be for a criminal to deceive you.",
    es: "Cuanto mas sepas, mas dificil sera para un criminal enganarte.",
  },
  "stats.source": { pt: "Fonte", en: "Source", es: "Fuente" },

  "stats.0.value": { pt: "R$ 2,5 bilhoes", en: "R$ 2.5 billion", es: "R$ 2.500 millones" },
  "stats.0.label": { pt: "Perdas com fraudes bancarias digitais em 2024", en: "Losses from digital banking fraud in 2024", es: "Perdidas por fraude bancario digital en 2024" },
  "stats.1.value": { pt: "1 em cada 3", en: "1 in 3", es: "1 de cada 3" },
  "stats.1.label": { pt: "brasileiros ja foi vitima de algum golpe digital", en: "Brazilians have been victims of a digital scam", es: "brasilenos han sido victimas de alguna estafa digital" },
  "stats.2.value": { pt: "+65%", en: "+65%", es: "+65%" },
  "stats.2.label": { pt: "aumento nos golpes via Pix desde 2022", en: "increase in Pix scams since 2022", es: "aumento en estafas via Pix desde 2022" },
  "stats.3.value": { pt: "3,4 milhoes", en: "3.4 million", es: "3,4 millones" },
  "stats.3.label": { pt: "tentativas de fraude com cartao de credito por ano", en: "credit card fraud attempts per year", es: "intentos de fraude con tarjeta de credito por ano" },
  "stats.4.value": { pt: "208 mil", en: "208 thousand", es: "208 mil" },
  "stats.4.label": { pt: "registros de phishing no Brasil em 2024", en: "phishing records in Brazil in 2024", es: "registros de phishing en Brasil en 2024" },
  "stats.5.value": { pt: "US$ 10,3 trilhoes", en: "US$ 10.3 trillion", es: "US$ 10,3 billones" },
  "stats.5.label": { pt: "custo global estimado do cibercrime ate 2025", en: "estimated global cost of cybercrime by 2025", es: "costo global estimado del cibercrimen hasta 2025" },

  // Parallax
  "parallax.title": {
    pt: "Proteja-se. Informe-se. Nao seja a proxima vitima.",
    en: "Protect yourself. Stay informed. Do not be the next victim.",
    es: "Protegete. Informate. No seas la proxima victima.",
  },
  "parallax.desc": {
    pt: "O conhecimento e sua maior arma contra os golpes digitais.",
    en: "Knowledge is your greatest weapon against digital scams.",
    es: "El conocimiento es tu mayor arma contra las estafas digitales.",
  },

  // FlipCards Section
  "flip.title": { pt: "Voce sabe", en: "Do you know how to", es: "Sabes" },
  "flip.title_highlight": { pt: "reconhecer um golpe?", en: "recognize a scam?", es: "reconocer una estafa?" },
  "flip.subtitle": {
    pt: "Conheca os tipos de fraude mais comuns e aprenda a identificar cada um deles antes que seja tarde.",
    en: "Learn about the most common types of fraud and how to identify each one before it is too late.",
    es: "Conoce los tipos de fraude mas comunes y aprende a identificar cada uno antes de que sea tarde.",
  },
  "flip.hover": { pt: "Passe o mouse para saber mais", en: "Hover to learn more", es: "Pasa el mouse para saber mas" },

  "flip.0.title": { pt: "Golpe do Pix", en: "Pix Scam", es: "Estafa del Pix" },
  "flip.0.back": {
    pt: "Criminosos se passam por conhecidos ou empresas e pedem transferencias urgentes via Pix. Sempre confirme por ligacao antes de enviar qualquer valor.",
    en: "Criminals impersonate acquaintances or companies and request urgent Pix transfers. Always confirm by phone before sending any amount.",
    es: "Los criminales se hacen pasar por conocidos o empresas y piden transferencias urgentes via Pix. Siempre confirma por telefono antes de enviar cualquier monto.",
  },
  "flip.1.title": { pt: "Phishing", en: "Phishing", es: "Phishing" },
  "flip.1.back": {
    pt: "Mensagens falsas por e-mail, SMS ou redes sociais imitam bancos e lojas. O objetivo e roubar suas senhas e dados bancarios. Nunca clique em links suspeitos.",
    en: "Fake messages via email, SMS or social media imitate banks and stores. The goal is to steal your passwords and bank data. Never click on suspicious links.",
    es: "Mensajes falsos por correo, SMS o redes sociales imitan bancos y tiendas. El objetivo es robar tus contrasenas y datos bancarios. Nunca hagas clic en enlaces sospechosos.",
  },
  "flip.2.title": { pt: "Clonagem de WhatsApp", en: "WhatsApp Cloning", es: "Clonacion de WhatsApp" },
  "flip.2.back": {
    pt: "Golpistas clonam seu numero e pedem dinheiro aos seus contatos. Ative a verificacao em duas etapas no WhatsApp para se proteger.",
    en: "Scammers clone your number and ask your contacts for money. Enable two-step verification on WhatsApp to protect yourself.",
    es: "Los estafadores clonan tu numero y piden dinero a tus contactos. Activa la verificacion en dos pasos en WhatsApp para protegerte.",
  },
  "flip.3.title": { pt: "Falso Boleto", en: "Fake Invoice", es: "Boleto Falso" },
  "flip.3.back": {
    pt: "Boletos adulterados desviam seu pagamento para contas de criminosos. Sempre confira os dados do beneficiario antes de pagar.",
    en: "Tampered invoices redirect your payment to criminal accounts. Always check the beneficiary details before paying.",
    es: "Boletos adulterados desvian tu pago a cuentas de criminales. Siempre verifica los datos del beneficiario antes de pagar.",
  },
  "flip.4.title": { pt: "Falsa Central de Atendimento", en: "Fake Call Center", es: "Falso Centro de Atencion" },
  "flip.4.back": {
    pt: "Ligacoes que fingem ser do seu banco pedem senhas e codigos. Bancos nunca pedem senha por telefone. Desligue e ligue voce mesmo para o numero oficial.",
    en: "Calls pretending to be from your bank ask for passwords and codes. Banks never ask for passwords by phone. Hang up and call the official number yourself.",
    es: "Llamadas que fingen ser de tu banco piden contrasenas y codigos. Los bancos nunca piden contrasenas por telefono. Cuelga y llama tu mismo al numero oficial.",
  },
  "flip.5.title": { pt: "Golpe do Emprego Falso", en: "Fake Job Scam", es: "Estafa del Empleo Falso" },
  "flip.5.back": {
    pt: "Vagas falsas pedem pagamento antecipado ou seus documentos pessoais. Empresas serias nunca cobram para contratar. Desconfie de ofertas boas demais.",
    en: "Fake jobs ask for upfront payment or personal documents. Serious companies never charge to hire. Be suspicious of offers that are too good.",
    es: "Empleos falsos piden pago anticipado o documentos personales. Las empresas serias nunca cobran para contratar. Desconfia de ofertas demasiado buenas.",
  },

  // ScamResponse Section
  "scam.title": { pt: "Cai em um golpe.", en: "Fell for a scam.", es: "Cai en una estafa." },
  "scam.title2": { pt: "O que fazer?", en: "What to do?", es: "Que hacer?" },
  "scam.subtitle": {
    pt: "Se voce ou alguem proximo foi vitima, cada minuto conta. Veja os passos que podem salvar seu dinheiro e seus dados.",
    en: "If you or someone close was a victim, every minute counts. See the steps that can save your money and data.",
    es: "Si tu o alguien cercano fue victima, cada minuto cuenta. Mira los pasos que pueden salvar tu dinero y tus datos.",
  },
  "scam.hover": { pt: "Passe o mouse para saber mais", en: "Hover to learn more", es: "Pasa el mouse para saber mas" },

  "scam.0.title": { pt: "Bloqueie suas contas bancarias", en: "Block your bank accounts", es: "Bloquea tus cuentas bancarias" },
  "scam.0.back": {
    pt: "Ligue imediatamente para o seu banco e peca o bloqueio temporario das contas e cartoes. Quanto mais rapido agir, maiores as chances de impedir movimentacoes indevidas.",
    en: "Call your bank immediately and request a temporary block on accounts and cards. The faster you act, the greater the chances of preventing unauthorized transactions.",
    es: "Llama inmediatamente a tu banco y pide el bloqueo temporal de cuentas y tarjetas. Cuanto mas rapido actues, mayores las posibilidades de evitar movimientos indebidos.",
  },
  "scam.1.title": { pt: "Registre um Boletim de Ocorrencia", en: "File a Police Report", es: "Registra un Informe Policial" },
  "scam.1.back": {
    pt: "Procure a delegacia mais proxima ou faca o registro online. O boletim de ocorrencia e essencial para investigacoes e para contestar transacoes fraudulentas.",
    en: "Go to the nearest police station or file a report online. The police report is essential for investigations and to dispute fraudulent transactions.",
    es: "Acude a la comisaria mas cercana o haz el registro en linea. El informe policial es esencial para investigaciones y para impugnar transacciones fraudulentas.",
  },
  "scam.2.title": { pt: "Avise seus contatos", en: "Warn your contacts", es: "Avisa a tus contactos" },
  "scam.2.back": {
    pt: "Se seus dados ou contas foram comprometidos, avise familiares e amigos para que ninguem caia em golpes usando seu nome ou numero.",
    en: "If your data or accounts were compromised, warn family and friends so no one falls for scams using your name or number.",
    es: "Si tus datos o cuentas fueron comprometidos, avisa a familiares y amigos para que nadie caiga en estafas usando tu nombre o numero.",
  },
  "scam.3.title": { pt: "Troque todas as suas senhas", en: "Change all your passwords", es: "Cambia todas tus contrasenas" },
  "scam.3.back": {
    pt: "Altere as senhas de e-mail, redes sociais, bancos e qualquer servico que possa ter sido exposto. Use senhas fortes e diferentes para cada conta.",
    en: "Change passwords for email, social media, banks, and any service that may have been exposed. Use strong, unique passwords for each account.",
    es: "Cambia las contrasenas de correo, redes sociales, bancos y cualquier servicio que pueda haber sido expuesto. Usa contrasenas fuertes y diferentes para cada cuenta.",
  },
  "scam.4.title": { pt: "Denuncie nos orgaos competentes", en: "Report to authorities", es: "Denuncia ante las autoridades" },
  "scam.4.back": {
    pt: "Alem da policia, denuncie no Procon, Banco Central e sites como consumidor.gov.br. Quanto mais denuncias, mais facil identificar e punir os criminosos.",
    en: "Besides the police, report to consumer protection agencies and central bank. The more reports, the easier to identify and punish criminals.",
    es: "Ademas de la policia, denuncia en agencias de proteccion al consumidor y banco central. Cuantas mas denuncias, mas facil identificar y castigar a los criminales.",
  },
  "scam.5.title": { pt: "Monitore seus dados", en: "Monitor your data", es: "Monitorea tus datos" },
  "scam.5.back": {
    pt: "Fique atento a movimentacoes estranhas nas suas contas e no seu CPF. Use servicos de monitoramento de credito e ative alertas no seu banco.",
    en: "Watch for unusual activity in your accounts and ID. Use credit monitoring services and enable alerts at your bank.",
    es: "Estate atento a movimientos extranos en tus cuentas y documento. Usa servicios de monitoreo de credito y activa alertas en tu banco.",
  },

  // Quiz
  "quiz.title": { pt: "Quiz", en: "Quiz", es: "Quiz" },
  "quiz.title_highlight": { pt: "AntiGolpe", en: "Anti-Scam", es: "AntiEstafa" },
  "quiz.subtitle": { pt: "Teste seus conhecimentos sobre seguranca digital", en: "Test your knowledge about digital security", es: "Pon a prueba tus conocimientos sobre seguridad digital" },
  "quiz.question_of": { pt: "Pergunta", en: "Question", es: "Pregunta" },
  "quiz.of": { pt: "de", en: "of", es: "de" },
  "quiz.points": { pt: "Pontos", en: "Points", es: "Puntos" },
  "quiz.next": { pt: "Proxima Pergunta", en: "Next Question", es: "Siguiente Pregunta" },
  "quiz.see_result": { pt: "Ver Resultado", en: "See Result", es: "Ver Resultado" },
  "quiz.result_title": { pt: "Resultado do Quiz", en: "Quiz Result", es: "Resultado del Quiz" },
  "quiz.restart": { pt: "Refazer Quiz", en: "Retake Quiz", es: "Rehacer Quiz" },
  "quiz.feedback_good": { pt: "Excelente! Voce domina seguranca digital.", en: "Excellent! You master digital security.", es: "Excelente! Dominas la seguridad digital." },
  "quiz.feedback_medium": { pt: "Bom resultado, mas ainda ha o que aprender. Continue atento.", en: "Good result, but there is still more to learn. Stay alert.", es: "Buen resultado, pero aun hay mas por aprender. Mantente alerta." },
  "quiz.feedback_bad": {
    pt: "Voce esta vulneravel a golpes. Isso e serio. Revise as informacoes acima e aprenda a se proteger antes que seja tarde.",
    en: "You are vulnerable to scams. This is serious. Review the information above and learn to protect yourself before it is too late.",
    es: "Eres vulnerable a estafas. Esto es serio. Revisa la informacion y aprende a protegerte antes de que sea tarde.",
  },
  "quiz.tip1": { pt: "Use autenticacao de dois fatores sempre que possivel", en: "Use two-factor authentication whenever possible", es: "Usa autenticacion de dos factores siempre que sea posible" },
  "quiz.tip2": { pt: "Nunca compartilhe senhas ou codigos de verificacao", en: "Never share passwords or verification codes", es: "Nunca compartas contrasenas o codigos de verificacion" },
  "quiz.tip3": { pt: "Desconfie de ofertas boas demais para ser verdade", en: "Be suspicious of offers too good to be true", es: "Desconfia de ofertas demasiado buenas para ser verdad" },
  "quiz.tip4": { pt: "Verifique a URL antes de inserir dados pessoais", en: "Check the URL before entering personal data", es: "Verifica la URL antes de ingresar datos personales" },

  "quiz.q0": {
    pt: "Voce recebe um SMS do seu banco pedindo para clicar em um link e atualizar seus dados. O que fazer?",
    en: "You receive an SMS from your bank asking you to click a link and update your data. What to do?",
    es: "Recibes un SMS de tu banco pidiendo hacer clic en un enlace y actualizar tus datos. Que hacer?",
  },
  "quiz.q0.o0": { pt: "Clicar no link imediatamente para nao perder acesso", en: "Click the link immediately to not lose access", es: "Hacer clic en el enlace inmediatamente para no perder acceso" },
  "quiz.q0.o1": { pt: "Ignorar e entrar no app oficial do banco para verificar", en: "Ignore and open the official bank app to verify", es: "Ignorar y entrar en la app oficial del banco para verificar" },
  "quiz.q0.o2": { pt: "Responder o SMS com seus dados", en: "Reply to the SMS with your data", es: "Responder el SMS con tus datos" },
  "quiz.q0.o3": { pt: "Encaminhar para amigos para alerta-los", en: "Forward to friends to alert them", es: "Reenviar a amigos para alertarlos" },
  "quiz.q0.exp": { pt: "Bancos nunca pedem dados por SMS com links. Sempre acesse o app oficial ou ligue para a central.", en: "Banks never request data via SMS with links. Always use the official app or call the hotline.", es: "Los bancos nunca piden datos por SMS con enlaces. Siempre usa la app oficial o llama a la central." },

  "quiz.q1": {
    pt: "Qual destes e um sinal claro de golpe de phishing?",
    en: "Which of these is a clear sign of a phishing scam?",
    es: "Cual de estos es una senal clara de estafa de phishing?",
  },
  "quiz.q1.o0": { pt: "E-mail com o dominio oficial da empresa", en: "Email with the company official domain", es: "Correo con el dominio oficial de la empresa" },
  "quiz.q1.o1": { pt: "Urgencia extrema e ameacas de bloqueio de conta", en: "Extreme urgency and account blocking threats", es: "Urgencia extrema y amenazas de bloqueo de cuenta" },
  "quiz.q1.o2": { pt: "Comunicacao sem erros ortograficos", en: "Communication without spelling errors", es: "Comunicacion sin errores ortograficos" },
  "quiz.q1.o3": { pt: "Link que direciona ao site oficial", en: "Link that directs to the official site", es: "Enlace que dirige al sitio oficial" },
  "quiz.q1.exp": { pt: "Golpistas criam senso de urgencia para que a vitima aja sem pensar. Desconfie de mensagens alarmistas.", en: "Scammers create a sense of urgency so the victim acts without thinking. Be suspicious of alarming messages.", es: "Los estafadores crean un sentido de urgencia para que la victima actue sin pensar. Desconfia de mensajes alarmistas." },

  "quiz.q2": {
    pt: "Um desconhecido no WhatsApp diz ser seu filho e pede um Pix urgente. O que fazer?",
    en: "A stranger on WhatsApp claims to be your child and asks for an urgent Pix. What to do?",
    es: "Un desconocido en WhatsApp dice ser tu hijo y pide un Pix urgente. Que hacer?",
  },
  "quiz.q2.o0": { pt: "Fazer o Pix imediatamente, pode ser urgente", en: "Send the Pix immediately, it might be urgent", es: "Hacer el Pix inmediatamente, puede ser urgente" },
  "quiz.q2.o1": { pt: "Pedir o CPF para confirmar", en: "Ask for their ID to confirm", es: "Pedir el documento para confirmar" },
  "quiz.q2.o2": { pt: "Ligar para o numero antigo do seu filho para confirmar", en: "Call your child old number to confirm", es: "Llamar al numero anterior de tu hijo para confirmar" },
  "quiz.q2.o3": { pt: "Bloquear sem verificar", en: "Block without verifying", es: "Bloquear sin verificar" },
  "quiz.q2.exp": { pt: "Sempre confirme por outro meio de contato. Golpistas usam fotos e nomes reais para enganar.", en: "Always confirm through another means of contact. Scammers use real photos and names to deceive.", es: "Siempre confirma por otro medio de contacto. Los estafadores usan fotos y nombres reales para enganar." },

  "quiz.q3": {
    pt: "Qual e a melhor pratica para criar senhas seguras?",
    en: "What is the best practice for creating secure passwords?",
    es: "Cual es la mejor practica para crear contrasenas seguras?",
  },
  "quiz.q3.o0": { pt: "Usar a mesma senha em todos os sites para nao esquecer", en: "Use the same password on all sites to not forget", es: "Usar la misma contrasena en todos los sitios para no olvidarla" },
  "quiz.q3.o1": { pt: "Usar o nome do pet + data de nascimento", en: "Use pet name + birthday", es: "Usar nombre de mascota + fecha de nacimiento" },
  "quiz.q3.o2": { pt: "Criar senhas longas com letras, numeros e simbolos unicos para cada site", en: "Create long passwords with unique letters, numbers and symbols for each site", es: "Crear contrasenas largas con letras, numeros y simbolos unicos para cada sitio" },
  "quiz.q3.o3": { pt: "Anotar todas as senhas em um papel na carteira", en: "Write all passwords on a paper in wallet", es: "Anotar todas las contrasenas en un papel en la billetera" },
  "quiz.q3.exp": { pt: "Senhas unicas e complexas para cada servico, preferencialmente com um gerenciador de senhas.", en: "Unique and complex passwords for each service, preferably with a password manager.", es: "Contrasenas unicas y complejas para cada servicio, preferiblemente con un gestor de contrasenas." },

  "quiz.q4": {
    pt: "Voce encontra uma vaga de emprego online que pede pagamento de R$ 50 para garantir sua inscricao. O que fazer?",
    en: "You find an online job posting that asks for a R$ 50 payment to secure your application. What to do?",
    es: "Encuentras una oferta de empleo en linea que pide un pago de R$ 50 para asegurar tu inscripcion. Que hacer?",
  },
  "quiz.q4.o0": { pt: "Pagar rapidamente antes que a vaga acabe", en: "Pay quickly before the position is filled", es: "Pagar rapidamente antes de que se acabe la vacante" },
  "quiz.q4.o1": { pt: "Verificar se a empresa existe e nunca pagar para se candidatar", en: "Verify the company exists and never pay to apply", es: "Verificar si la empresa existe y nunca pagar para postularse" },
  "quiz.q4.o2": { pt: "Pedir desconto no valor", en: "Ask for a discount", es: "Pedir descuento en el monto" },
  "quiz.q4.o3": { pt: "Enviar seus documentos primeiro e pagar depois", en: "Send documents first and pay later", es: "Enviar documentos primero y pagar despues" },
  "quiz.q4.exp": { pt: "Empresas legitimas nunca cobram para processos seletivos. Isso e golpe.", en: "Legitimate companies never charge for hiring processes. This is a scam.", es: "Las empresas legitimas nunca cobran por procesos de seleccion. Esto es una estafa." },

  // FAQ
  "faq.title": { pt: "Perguntas", en: "Frequently Asked", es: "Preguntas" },
  "faq.title_highlight": { pt: "frequentes", en: "Questions", es: "frecuentes" },
  "faq.subtitle": {
    pt: "Tire suas duvidas sobre seguranca digital e saiba como agir em cada situacao.",
    en: "Get answers about digital security and learn how to act in each situation.",
    es: "Resuelve tus dudas sobre seguridad digital y aprende como actuar en cada situacion.",
  },

  "faq.0.q": { pt: "O que devo fazer se cai em um golpe?", en: "What should I do if I fell for a scam?", es: "Que debo hacer si cai en una estafa?" },
  "faq.0.a": {
    pt: "Primeiro, entre em contato com seu banco imediatamente para tentar bloquear a transacao. Depois, registre um boletim de ocorrencia na delegacia ou pela internet. Tambem e importante avisar seus contatos caso seus dados tenham sido roubados.",
    en: "First, contact your bank immediately to try to block the transaction. Then, file a police report at the station or online. It is also important to warn your contacts if your data was stolen.",
    es: "Primero, contacta a tu banco inmediatamente para intentar bloquear la transaccion. Luego, registra un informe policial en la comisaria o por internet. Tambien es importante avisar a tus contactos si tus datos fueron robados.",
  },
  "faq.1.q": { pt: "Como saber se um site e seguro para comprar?", en: "How to know if a website is safe to buy from?", es: "Como saber si un sitio web es seguro para comprar?" },
  "faq.1.a": {
    pt: "Verifique se o endereco comeca com https e se ha um cadeado ao lado da URL. Pesquise a reputacao da loja em sites como Reclame Aqui. Desconfie de precos muito abaixo do normal e de sites que so aceitam Pix ou boleto.",
    en: "Check if the address starts with https and if there is a padlock next to the URL. Research the store reputation on review sites. Be suspicious of prices far below normal and sites that only accept wire transfers.",
    es: "Verifica si la direccion comienza con https y si hay un candado junto a la URL. Investiga la reputacion de la tienda en sitios de resenas. Desconfia de precios muy por debajo de lo normal y sitios que solo aceptan transferencias.",
  },
  "faq.2.q": { pt: "Meu WhatsApp foi clonado. O que faco?", en: "My WhatsApp was cloned. What do I do?", es: "Mi WhatsApp fue clonado. Que hago?" },
  "faq.2.a": {
    pt: "Avise seus contatos imediatamente para que ninguem envie dinheiro ao golpista. Tente recuperar sua conta pelo proprio app seguindo as instrucoes de verificacao. Ative a verificacao em duas etapas para evitar que aconteca novamente.",
    en: "Warn your contacts immediately so no one sends money to the scammer. Try to recover your account through the app following verification instructions. Enable two-step verification to prevent it from happening again.",
    es: "Avisa a tus contactos inmediatamente para que nadie envie dinero al estafador. Intenta recuperar tu cuenta a traves de la app siguiendo las instrucciones de verificacion. Activa la verificacion en dos pasos para evitar que vuelva a ocurrir.",
  },
  "faq.3.q": { pt: "E seguro fazer Pix para desconhecidos?", en: "Is it safe to send Pix to strangers?", es: "Es seguro hacer Pix a desconocidos?" },
  "faq.3.a": {
    pt: "Evite ao maximo. Antes de transferir, confirme a identidade da pessoa por outros meios, como uma ligacao. Nunca faca Pix por pressao ou urgencia. Lembre-se: depois de enviado, e muito dificil recuperar o dinheiro.",
    en: "Avoid it as much as possible. Before transferring, confirm the person identity through other means, like a phone call. Never send Pix under pressure or urgency. Remember: once sent, it is very hard to recover the money.",
    es: "Evitalo al maximo. Antes de transferir, confirma la identidad de la persona por otros medios, como una llamada. Nunca hagas Pix bajo presion o urgencia. Recuerda: una vez enviado, es muy dificil recuperar el dinero.",
  },
  "faq.4.q": { pt: "Como criar uma senha realmente segura?", en: "How to create a truly secure password?", es: "Como crear una contrasena realmente segura?" },
  "faq.4.a": {
    pt: "Use pelo menos 12 caracteres misturando letras maiusculas, minusculas, numeros e simbolos. Nao use datas de aniversario, nomes de familiares ou sequencias como 123456. O ideal e usar um gerenciador de senhas.",
    en: "Use at least 12 characters mixing uppercase, lowercase letters, numbers, and symbols. Do not use birthdays, family names, or sequences like 123456. Ideally, use a password manager.",
    es: "Usa al menos 12 caracteres mezclando letras mayusculas, minusculas, numeros y simbolos. No uses fechas de cumpleanos, nombres de familiares o secuencias como 123456. Lo ideal es usar un gestor de contrasenas.",
  },
  "faq.5.q": { pt: "Recebi uma ligacao do banco pedindo minha senha. E verdade?", en: "I received a call from the bank asking for my password. Is it real?", es: "Recibi una llamada del banco pidiendo mi contrasena. Es real?" },
  "faq.5.a": {
    pt: "Nao. Bancos nunca pedem senha, numero do cartao completo ou codigo de seguranca por telefone. Se receber esse tipo de ligacao, desligue e ligue voce mesmo para o numero oficial do banco que esta no verso do seu cartao.",
    en: "No. Banks never ask for passwords, full card numbers, or security codes by phone. If you receive such a call, hang up and call the official bank number on the back of your card.",
    es: "No. Los bancos nunca piden contrasenas, numeros de tarjeta completos o codigos de seguridad por telefono. Si recibes ese tipo de llamada, cuelga y llama tu mismo al numero oficial del banco que esta en el reverso de tu tarjeta.",
  },
  "faq.6.q": { pt: "Como proteger pessoas idosas de golpes?", en: "How to protect elderly people from scams?", es: "Como proteger a las personas mayores de estafas?" },
  "faq.6.a": {
    pt: "Converse com elas sobre os golpes mais comuns, de forma simples e sem pressa. Configure a verificacao em duas etapas no celular delas. Oriente a nunca dar informacoes por telefone e a sempre confirmar pedidos de dinheiro com um familiar.",
    en: "Talk to them about the most common scams, simply and patiently. Set up two-step verification on their phone. Advise them to never give information by phone and always confirm money requests with a family member.",
    es: "Habla con ellos sobre las estafas mas comunes, de forma simple y sin prisa. Configura la verificacion en dos pasos en su telefono. Orientalos a nunca dar informacion por telefono y a siempre confirmar pedidos de dinero con un familiar.",
  },

  // Testimonials
  "test.title": { pt: "Quem aprendeu,", en: "Those who learned,", es: "Quien aprendio," },
  "test.title_highlight": { pt: "nao caiu", en: "did not fall", es: "no cayo" },
  "test.subtitle": {
    pt: "Veja depoimentos de pessoas que reconheceram golpes a tempo gracas a informacao.",
    en: "See testimonials from people who recognized scams in time thanks to information.",
    es: "Ve testimonios de personas que reconocieron estafas a tiempo gracias a la informacion.",
  },

  // Footer
  "footer.desc": {
    pt: "Educando e protegendo pessoas contra fraudes e golpes digitais.",
    en: "Educating and protecting people against digital fraud and scams.",
    es: "Educando y protegiendo personas contra fraudes y estafas digitales.",
  },
  "footer.contato": { pt: "Contato", en: "Contact", es: "Contacto" },
  "footer.copy": {
    pt: "2026 CyberGuard. Todos os direitos reservados. Site educativo sem fins lucrativos.",
    en: "2026 CyberGuard. All rights reserved. Educational non-profit website.",
    es: "2026 CyberGuard. Todos los derechos reservados. Sitio educativo sin fines de lucro.",
  },

  // Chatbot
  "chat.title": { pt: "CyberGuard - Assistente", en: "CyberGuard - Assistant", es: "CyberGuard - Asistente" },
  "chat.subtitle": { pt: "Tire suas duvidas sobre golpes e fraudes", en: "Get answers about scams and fraud", es: "Resuelve tus dudas sobre estafas y fraudes" },
  "chat.welcome": {
    pt: "Ola! Sou o assistente do CyberGuard. Pergunte sobre qualquer tipo de golpe ou fraude digital e vou te ajudar a se proteger.",
    en: "Hello! I am the CyberGuard assistant. Ask about any type of digital scam or fraud and I will help you protect yourself.",
    es: "Hola! Soy el asistente de CyberGuard. Pregunta sobre cualquier tipo de estafa o fraude digital y te ayudare a protegerte.",
  },
  "chat.placeholder": { pt: "Digite sua duvida...", en: "Type your question...", es: "Escribe tu duda..." },
  "chat.open": { pt: "Abrir chat", en: "Open chat", es: "Abrir chat" },
  "chat.fallback": {
    pt: "Nao encontrei uma resposta especifica para sua pergunta. Tente perguntar sobre: Pix, phishing, WhatsApp, senhas, boletos, compras online, golpes em geral ou como proteger idosos.",
    en: "I could not find a specific answer to your question. Try asking about: Pix, phishing, WhatsApp, passwords, invoices, online shopping, scams in general, or how to protect the elderly.",
    es: "No encontre una respuesta especifica a tu pregunta. Intenta preguntar sobre: Pix, phishing, WhatsApp, contrasenas, boletos, compras en linea, estafas en general o como proteger a los mayores.",
  },
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
