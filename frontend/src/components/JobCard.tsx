"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, ExternalLink, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export default function JobCard({ job }: { job: any }) {
  const [isSaved, setIsSaved] = useState(false);

  // Safely check localStorage on mount to avoid Next.js hydration mismatch
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setIsSaved(saved.some((j: any) => j.job_url === job.job_url));
  }, [job.job_url]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    
    let updated;
    if (isSaved) {
      updated = savedJobs.filter((j: any) => j.job_url !== job.job_url);
    } else {
      updated = [...savedJobs, job];
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(updated));
    setIsSaved(!isSaved);
    
    // Trigger a storage event so the "Saved" page updates in real-time if open
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
    >
      {/* Decorative background flare */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors" />

      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="p-3.5 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
          <Building2 size={26} />
        </div>
        
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={toggleSave}
          className={`p-3 rounded-2xl transition-all border-2 ${
            isSaved 
            ? "bg-rose-50 border-rose-100 text-rose-500 shadow-md" 
            : "bg-slate-50 border-transparent text-slate-400 hover:border-rose-200 hover:text-rose-500"
          }`}
        >
          <Heart size={22} fill={isSaved ? "currentColor" : "none"} className="transition-colors" />
        </motion.button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-lg">
          {job.site || "verified"}
        </span>
        {isSaved && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 uppercase">
            <Sparkles size={12} /> Saved
          </span>
        )}
      </div>

      <h3 className="font-extrabold text-xl text-slate-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">
        {job.title}
      </h3>
      
      <div className="flex flex-col gap-1 mb-6">
        <p className="text-slate-500 font-bold flex items-center gap-1.5 text-sm">
          <MapPin size={16} className="text-blue-500" /> {job.location || "Remote"}
        </p>
        <p className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
          <ShieldCheck size={14} className="text-slate-300" /> {job.company || "Confidential"}
        </p>
      </div>

      <motion.a 
        href={job.job_url} 
        target="_blank" 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
      >
        View Details <ExternalLink size={18} />
      </motion.a>
    </motion.div>
  );
}