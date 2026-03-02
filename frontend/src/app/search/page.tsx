"use client";
import React, { useState } from 'react';
import JobCard from '../../components/JobCard';
import { Loader2, Search, MapPin, Briefcase, Sparkles } from 'lucide-react';

export default function SearchPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("India");
  const [jobType, setJobType] = useState("all");
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [correction, setCorrection] = useState({ is_corrected: false, msg: "" });

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setHasSearched(true);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    
    try {
      const url = `${backendUrl}/search?role=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&job_type=${jobType}`;
      const response = await fetch(url);
      const data = await response.json();
      
      setJobs(data.jobs);
      setCorrection({ 
        is_corrected: data.is_corrected, 
        msg: `${data.corrected_role} in ${data.corrected_location}` 
      });
    } catch (error) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job: any) => 
    activeTab === "all" || job.site?.toLowerCase() === activeTab
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="bg-white border-b border-slate-200 pt-16 pb-8 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black text-slate-900 mb-10 text-center">Smart <span className="text-blue-600">Job Discovery</span></h1>
          
          <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2 max-w-5xl mx-auto mb-8">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-6 text-slate-400" size={22} />
              <input className="w-full p-5 pl-16 rounded-[2rem] outline-none text-lg font-medium" placeholder="Job title..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}/>
            </div>
            <div className="flex-1 relative flex items-center">
              <MapPin className="absolute left-6 text-slate-400" size={22} />
              <input className="w-full p-5 pl-16 rounded-[2rem] outline-none text-lg font-medium" placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)}/>
            </div>
            <button onClick={handleSearch} className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-blue-700 transition-all">
              {loading ? <Loader2 className="animate-spin" /> : "Search"}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="p-3 px-5 rounded-2xl bg-slate-50 font-bold text-slate-600 outline-none border border-slate-200">
              <option value="all">Any Work Type</option>
              <option value="fulltime">Full-time</option>
              <option value="internship">Internship</option>
            </select>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              {["all", "linkedin", "indeed", "glassdoor", "adzuna"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-xl font-bold text-xs capitalize transition-all ${activeTab === tab ? "bg-white text-blue-600 shadow-md" : "text-slate-500"}`}>{tab}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {!loading && correction.is_corrected && (
           <div className="mb-10 p-5 bg-blue-50 text-blue-800 rounded-3xl font-bold text-center border border-blue-100 shadow-sm animate-pulse">
             <Sparkles size={18} className="inline mr-2" /> AI Suggestion: Results for "{correction.msg}"
           </div>
        )}

        {loading ? (
          <div className="text-center py-32"><Loader2 size={64} className="mx-auto text-blue-600 animate-spin mb-4" /><p className="text-slate-400 font-black">Scanning Platforms...</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredJobs.length > 0 ? filteredJobs.map((job: any, i: number) => <JobCard key={i} job={job} />) : hasSearched && (
                <div className="col-span-full text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">No {jobType} jobs found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}