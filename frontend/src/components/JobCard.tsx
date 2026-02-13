import { MapPin, Building2, ExternalLink, ShieldCheck } from 'lucide-react';

export default function JobCard({ job }: { job: any }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Building2 size={24} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-green-100 text-green-700 rounded">
          {job.site || "Direct"}
        </span>
      </div>
      <h3 className="font-bold text-xl text-slate-800 mb-1">{job.title}</h3>
      <p className="text-slate-500 mb-4 flex items-center gap-1"><MapPin size={16}/> {job.location}</p>
      
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck size={16} className="text-blue-500"/>
        <span className="text-sm text-slate-600 font-medium">Verified Posting</span>
      </div>

      <a 
        href={job.job_url} 
        target="_blank" 
        className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
      >
        Apply Now <ExternalLink size={18} />
      </a>
    </div>
  );
}