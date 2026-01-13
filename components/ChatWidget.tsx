
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../i18n';
import { globalChat, describeArchitectureDiagram } from '../services/geminiService';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const ChatWidget: React.FC<{ lang: Language }> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isImageProcessing]);

  const handleSend = async (textToSend?: string) => {
    const messageContent = textToSend || input;
    if (!messageContent.trim() || loading) return;
    
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: messageContent }]);
    setLoading(true);

    try {
      const response = await globalChat(messageContent, messages, lang);
      setMessages(prev => [...prev, { role: 'bot', text: response || "" }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImageProcessing(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const description = await describeArchitectureDiagram(base64, file.type, lang);
      if (description) {
        handleSend(description);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: t.imageError }]);
      }
      setIsImageProcessing(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-bold text-sm">{t.chatTitle}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-slate-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 mt-20 text-sm">
                <p>{t.aiInitial}</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[12px] leading-relaxed font-medium ${
                  m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-md' : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {(loading || isImageProcessing) && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 flex flex-col gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                  </div>
                  {isImageProcessing && <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{t.processingImage}</span>}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex gap-2">
              <input 
                type="file" 
                accept="image/*" 
                ref={chatFileInputRef} 
                className="hidden" 
                onChange={handleChatFileUpload}
              />
              <button 
                onClick={() => chatFileInputRef.current?.click()}
                disabled={loading || isImageProcessing}
                className="text-slate-400 hover:text-blue-600 p-2 transition-colors disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.chatPlaceholder}
                className="flex-1 text-xs border border-slate-200 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-md disabled:bg-slate-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-blue-600 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center gap-2 group border-4 border-white/10"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
          </svg>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-sm font-black uppercase tracking-widest whitespace-nowrap">
            {t.chatTitle}
          </span>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
