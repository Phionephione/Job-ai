"use client";

import React, { useState } from 'react';
import JobCard from '@/components/JobCard';
import { Loader2, Search, Briefcase, Filter, AlertCircle } from 'lucide-react';

export default function SearchPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setHasSearched(true);
    
    try {
      // Note: Using localhost:8000 for local development
      const response = await fetch(`http://localhost:8000/search?role=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Search Error:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Briefcase className="text-blue-600" size={36} />
            Find Your Next Opportunity
          </h1>
          <p className="text-slate-500 text-lg mb-8">
            Searching across LinkedIn, Indeed, and Glassdoor in real-time.
          </p>

          {/* Stylish Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={24} />
            </div>
            <input 
              type="text"
              className="w-full p-6 pl-14 pr-32 rounded-2xl border-2 border-slate-100 shadow-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none text-lg transition-all text-slate-800"
              placeholder="e.g. DevOps Intern, React Developer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="relative">
              <Loader2 className="animate-spin text-blue-600 mb-6" size={60} />
              <div className="absolute inset-0 blur-2xl bg-blue-400/20 animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">AI is hunting for jobs...</h3>
            <p className="text-slate-500">This usually takes 5-10 seconds to scan major platforms.</p>
          </div>
        )}

        {/* Results State */}
        {!loading && jobs.length > 0 && (
          <div className="animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">
                Found {jobs.length} Results
              </h2>
              <button className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600 transition">
                <Filter size={18} /> Filter Results
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job: any, i: number) => (
                <JobCard key={i} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Initial State */}
        {!loading && jobs.length === 0 && hasSearched && (
          <div className="max-w-md mx-auto text-center py-20 px-6 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-orange-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Jobs Found</h3>
            <p className="text-slate-500">
              We couldn't find any listings for <span className="font-semibold text-slate-700">"{query}"</span>. 
              Try using broader keywords like "Software Engineer" or "DevOps".
            </p>
          </div>
        )}

        {/* Landing State (Before first search) */}
        {!loading && !hasSearched && (
          <div className="text-center py-20">
            <div className="inline-flex p-4 rounded-full bg-blue-50 text-blue-600 mb-6">
              <SparklesIcon />
            </div>
            <h3 className="text-xl font-medium text-slate-400">
              Enter a job title above to start your AI-powered search
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple Helper Icon Component
function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
  );
}