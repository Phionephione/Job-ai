import Link from 'next/link';
import { Briefcase, Home, Search, Heart, User, Info } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Briefcase className="text-white" size={24} />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">
            Job<span className="text-blue-600">AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/" icon={<Home size={18}/>} label="Home" />
          <NavLink href="/search" icon={<Search size={18}/>} label="Search" />
          <NavLink href="/saved" icon={<Heart size={18}/>} label="Saved" />
          <NavLink href="/assistant" icon={<User size={18}/>} label="Assistant" />
          <NavLink href="/about" icon={<Info size={18}/>} label="About" />
        </div>

        {/* Mobile Call to Action */}
        <Link 
          href="/search" 
          className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-600 transition-all shadow-md"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-1.5 text-slate-600 font-medium hover:text-blue-600 transition-colors">
      {icon}
      <span>{label}</span>
    </Link>
  );
}