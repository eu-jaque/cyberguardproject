import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Sparkles, SendHorizontal, Loader2 } from 'lucide-react';

export default function ChatBotComponent({
    messages,
    messagesEndRef,
    input,
    setInput,
    handleSendMessage,
    chatName,
    isTyping
}) {
    return (
        <main className="flex-1 flex flex-col h-full relative min-w-0">
            {/* Header do Chat */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#0b1426]/80 backdrop-blur-md border-b border-slate-800/50">
                <div className="mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-200">{chatName}</span>
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> IA
                        </span>
                    </div>
                </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto pb-36 pt-4">
                <div className="max-w-3xl mx-auto w-full px-4 space-y-8">
                    {messages.map((msg) => (
                        <div key={msg.id} className="flex flex-col space-y-2 group">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                {msg.sender === 'bot' ? (
                                    <>
                                        <div className="h-6 w-6 rounded-md bg-amber-500 flex items-center justify-center text-white">
                                            <Bot size={14} />
                                        </div>
                                        CYNTIA IA
                                    </>
                                ) : (
                                    <>
                                        <div className="h-6 w-6 rounded-md bg-slate-700 flex items-center justify-center text-white">
                                            <User size={14} />
                                        </div>
                                        Você
                                    </>
                                )}
                            </div>

                            <div className={`pl-8 text-base leading-relaxed text-slate-100 ${msg.sender === 'user' ? 'bg-slate-800/30 p-4 rounded-xl ml-8' : ''}`}>
                                {msg.sender === 'bot' ? (
                                    <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:text-amber-400">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                <div className="h-6 w-6 rounded-md bg-amber-500 flex items-center justify-center text-white">
                                    <Bot size={14} />
                                </div>
                                CYNTIA IA
                            </div>
                            <div className="pl-8 flex items-center gap-2 text-slate-400">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Pensando...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Fixo no rodapé */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0b1426] via-[#0b1426]/90 to-transparent pt-10 pb-6">
                <div className="max-w-3xl mx-auto w-full px-4">
                    <form onSubmit={handleSendMessage} className="relative flex items-center bg-[#142342] border border-slate-800/80 rounded-2xl shadow-2xl focus-within:border-amber-500/50 transition-colors">
                        <textarea
                            placeholder="Pergunte ao CyberGuard..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            rows={1}
                            className="flex-1 bg-transparent py-4 pl-4 pr-16 resize-none focus:outline-none text-base text-white placeholder:text-slate-400 max-h-48"
                        />
                        <button type="submit" disabled={!input.trim()} className="absolute right-3 p-2.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-30 transition-all">
                            <SendHorizontal size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
