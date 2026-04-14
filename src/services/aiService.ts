import supabase from "../../utils/supabase";

// Se for via Edge Function do Supabase (padrão do Lovable):
export const sendMessageToAI = async (message: string, history: any[] = []) => {
    try {
        // O nome 'chat-ai' é um exemplo comum de edge function criada para IAs. Ajuste se o nome for outro (ex: 'generate').
        const { data, error } = await supabase.functions.invoke('chat-ai', {
            body: { message, history }
        });

        if (error) {
            console.error("Erro da Edge Function:", error);
            throw error;
        }

        // Caso a resposta retorne um formato diferente da OpenAI direta, 
        // adapte a propriedade 'data.reply' ou 'data.message' consoante o seu backend.
        return data.reply || data.message || "Desculpe, não recebi um retorno válido.";
        
    } catch (error) {
        console.error("Erro na I.A:", error);
        return "Desculpe, ocorreu um erro de conexão com os servidores da Inteligência Artificial.";
    }
};

/* 
// SE FOR CHAMAR A OPENAI DIRETO DO FRONT (Não recomendado por segurança, 
// mas caso queira testar sem backend, siga isso na porta da lovable):
export const sendMessageToAIDirect = async (message: string, history: any[] = []) => {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_LOVABLE_AI_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Você é um assistente de cibersegurança chamado CyberGuard." },
                    ...history,
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Erro na I.A direta:", error);
        return "Erro ao se comunicar direteramente com a I.A.";
    }
};
*/
