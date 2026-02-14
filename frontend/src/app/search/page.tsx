"use client";

import React, { useState } from 'react';
import JobCard from '../../components/JobCard'; // Verified relative path
import { Loader2, Search, Briefcase, Sparkles, AlertCircle } from 'lucide-react';

export default function SearchPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setHasSearched(true);
    
    // This looks for the Vercel Environment Variable. 
    // If not found, it defaults to your Render URL.
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://job-ai-iwg9.onrender.com";
    
    try {
      const response = await fetch(`${backendBaseUrl}/search?role=${encodeURIComponent(query)}`);
      
      if (!response.ok) throw new Error("Backend unreachable");
      
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Search Header Section */}
      <div className="bg-white border-b border-slate-200 pt-16 pb-12 px-4 shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-4">
            <Sparkles size={16} /> AI-Powered Search
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Find Your Next <span className="text-blue-600">Opportunity</span>
          </h1>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto font-medium">
            Search across LinkedIn, Indeed, Glassdoor and Adzuna in real-time.
          </p>

          {/* Search Bar Container */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Search size={24} />
            </div>
            <input 
              type="text"
              className="w-full p-6 pl-14 pr-36 rounded-3xl border-2 border-slate-100 shadow-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-lg transition-all text-slate-800 font-medium"
              placeholder="e.g. React Developer, DevOps Intern..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:bg-slate-300"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Search Jobs"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* 1. Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <Briefcase className="absolute inset-0 m-auto text-blue-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Scraping the Web...</h3>
            <p className="text-slate-500 font-medium">Checking LinkedIn, Indeed, and Adzuna API Fallback</p>
          </div>
        )}

        {/* 2. Success State (Jobs found) */}
        {!loading && jobs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-10 border-l-4 border-blue-600 pl-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Search Results for <span className="text-blue-600">"{query}"</span>
              </h2>
              <span className="bg-slate-200 px-3 py-1 rounded-full text-sm font-bold text-slate-600">
                {jobs.length} found
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job: any, i: number) => (
                <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    <JobCard job={job} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Empty State (No jobs found) */}
        {!loading && jobs.length === 0 && hasSearched && (
          <div className="max-w-md mx-auto text-center py-20 px-10 bg-white rounded-[40px] border-2 border-dashed border-slate-200 shadow-sm">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-orange-500" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Nothing Found</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              The scraper might be blocked or no such role exists in India. 
              Try broader keywords like <span className="text-slate-900 font-bold">"Software Engineer"</span>.
            </p>
          </div>
        )}

        {/* 4. Initial State (Welcome) */}
        {!loading && !hasSearched && (
          <div className="text-center py-32 opacity-40">
            <Briefcase size={80} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">
              Awaiting Search Input
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}