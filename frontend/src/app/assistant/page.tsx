"use client";
import { Sparkles, MessageSquare, Send } from 'lucide-react';

export default function AssistantPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white mb-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles /> AI Career Assistant
        </h1>
        <p className="opacity-90">Ask me for career advice or help with job titles!</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 h-[500px] flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
          <div className="bg-blue-50 self-start p-4 rounded-2xl text-slate-700 max-w-[80%]">
            Hello! I am your AI assistant. Type a message below to start chatting.
          </div>
        </div>
        
        <div className="p-4 border-t flex gap-3">
          <input 
            className="flex-1 bg-slate-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. How do I become a DevOps engineer?"
          />
          <button className="bg-blue-600 text-white p-4 rounded-xl">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}