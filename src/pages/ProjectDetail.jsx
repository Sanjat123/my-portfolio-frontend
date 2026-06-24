import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Shield, Eye, Calendar, Terminal, ExternalLink,
  GitBranch, Copy, CheckCircle, Code2, Zap, Lock,
  ChevronRight, Star, Clock, Globe, ArrowRight
} from 'lucide-react';

function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px',
      }}
    />
  );
}

function GlowCard({ children, className = '' }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const ref = React.useRef();
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative overflow-hidden rounded-2xl border border-neutral-800/60 bg-neutral-950 transition-all duration-300 ${hover ? 'border-red-900/50' : ''} ${className}`}
    >
      {hover && (
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, rgba(127,29,29,0.13), transparent 70%)` }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#080808] px-6 py-10 md:px-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="h-9 w-48 rounded-full bg-neutral-900 animate-pulse mb-12" />
        <div className="rounded-2xl border border-neutral-900 bg-neutral-950 p-8 md:p-14 animate-pulse">
          <div className="h-4 w-24 bg-neutral-800 rounded mb-8" />
          <div className="h-12 w-3/4 bg-neutral-800 rounded mb-4" />
          <div className="h-6 w-1/3 bg-neutral-800 rounded mb-10" />
          <div className="flex gap-3 mb-12 pb-10 border-b border-neutral-900">
            {[1, 2, 3].map(i => <div key={i} className="h-9 w-32 bg-neutral-800 rounded-lg" />)}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-4 bg-neutral-800 rounded" style={{ width: `${90 - i * 8}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`http://127.0.0.1:8000/api/projects/${slug}/`)
      .then(r => { setProject(r.data); setLoading(false); })
      .catch(() => setLoading(false));
    axios.post(`http://127.0.0.1:8000/api/projects/${slug}/add_view/`).catch(() => {});
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

  if (loading) return <SkeletonLoader />;

  if (!project) return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center gap-6 text-center px-6">
      <div className="w-20 h-20 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center">
        <Shield size={32} className="text-red-600" />
      </div>
      <h2 className="text-2xl font-black text-white">Project Not Found</h2>
      <p className="text-neutral-500 text-sm max-w-xs">This project may have been removed or the slug is incorrect.</p>
      <Link to="/" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-black uppercase tracking-widest transition-all">
        <ArrowLeft size={15} /> Back to Portfolio
      </Link>
    </div>
  );

  const techStack = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : (project.tech_stack || '').split(',').map(t => t.trim()).filter(Boolean);

  const tabs = ['overview', 'tech stack', 'details'];

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-200 font-sans antialiased selection:bg-red-900/40 selection:text-red-300">
      <NoiseOverlay />
      <div className="fixed top-[-5%] right-[-5%] w-[600px] h-[600px] bg-red-950/15 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="fixed bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Sticky header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-neutral-900/80 bg-[#080808]/90 backdrop-blur-xl px-6 py-3"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-neutral-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
            <ArrowLeft size={14} /> Portfolio
          </Link>
          <div className="hidden md:flex items-center gap-2 text-neutral-600 text-xs font-mono">
            <span className="text-red-600">/</span>projects<span className="text-red-600">/</span>
            <span className="text-neutral-400">{slug}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyLink} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-neutral-500 hover:text-white transition-all">
              {copied ? <><CheckCircle size={12} className="text-emerald-400" /> Copied</> : <><Copy size={12} /> Share</>}
            </button>
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-xs font-bold text-white transition-all">
                <ExternalLink size={12} /> Live
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <main className="relative z-10 px-6 py-12 md:py-20 max-w-5xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={stagger}>

          {/* Breadcrumb */}
          <motion.div variants={fadeUp} className="flex items-center gap-2 text-xs font-mono text-neutral-700 mb-10">
            <Link to="/" className="hover:text-neutral-400 transition-colors">home</Link>
            <ChevronRight size={12} /><span>projects</span>
            <ChevronRight size={12} /><span className="text-neutral-400">{slug}</span>
          </motion.div>

          {/* Hero */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-black uppercase tracking-widest text-red-500 font-mono">
                <Terminal size={11} /> project_log.sh
              </span>
              {project.is_featured && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-800/40 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                  <Star size={10} fill="currentColor" /> Featured
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> Active
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.02] tracking-tight mb-4">
              {project.title}
            </h1>
            <p className="text-red-500 text-base md:text-xl font-black uppercase tracking-[0.15em] mb-6">
              {project.tagline}
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: Eye, text: `${(project.views_count || 0) + 1} views` },
                { icon: Calendar, text: new Date(project.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                project.duration ? { icon: Clock, text: project.duration } : null,
                techStack.length ? { icon: Code2, text: `${techStack.length} technologies` } : null,
              ].filter(Boolean).map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  <Icon size={13} className="text-red-500" />{text}
                </span>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          {(project.live_url || project.github_url) && (
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-12">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-red-950/40 hover:-translate-y-0.5">
                  <Globe size={16} /> Launch App <ArrowRight size={14} />
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white font-black text-sm uppercase tracking-widest transition-all">
                  <GitBranch size={16} /> View Source
                </a>
              )}
            </motion.div>
          )}

          {/* Tab Nav */}
          <motion.div variants={fadeUp} className="flex gap-1 mb-8 bg-neutral-950 border border-neutral-800/60 rounded-xl p-1 w-fit">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-red-700 text-white shadow-lg' : 'text-neutral-600 hover:text-neutral-300'}`}>
                {tab}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="grid lg:grid-cols-[1fr_300px] gap-6">
                  <GlowCard className="p-8 md:p-10">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-px flex-1 bg-neutral-800" />
                      <span className="text-[10px] text-neutral-700 font-mono uppercase tracking-widest">description</span>
                      <div className="h-px flex-1 bg-neutral-800" />
                    </div>
                    {(project.description || '').split('\n').map((para, i) =>
                      para.trim()
                        ? <p key={i} className="text-neutral-400 leading-relaxed text-base mb-4 last:mb-0">{para}</p>
                        : <br key={i} />
                    )}
                  </GlowCard>

                  <div className="space-y-4">
                    <GlowCard className="p-5">
                      <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap size={13} className="text-red-500" /> Quick Stats
                      </h3>
                      {[
                        { label: 'Views', value: (project.views_count || 0) + 1 },
                        { label: 'Status', value: project.status || 'Production' },
                        { label: 'Type', value: project.project_type || 'Full-Stack' },
                        { label: 'Year', value: new Date(project.created_at).getFullYear() },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between py-2 border-b border-neutral-900 last:border-0">
                          <span className="text-neutral-600 text-xs uppercase tracking-wider font-bold">{label}</span>
                          <span className="text-neutral-300 text-xs font-bold font-mono">{value}</span>
                        </div>
                      ))}
                    </GlowCard>

                    <GlowCard className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock size={13} className="text-emerald-400" />
                        <span className="text-emerald-400 text-[10px] font-mono font-black uppercase tracking-widest">Secure Build</span>
                      </div>
                      <p className="text-neutral-700 text-xs leading-relaxed">RBAC · OWASP-aligned · Auth hardened</p>
                    </GlowCard>

                    {(project.live_url || project.github_url) && (
                      <GlowCard className="p-5">
                        <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4">Links</h3>
                        <div className="space-y-2">
                          {project.live_url && (
                            <a href={project.live_url} target="_blank" rel="noreferrer"
                              className="flex items-center justify-between p-3 rounded-xl bg-red-950/30 border border-red-900/40 hover:border-red-700/60 transition-colors group">
                              <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Live Demo</span>
                              <ExternalLink size={13} className="text-red-600 group-hover:text-red-400 transition-colors" />
                            </a>
                          )}
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noreferrer"
                              className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-colors group">
                              <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Source Code</span>
                              <GitBranch size={13} className="text-neutral-600 group-hover:text-neutral-300 transition-colors" />
                            </a>
                          )}
                        </div>
                      </GlowCard>
                    )}
                  </div>
                </div>
              )}

              {/* TECH STACK */}
              {activeTab === 'tech stack' && (
                <GlowCard className="p-8 md:p-10">
                  <h3 className="text-white font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                    <Code2 size={15} className="text-red-500" /> Technologies Used
                  </h3>
                  {techStack.length > 0 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {techStack.map((tech, i) => (
                          <motion.div key={tech}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-red-900/60 transition-all group">
                            <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                            <span className="text-neutral-300 text-sm font-bold group-hover:text-white transition-colors truncate">{tech}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="rounded-xl bg-[#050505] border border-neutral-900 overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-900 bg-neutral-950">
                          <div className="w-3 h-3 rounded-full bg-red-500/70" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                          <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                          <span className="ml-3 text-neutral-700 text-xs font-mono">tech_stack.json</span>
                        </div>
                        <div className="p-5 font-mono text-sm">
                          <span className="text-neutral-600">{'{'}</span>
                          <div className="ml-4 mt-1">
                            <span className="text-amber-300">"project"</span><span className="text-neutral-600">: </span>
                            <span className="text-emerald-300">"{project.title}"</span><span className="text-neutral-600">,</span>
                          </div>
                          <div className="ml-4">
                            <span className="text-amber-300">"stack"</span><span className="text-neutral-600">: [</span>
                            <div className="ml-4">
                              {techStack.map((t, i) => (
                                <div key={t}>
                                  <span className="text-red-300">"{t}"</span>
                                  {i < techStack.length - 1 && <span className="text-neutral-600">,</span>}
                                </div>
                              ))}
                            </div>
                            <span className="text-neutral-600">]</span>
                          </div>
                          <div className="mt-1 text-neutral-600">{'}'}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-neutral-600 text-sm font-mono">// No tech stack data available</p>
                  )}
                </GlowCard>
              )}

              {/* DETAILS */}
              {activeTab === 'details' && (
                <GlowCard className="p-8">
                  <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Shield size={15} className="text-red-500" /> Project Metadata
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { label: 'Project ID', value: project.id || 'N/A', mono: true },
                      { label: 'Slug', value: slug, mono: true },
                      { label: 'Views', value: (project.views_count || 0) + 1 },
                      { label: 'Featured', value: project.is_featured ? 'Yes' : 'No' },
                      { label: 'Status', value: project.status || 'Active' },
                      { label: 'Type', value: project.project_type || 'Full-Stack App' },
                      { label: 'Created', value: new Date(project.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                      { label: 'Tech Count', value: `${techStack.length} technologies` },
                    ].map(({ label, value, mono }) => (
                      <div key={label} className="flex items-center justify-between py-3 px-4 rounded-xl bg-neutral-900 border border-neutral-800">
                        <span className="text-neutral-600 text-xs uppercase tracking-wider font-bold">{label}</span>
                        <span className={`text-neutral-300 text-xs font-bold ${mono ? 'font-mono' : ''}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Nav */}
          <motion.div variants={fadeUp} className="mt-16 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white text-xs font-black uppercase tracking-widest transition-all">
              <ArrowLeft size={14} /> All Projects
            </Link>
            <div className="flex items-center gap-2 text-neutral-700 text-xs font-mono">
              <Lock size={11} className="text-red-700" /> Sanjat Kumar · Portfolio 2026
            </div>
            <div className="flex gap-3">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white text-xs font-black uppercase tracking-widest transition-all">
                  <GitBranch size={13} /> Source
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-black uppercase tracking-widest transition-all">
                  <Globe size={13} /> Live App
                </a>
              )}
            </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}