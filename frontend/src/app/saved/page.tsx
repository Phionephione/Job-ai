"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JobCard from '../../components/JobCard';
import { Heart, Briefcase, ArrowLeft, Trash2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SavedPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const loadJobs = () => {
      const jobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      setSavedJobs(jobs);
    };

    loadJobs();
    window.addEventListener('storage', loadJobs);
    return () => window.removeEventListener('storage', loadJobs);
  }, []);

  const clearAll = () => {
    if (confirm("Clear all saved jobs?")) {
      localStorage.setItem('savedJobs', '[]');
      setSavedJobs([]);
    }
  };

  if (!isMounted) return null; // Prevents server-side render mismatch

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/search" className="group text-blue-600 font-bold flex items-center gap-2 mb-6 hover:gap-3 transition-all">
              <ArrowLeft size={20} /> Back to Job Search
            </Link>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
              My <span className="text-rose-500">Shortlist</span>
              <div className="p-2 bg-rose-50 rounded-2xl">
                <Heart className="text-rose-500" fill="currentColor" size={32} />
              </div>
            </h1>
          </motion.div>

          {savedJobs.length > 0 && (
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={clearAll}
              className="flex items-center gap-2 text-slate-400 font-bold hover:text-rose-600 transition-colors py-2 px-4 rounded-xl hover:bg-rose-50"
            >
              <Trash2 size={18} /> Clear List
            </motion.button>
          )}
        </div>

        {/* Dynamic Content */}
        <AnimatePresence mode="popLayout">
          {savedJobs.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {savedJobs.map((job: any) => (
                <JobCard key={job.job_url} job={job} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm"
            >
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 bg-rose-100 rounded-full animate-ping opacity-20" />
                <div className="relative bg-rose-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="text-rose-200" size={48} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3">Your shortlist is empty</h2>
              <p className="text-slate-500 mb-12 max-w-sm mx-auto font-bold text-lg leading-relaxed">
                Start exploring the best jobs from across the web and save them here.
              </p>
              <Link href="/search" className="inline-flex items-center gap-3 bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-blue-700 shadow-2xl shadow-blue-200 hover:scale-105 transition-all">
                Find Jobs <Sparkles size={24} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}