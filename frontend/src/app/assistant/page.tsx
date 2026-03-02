"use client";
import React, { useState } from 'react';
import { Sparkles, Send, Loader2, User, Bot } from 'lucide-react';

export default function AssistantPage() {
  const [messages, setMessages] = useState([{ role: 'bot', content: 'Hello! I am your AI career assistant. Ask me for roadmaps or job title suggestions!' }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${backendUrl}/assistant/chat?user_msg=${encodeURIComponent(userMsg)}`);
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "Server error. Is the backend running?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-blue-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><Sparkles /> AI Career Assistant</h1>
        <p className="opacity-90 tracking-wide">Advanced AI-driven career guidance and role discovery.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 h-[600px] flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-full h-10 w-10 flex items-center justify-center shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}>
                {m.role === 'user' ? <User size={20}/> : <Bot size={20}/>}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] shadow-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-100'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="flex gap-2 p-4 bg-white w-fit rounded-2xl animate-pulse text-blue-600 font-bold"><Sparkles className="animate-spin" size={20}/> AI is thinking...</div>}
        </div>
        
        <div className="p-6 bg-white border-t flex gap-4">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            placeholder="Type your career question..."
          />
          <button onClick={sendMessage} className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 hover:scale-105 transition-all shadow-lg">
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}