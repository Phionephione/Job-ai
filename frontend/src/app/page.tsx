import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#f8fafc] px-6">
      <div className="max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-bold text-sm mb-8 animate-bounce">
          <Sparkles size={16}/> <span>AI-Powered Job Discovery</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
          Find your dream job <br/>
          <span className="text-blue-600">across the entire web.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          Our AI aggregates jobs from LinkedIn, Indeed, and Glassdoor so you don't have to. 
          Smart filtering, no duplicates, just direct links.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/search" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-blue-200">
            Start Searching <ArrowRight />
          </Link>
          <Link href="/about" className="flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
            How it works
          </Link>
        </div>
      </div>
    </main>
  );
}