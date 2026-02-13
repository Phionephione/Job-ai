import { Heart } from 'lucide-react';

export default function SavedPage() {
  return (
    <div className="max-w-7xl mx-auto py-20 px-6 text-center">
      <div className="bg-pink-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart className="text-pink-500" size={40} />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Saved Jobs</h1>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        Jobs you heart will appear here. (Connect Supabase to save them permanently!)
      </p>
      <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">
        Browse Jobs
      </button>
    </div>
  );
}