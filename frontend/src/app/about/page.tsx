import { Info, Cpu, Globe, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-extrabold mb-6 text-slate-900">About JobAI</h1>
      <p className="text-xl text-slate-600 mb-12">
        Our platform is an AI-powered aggregator designed to simplify your job hunt by bringing listings from multiple sources into one clean interface.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <Cpu className="text-blue-600 mb-4" size={32} />
          <h3 className="text-lg font-bold mb-2">Smart Aggregation</h3>
          <p className="text-slate-500">We use JobSpy to scan LinkedIn, Indeed, and Glassdoor simultaneously.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <Shield className="text-green-600 mb-4" size={32} />
          <h3 className="text-lg font-bold mb-2">Anti-Duplicate</h3>
          <p className="text-slate-500">Our AI logic ensures you never see the same job twice across different platforms.</p>
        </div>
      </div>
    </div>
  );
}