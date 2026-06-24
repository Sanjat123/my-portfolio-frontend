import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, FolderOpen, Briefcase, Upload, Shield, 
  ChevronDown, Terminal, Database, Cloud, Code2, ArrowRight, PlayCircle 
} from 'lucide-react';

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/projects/')
      .then(response => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden font-sans selection:bg-red-500/30">
      
      {/* Subtle Background Glows (Red/Dark theme) */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-red-800/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* ================= VAULT STYLE HEADER ================= */}
      <header className="w-full border-b border-white/5 bg-[#050505]/95 backdrop-blur-md px-6 py-4 flex justify-between items-center relative z-20">
        
        {/* Left: Brand / Logo Area */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-red-600 font-black text-2xl">S</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#050505]"></div>
          </div>
          
          <div className="flex flex-col justify-center">
            <span className="text-red-500 font-black text-xl leading-none uppercase italic tracking-wider">SANJAT</span>
            <span className="text-white font-black text-xl leading-tight uppercase italic tracking-wider">KUMAR</span>
            <span className="text-[10px] text-gray-500 tracking-widest mt-1 flex items-center gap-1 font-semibold uppercase">
              <Shield size={10} className="text-red-500" /> Full-Stack Vault
            </span>
          </div>
        </div>

        {/* Center: Navigation Pill */}
        <nav className="hidden lg:flex items-center bg-[#0f0f0f] border border-white/10 rounded-full px-2 py-1.5 shadow-inner">
          <Link to="/" className="flex items-center gap-2 px-5 py-2 bg-red-950/40 text-red-500 rounded-full text-xs font-bold tracking-widest uppercase border border-red-900/30">
            <LayoutDashboard size={14} /> Dashboard
          </Link>
          <a href="#projects" className="flex items-center gap-2 px-5 py-2 text-gray-400 hover:text-gray-200 rounded-full text-xs font-bold tracking-widest uppercase transition-colors">
            <FolderOpen size={14} /> Projects
          </a>
          <a href="#experience" className="flex items-center gap-2 px-5 py-2 text-gray-400 hover:text-gray-200 rounded-full text-xs font-bold tracking-widest uppercase transition-colors">
            <Briefcase size={14} /> Experience
          </a>
          <a href="#contact" className="flex items-center gap-2 px-5 py-2 text-green-500 hover:text-green-400 rounded-full text-xs font-bold tracking-widest uppercase transition-colors">
            <Upload size={14} /> Contact
          </a>
        </nav>

        {/* Right: Authenticated Admin Section */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end justify-center">
            <span className="text-[10px] text-red-500 font-bold tracking-widest uppercase">Authenticated Guest</span>
            <span className="text-sm font-semibold text-white">Visitor Admin</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full p-1 pr-3 cursor-pointer hover:bg-[#1a1a1a] transition-colors">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              V
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <main className="max-w-7xl mx-auto px-6 pt-16 lg:pt-24 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="max-w-2xl order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-950/20 text-red-400 text-xs font-bold tracking-widest uppercase mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              System Online & Ready
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              Software <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">Engineer.</span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg">
              Specializing in scalable backend architectures (Django, Node.js) and high-performance frontend systems (React, Flutter).
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-red-900/40 transition-all flex items-center gap-2">
                Browse Archive <FolderOpen size={18} />
              </button>
              <button className="glass-panel text-gray-300 font-bold px-8 py-3.5 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2">
                <PlayCircle size={18} className="text-red-500" /> Watch Demo
              </button>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px] rounded-3xl overflow-hidden glass-panel shadow-2xl shadow-red-900/10 border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10"></div>
              {/* Apni image ka path yahan daalein */}
              <img 
                src="/hero.png" 
                alt="Sanjat Kumar" 
                className="w-full h-auto object-cover relative z-0"
              />
            </div>
          </div>

        </div>

        {/* Tech Stack Bar */}
        <div className="mt-24 bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 shadow-xl">
          <div className="flex items-center gap-4 text-gray-300">
            <Code2 className="text-red-500" size={32} />
            <div>
              <h3 className="font-bold text-white tracking-wide">Frontend</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">React, Flutter</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/5"></div>
          <div className="flex items-center gap-4 text-gray-300">
            <Terminal className="text-white" size={32} />
            <div>
              <h3 className="font-bold text-white tracking-wide">Backend</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Django, Node.js</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/5"></div>
          <div className="flex items-center gap-4 text-gray-300">
            <Database className="text-red-500" size={32} />
            <div>
              <h3 className="font-bold text-white tracking-wide">Database</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">PostgreSQL, Redis</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/5"></div>
          <div className="flex items-center gap-4 text-gray-300">
            <Cloud className="text-white" size={32} />
            <div>
              <h3 className="font-bold text-white tracking-wide">DevOps</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">AWS, Docker</p>
            </div>
          </div>
        </div>

        {/* ================= PROJECTS SECTION WITH SKELETON ================= */}
        <div id="projects" className="mt-32 pb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-1 bg-red-600 rounded-full"></div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase">Scan & Discover</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Loading State (Skeleton UI) */}
            {loading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl animate-pulse">
                  <div className="w-1/3 h-6 bg-white/5 rounded mb-4"></div>
                  <div className="w-2/3 h-4 bg-white/5 rounded mb-2"></div>
                  <div className="w-full h-4 bg-white/5 rounded mb-2"></div>
                  <div className="w-4/5 h-4 bg-white/5 rounded mb-8"></div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-auto">
                    <div className="w-1/4 h-4 bg-white/5 rounded"></div>
                    <div className="w-1/3 h-8 bg-white/5 rounded-lg"></div>
                  </div>
                </div>
              ))
            ) : (
              /* Actual Data State */
              projects.map((project) => (
                <div key={project.id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl hover:border-red-500/40 transition-colors flex flex-col group shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">{project.title}</h3>
                  <p className="text-xs font-bold tracking-widest uppercase text-red-500 mb-4">{project.tagline}</p>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">{project.description}</p>
                  
                  <div className="flex justify-between items-center border-t border-white/5 pt-5 mt-auto">
                    <span className="text-xs font-bold tracking-widest text-gray-500 flex items-center gap-1">
                      <Shield size={12} className="text-red-500"/> {project.views_count} VIEWS
                    </span>
                    <Link to={`/project/${project.slug}`} className="text-xs font-bold tracking-widest uppercase text-white hover:text-red-400 transition-colors flex items-center gap-1">
                      Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>
      </main>

    </div>
  );
}

export default Home;