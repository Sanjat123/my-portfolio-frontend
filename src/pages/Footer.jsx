import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Server, Shield, GitBranch, ExternalLink, Download, MessageCircle, ArrowUp } from 'lucide-react';

export default function Footer() {
  const [health, setHealth] = useState(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const checkHealth = () => {
      axios.get('http://127.0.0.1:8000/api/health-check/')
        .then(r => setHealth(r.data))
        .catch(() => setHealth({ status: 'Offline', latency_ms: '--' }));
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isOnline = health?.status === 'Operational';

  return (
    <>
      {/* ── Scroll to top button ── */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-6 z-40 w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 hover:border-red-800 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-all shadow-lg"
          title="Back to top"
        >
          <ArrowUp size={16} />
        </button>
      )}

      <footer className="w-full border-t border-neutral-900/80 bg-[#080808] relative z-20">

        {/* ── Top strip ── */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 border-b border-neutral-900/60">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-red-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-base font-mono">S</span>
              </div>
              <div>
                <div className="text-white font-black text-sm tracking-widest uppercase font-mono">SANJAT KUMAR</div>
                <div className="text-neutral-600 text-[9px] tracking-widest uppercase flex items-center gap-1">
                  <Shield size={8} className="text-red-600" /> Full-Stack Engineer
                </div>
              </div>
            </div>
            <p className="text-neutral-600 text-xs leading-relaxed max-w-xs">
              Building production-grade web & mobile applications. Open to internships, freelance & full-time SDE roles.
            </p>

            {/* Social row */}
            <div className="flex items-center gap-2 mt-5">
              <a href="https://github.com/Sanjat123" target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-600 flex items-center justify-center transition-colors"
                title="GitHub">
                <GitBranch size={14} className="text-neutral-500 hover:text-white" />
              </a>
              <a href="https://www.linkedin.com/in/sanjatkumar/" target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-blue-800 flex items-center justify-center transition-colors"
                title="LinkedIn">
                <ExternalLink size={14} className="text-neutral-500 hover:text-blue-400" />
              </a>
              <a href="https://wa.me/917870353499?text=Hi%20Sanjat!%20I%20saw%20your%20portfolio."
                target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}
                title="WhatsApp">
                <MessageCircle size={14} className="text-white" />
              </a>
              <a href="/resume/Sanjat_Kumar_Resume.pdf" download
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/40 border border-emerald-800/50 hover:bg-emerald-800/40 text-emerald-400 text-[10px] font-black uppercase tracking-wider transition-all">
                <Download size={12} /> CV
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 font-mono">Navigation</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Home', href: '#' },
                { label: 'Experience', href: '#experience' },
                { label: 'Projects', href: '#projects' },
                { label: 'Skills', href: '#skills' },
                { label: 'Contact', href: '#contact' },
                { label: 'Download CV', href: '/resume/Sanjat_Kumar_Resume.pdf' },
              ].map(({ label, href }) => (
                <a key={label} href={href}
                  className="text-neutral-600 hover:text-neutral-300 text-xs font-semibold uppercase tracking-wider transition-colors py-1 flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-red-800 group-hover:bg-red-500 transition-colors" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Stack & health */}
          <div>
            <h4 className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 font-mono">Built With</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {['React.js', 'Vite', 'Tailwind CSS', 'Django REST', 'PostgreSQL', 'AWS EC2', 'Docker', 'Framer Motion'].map(t => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-600 font-mono">{t}</span>
              ))}
            </div>

            {/* Live health status */}
            <div className="flex items-center gap-4 bg-neutral-950 border border-neutral-800/60 px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 flex items-center gap-1 font-mono">
                  <Server size={10} /> {health ? health.status : 'Checking...'}
                </span>
              </div>
              <div className="w-px h-4 bg-neutral-800" />
              <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-neutral-500 font-mono">
                <Activity size={10} className="text-red-600" /> DB: {health ? `${health.latency_ms}ms` : '--'}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-neutral-700 text-xs font-mono">
            © {new Date().getFullYear()} Sanjat Kumar. All rights reserved.
          </span>
          <span className="text-neutral-800 text-xs font-mono flex items-center gap-1.5">
            <Shield size={10} className="text-red-900" />
            Designed & developed by Sanjat Kumar · Mohali, India
          </span>
          <span className="text-neutral-800 text-[10px] font-mono">
            v1.0.0 · {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </>
  );
}