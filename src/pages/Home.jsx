import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, Briefcase, Shield,
  Terminal, Database, Cloud, Code2, ArrowRight,
  Send, CheckCircle, Copy, ExternalLink, Award, Users,
  Zap, Globe, GitBranch, Mail, Phone, MapPin,
  ChevronRight, Star, TrendingUp, Cpu, Lock, X, Menu,
  Download, Filter, MessageCircle, Minus, Maximize2
} from 'lucide-react';

// ─── TYPED ANIMATION HOOK ───────────────────
function useTyped(strings, speed = 80, pause = 1800) {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = strings[idx % strings.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setDeleting(true), pause);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) { setDeleting(false); setIdx(i => i + 1); }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, strings, speed, pause]);
  return text;
}

// ─── NOISE OVERLAY ──────────────────────────
function NoiseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '200px' }} />
  );
}

// ─── STAT COUNTER ───────────────────────────
function StatCounter({ value, label, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    const target = parseInt(value);
    const step = target / (1500 / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [visible, value]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-black text-white font-mono">{prefix}{count}{suffix}</div>
      <div className="text-xs text-neutral-500 uppercase tracking-widest mt-1 font-semibold">{label}</div>
    </div>
  );
}

// ─── SKILL PILL ─────────────────────────────
function SkillPill({ skill }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-red-800 hover:text-red-400 transition-all duration-200 cursor-default">
      {skill}
    </span>
  );
}

// ─── SECTION HEADER ─────────────────────────
function SectionHeader({ eyebrow, title, accent }) {
  return (
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-8 bg-red-600"></div>
        <span className="text-red-500 text-xs font-black tracking-[0.3em] uppercase font-mono">{eyebrow}</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
        {title} <span className="text-red-500">{accent}</span>
      </h2>
    </div>
  );
}

// ─── GLOW CARD ──────────────────────────────
function GlowCard({ children, className = '' }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const ref = useRef();
  return (
    <div ref={ref}
      onMouseMove={(e) => { const r = ref.current.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative overflow-hidden rounded-2xl border border-neutral-800/60 bg-neutral-950 transition-all duration-300 ${hover ? 'border-red-900/60' : ''} ${className}`}>
      {hover && <div className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, rgba(127,29,29,0.12), transparent 70%)` }} />}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── CLI BADGE ──────────────────────────────
function CLIBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-400">
      <span className="text-red-500">$</span> {children}
    </span>
  );
}

// ─── WHATSAPP FLOATING BUTTON ────────────────
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917870353493?text=Hi%20Sanjat!%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect."
      target="_blank" rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-green-900/50 group"
      style={{ backgroundColor: '#25D366' }}
      title="Chat on WhatsApp"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span className="text-white text-xs font-black uppercase tracking-wider hidden sm:block">Chat Now</span>
    </a>
  );
}

// ─── EMBEDDED TERMINAL SECTION COMPONENT ────────────────────
function TerminalAbout() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'VAULT OS v2.0.4 [Secure Connection Established]' },
    { type: 'system', text: 'Type "help" to view available commands.' }
  ]);
  const terminalScrollRef = useRef(null);

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      let output = [];
      if (cmd === '') return;

      switch (cmd) {
        case 'help':
          output = [
            'Available commands:',
            '  whoami     - Display user identity & bio',
            '  skills     - List technical capabilities',
            '  education  - Show academic records',
            '  experience - Show professional background',
            '  clear      - Clear terminal screen'
          ];
          break;
        case 'whoami':
          output = [
            'NAME: Sanjat Kumar',
            'ROLE: Full-Stack Software Engineer & Founder @ MandalNet',
            'LOCATION: Chandigarh, India',
            'MISSION: Architecting scalable backends and high-performance frontends.'
          ];
          break;
        case 'skills':
          output = [
            '> FRONTEND: React, Flutter, Tailwind CSS, Next.js',
            '> BACKEND: Django REST Framework, Node.js, NestJS',
            '> DATABASE: PostgreSQL, MongoDB, Redis',
            '> DEVOPS: AWS EC2, Docker, Linux Server Management'
          ];
          break;
        case 'education':
          output = [
            '[2024 - 2026] Bachelor of Computer Applications',
            'Chandigarh University (GPA: 8.22)',
            'Focus: Core Computer Science, Advanced Programming Logic.'
          ];
          break;
        case 'experience':
          output = [
            '[PRESENT] Lead Developer @ Maa Enterprises',
            ' - Architected multi-tenant SaaS CRM.',
            '[2025] SDE Intern @ Zidio Development',
            ' - Developed responsive MERN Stack web apps.'
          ];
          break;
        case 'sudo':
        case 'su':
          output = ["bash: sudo: Access Denied. This incident will be reported."];
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        default:
          output = [`bash: ${cmd}: command not found. Type "help" for a list of commands.`];
      }

      setHistory(prev => [
        ...prev, 
        { type: 'user', text: `guest@sanjat-vault:~$ ${cmd}` },
        ...output.map(text => ({ type: 'output', text }))
      ]);
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-neutral-800/60 bg-neutral-950 shadow-2xl font-mono transition-all hover:border-red-900/40 hover:shadow-red-900/10">
      <div className="bg-neutral-900/80 px-3 md:px-4 py-3 flex justify-between items-center border-b border-neutral-800/60 backdrop-blur-sm">
        <div className="flex gap-1.5 md:gap-2">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500/80"></div>
        </div>
        <div className="flex items-center gap-2 text-neutral-500 text-[10px] md:text-xs font-bold tracking-widest uppercase">
          <Terminal size={12} className="hidden md:block" /> guest@vault-server
        </div>
        <div className="flex gap-2 md:gap-3 text-neutral-600">
          <Minus size={14} className="hover:text-neutral-400 cursor-pointer hidden md:block" />
          <Maximize2 size={14} className="hover:text-neutral-400 cursor-pointer hidden md:block" />
          <X size={14} className="hover:text-red-500 cursor-pointer" />
        </div>
      </div>

      <div 
        ref={terminalScrollRef}
        className="p-4 md:p-6 h-[300px] md:h-[400px] overflow-y-auto text-xs md:text-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {history.map((line, index) => (
          <div key={index} className={`mb-1.5 leading-relaxed break-words ${line.type === 'system' ? 'text-emerald-400' : line.type === 'user' ? 'text-white font-bold mt-4 md:mt-5' : 'text-neutral-400 ml-2 md:ml-4'}`}>
            {line.text}
          </div>
        ))}
        <div className="flex items-start md:items-center mt-4 md:mt-5 text-red-500 font-bold flex-col md:flex-row">
          <span className="mr-3 whitespace-nowrap mb-1 md:mb-0">guest@sanjat-vault:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-grow bg-transparent outline-none text-white font-normal placeholder-neutral-700 w-full"
            autoFocus
            spellCheck="false"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

// ─── TERMINAL EASTER EGG (CTRL+K) ────────────────────
function TerminalEasterEgg({ onClose }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Sanjat Kumar — Interactive Terminal v1.0' },
    { type: 'system', text: 'Type "help" for available commands.' },
  ]);
  const inputRef = useRef();
  const bottomRef = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

  const commands = {
    help: () => ['whoami', 'skills', 'projects', 'contact', 'experience', 'clear', 'exit'].map(c => `  ${c}`).join('\n'),
    whoami: () => 'Sanjat Kumar — Full-Stack Engineer, BCA @ Chandigarh University (GPA 8.22)\nMohali, Punjab, India',
    skills: () => 'React · Flutter · Django · Node.js · NestJS · PostgreSQL · Redis · AWS · Docker',
    contact: () => 'Email   : sanjatkumar18@gmail.com\nPhone   : +91 78703 53493\nLinkedIn: linkedin.com/in/sanjatkumar',
    experience: () => '2025-Present : Lead Developer @ Maa Enterprises (INR 2.5L contract)\n2025        : Intern @ Zidio Development Pvt. Ltd.',
    projects: () => 'Universal CRM · Student Nagari · Face-AI · Master Calculation\n→ Type "projects" in browser for details',
    clear: () => { setHistory([]); return null; },
    exit: () => { onClose(); return null; },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, { type: 'input', text: `sanjat@portfolio:~$ ${input}` }];
    if (commands[cmd]) {
      const result = commands[cmd]();
      if (result !== null && result !== undefined) newHistory.push({ type: 'output', text: result });
    } else if (cmd) {
      newHistory.push({ type: 'error', text: `Command not found: ${cmd}. Type "help".` });
    }
    setHistory(newHistory);
    setInput('');
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden border border-neutral-700 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 text-neutral-500 text-xs font-mono">sanjat@portfolio:~</span>
          </div>
          <button onClick={onClose} className="text-neutral-600 hover:text-white transition-colors"><X size={14} /></button>
        </div>
        <div className="bg-[#0d0d0d] p-5 h-80 overflow-y-auto font-mono text-sm">
          {history.map((line, i) => (
            <div key={i} className={`mb-1 ${line.type === 'input' ? 'text-emerald-400' : line.type === 'error' ? 'text-red-400' : line.type === 'system' ? 'text-neutral-500' : 'text-neutral-300'} whitespace-pre-wrap`}>
              {line.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-3 bg-[#0d0d0d] border-t border-neutral-900">
          <span className="text-emerald-400 font-mono text-sm shrink-0">sanjat@portfolio:~$</span>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            className="flex-1 bg-transparent text-white font-mono text-sm focus:outline-none placeholder:text-neutral-700"
            placeholder="type a command..." autoComplete="off" />
        </form>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────
export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: false });
  const [copied, setCopied] = useState(false);

  const typedRole = useTyped(['Full-Stack Developer.', 'Backend Architect.', 'Mobile Engineer.', 'Cloud & DevOps.'], 75, 2000);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  // Ctrl+K terminal shortcut
  useEffect(() => {
    const handler = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setTerminalOpen(t => !t); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/projects/')
      .then(r => { setProjects(r.data); setFilteredProjects(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Filter logic
  const filterCategories = ['All', 'React', 'Flutter', 'Django', 'AI', 'AWS'];
  const handleFilter = (cat) => {
    setActiveFilter(cat);
    if (cat === 'All') { setFilteredProjects(projects); return; }
    setFilteredProjects(projects.filter(p => {
      const stack = Array.isArray(p.tech_stack) ? p.tech_stack.join(' ') : (p.tech_stack || '');
      const desc = (p.description || '') + (p.title || '') + (p.tagline || '');
      return stack.toLowerCase().includes(cat.toLowerCase()) || desc.toLowerCase().includes(cat.toLowerCase());
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: false });
    try {
      await axios.post('http://127.0.0.1:8000/api/contact/', formData);
      setFormStatus({ loading: false, success: true, error: false });
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus(p => ({ ...p, success: false })), 5000);
    } catch { setFormStatus({ loading: false, success: false, error: true }); }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('sanjatkumar18@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const techStackBar = [
    { icon: Code2, label: 'Frontend', stack: 'React · Flutter · Next.js', color: 'text-blue-400' },
    { icon: Terminal, label: 'Backend', stack: 'Django · Node.js · NestJS', color: 'text-emerald-400' },
    { icon: Database, label: 'Database', stack: 'PostgreSQL · Redis · MongoDB', color: 'text-amber-400' },
    { icon: Cloud, label: 'DevOps', stack: 'AWS EC2 · Docker · Firebase', color: 'text-purple-400' },
  ];

  const experiences = [
    {
      period: 'Dec 2025 – Present', role: 'Lead Developer & System Architect', company: 'Maa Enterprises',
      type: 'Freelance · Remote', status: 'active',
      highlights: [
        'Architected multi-tenant SaaS CRM — 5 modules, 5 RBAC roles, INR 2,50,000 contract',
        'Led 3-engineer Agile team; integrated Razorpay, WhatsApp API, SendGrid',
        'Designed scalable REST APIs, PostgreSQL schemas, Docker + AWS EC2 deployment',
      ],
      tech: ['React.js', 'NestJS', 'Django REST', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
    },
    {
      period: 'Aug 2025 – Oct 2025', role: 'Web Application Development Intern', company: 'Zidio Development Pvt. Ltd.',
      type: 'Remote', status: 'done',
      highlights: [
        'Developed responsive MERN Stack web applications end-to-end',
        'Executed test cases, performed root cause analysis, compiled MIS reports',
      ],
      tech: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Git'],
    },
  ];

  const skills = {
    Languages: ['JavaScript (ES6+)', 'Python', 'Java', 'C/C++', 'Dart', 'SQL', 'PL/SQL'],
    Frontend: ['React.js', 'Next.js', 'Flutter', 'Tailwind CSS', 'Framer Motion', 'HTML5', 'CSS3'],
    Backend: ['Django REST', 'Node.js', 'NestJS', 'FastAPI', 'REST APIs', 'Microservices'],
    'Cloud & DevOps': ['AWS EC2', 'Docker', 'Firebase', 'CI/CD', 'Git', 'GitHub'],
    Databases: ['PostgreSQL', 'Redis', 'MongoDB', 'pgvector', 'Cloud Firestore'],
    Integrations: ['Razorpay', 'WhatsApp API', 'SendGrid', 'Gemini API', 'Dlib', 'RBAC'],
  };

  const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-200 font-sans antialiased selection:bg-red-900/40 selection:text-red-300">
      <NoiseOverlay />
      <WhatsAppButton />

      {/* Terminal Easter Egg (Ctrl+K) */}
      <AnimatePresence>
        {terminalOpen && <TerminalEasterEgg onClose={() => setTerminalOpen(false)} />}
      </AnimatePresence>

      {/* Ambient Glows */}
      <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-red-950/20 rounded-full blur-[180px] pointer-events-none -z-0" />
      <div className="fixed bottom-[10%] left-0 w-[400px] h-[500px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* ══════════════ HEADER ══════════════ */}
      <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-900/80 bg-[#080808]/90 backdrop-blur-xl px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
         {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Box image */}
              <div className="w-9 h-9 rounded-lg overflow-hidden shadow-lg shadow-red-900/50 flex items-center justify-center bg-neutral-900">
                <img 
                  src="/logo.png" 
                  alt="Sanjat Logo" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#080808] animate-pulse" />
            </div>
            <div>
              <div className="text-white font-black text-sm tracking-widest uppercase font-mono">SANJAT KUMAR</div>
              <div className="text-neutral-600 text-[9px] tracking-[0.25em] uppercase font-semibold flex items-center gap-1">
                <Shield size={8} className="text-red-600" /> Full-Stack Engineer
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-neutral-950 border border-neutral-800/60 rounded-full px-2 py-1.5">
            {[
              { label: 'Home', href: '#', icon: LayoutDashboard },
              { label: 'Experience', href: '#experience', icon: Briefcase },
              { label: 'Projects', href: '#projects', icon: FolderOpen },
              { label: 'Skills', href: '#skills', icon: Cpu },
              { label: 'Contact', href: '#contact', icon: Mail },
            ].map(({ label, href, icon: Icon }) => (
              <a key={label} href={href}
                className="flex items-center gap-1.5 px-4 py-2 text-neutral-400 hover:text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all hover:bg-neutral-900">
                <Icon size={12} /> {label}
              </a>
            ))}
          </nav>

          {/* Right buttons */}
          <div className="flex items-center gap-2">
            <button onClick={() => setTerminalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-red-900 text-neutral-600 hover:text-red-400 text-[10px] font-mono transition-all"
              title="Open Terminal">
              <Terminal size={12} /> <span>Ctrl+K</span>
            </button>
            <a href="https://github.com/Sanjat123" target="_blank" rel="noreferrer"
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 hover:border-red-800 transition-colors">
              <GitBranch size={14} className="text-neutral-400" />
            </a>
            <a href="https://www.linkedin.com/in/sanjatkumar/" target="_blank" rel="noreferrer"
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 hover:border-blue-800 transition-colors">
              <ExternalLink size={14} className="text-neutral-400" />
            </a>
            <a href="/resume/Sanjat_Kumar_Resume.pdf" download
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-emerald-800 text-neutral-400 hover:text-emerald-400 text-xs font-black uppercase tracking-wider rounded-lg transition-all">
              <Download size={13} /> CV
            </a>
            <a href="#contact"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-lg shadow-red-950/40">
              Hire Me <Zap size={12} />
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-800">
              {menuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-neutral-900 mt-3 pt-3">
              {['Home', 'Experience', 'Projects', 'Skills', 'Contact'].map(item => (
                <a key={item} href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 px-2 text-sm font-bold text-neutral-400 hover:text-white uppercase tracking-widest">
                  {item}
                </a>
              ))}
              <a href="/resume/Sanjat_Kumar_Resume.pdf" download
                className="flex items-center gap-2 py-2.5 px-2 text-sm font-bold text-emerald-400 uppercase tracking-widest">
                <Download size={14} /> Download CV
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="relative z-10 pt-20">

        {/* ══════════════ HERO ══════════════ */}
        <section className="min-h-screen flex items-center px-6 py-24 max-w-7xl mx-auto">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="w-full">
            <div className="grid lg:grid-cols-[1fr_440px] gap-16 items-center">

              {/* Left */}
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8 flex-wrap">
                  <CLIBadge>status --online</CLIBadge>
                  <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    Available for hire
                  </span>
                  <button onClick={() => setTerminalOpen(true)}
                    className="flex items-center gap-1.5 text-neutral-700 hover:text-red-400 text-xs font-mono transition-colors">
                    <Terminal size={11} /> Press Ctrl+K
                  </button>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <p className="text-red-500 text-sm font-black tracking-[0.3em] uppercase font-mono mb-3">Sanjat Kumar</p>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.02] tracking-tight mb-3">
                    Building systems<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-orange-400">that scale.</span>
                  </h1>
                  <div className="h-14 flex items-center mt-4 mb-8">
                    <span className="text-2xl md:text-3xl font-bold text-neutral-400 font-mono">
                      {typedRole}<span className="animate-pulse text-red-500 ml-0.5">|</span>
                    </span>
                  </div>
                </motion.div>

                <motion.p variants={fadeUp} className="text-neutral-400 text-lg leading-relaxed max-w-xl mb-10">
                  BCA student at Chandigarh University (GPA 8.22) with real production experience —
                  delivered <span className="text-white font-semibold">3 signed enterprise contracts</span>,
                  led a <span className="text-white font-semibold">3-engineer team</span>, and shipped
                  <span className="text-white font-semibold"> 4 apps</span> to 500+ users.
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-12">
                  <a href="#projects"
                    className="flex items-center gap-2 px-6 py-3.5 bg-red-700 hover:bg-red-600 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-red-950/40 transition-all hover:-translate-y-0.5">
                    <FolderOpen size={16} /> View Projects
                  </a>
                  <a href="/resume/Sanjat_Kumar_Resume.pdf" download
                    className="flex items-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-emerald-950/30 transition-all hover:-translate-y-0.5">
                    <Download size={16} /> Download CV
                  </a>
                  <a href="#contact"
                    className="flex items-center gap-2 px-5 py-3.5 bg-transparent border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all">
                    <Terminal size={16} className="text-red-500" /> Let's Talk
                  </a>
                  <button onClick={copyEmail}
                    className="flex items-center gap-2 px-4 py-3.5 border border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
                    {copied ? <><CheckCircle size={14} className="text-emerald-400" /> Copied!</> : <><Copy size={14} /> Email</>}
                  </button>
                </motion.div>

                {/* Stats */}
                <motion.div variants={fadeUp} className="grid grid-cols-4 gap-6 pt-8 border-t border-neutral-900">
                  <StatCounter value="3" label="Contracts" prefix="₹" suffix="L+" />
                  <StatCounter value="500" label="Users" suffix="+" />
                  <StatCounter value="4" label="Live Apps" />
                  <StatCounter value="8" label="GPA" suffix=".22" />
                </motion.div>
              </motion.div>

              {/* Right — 🔥 Hero Photo + Terminal Card */}
              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4">

                <GlowCard className="p-0 overflow-hidden">
                  <div className="relative">
                    <img src="/hero.png" alt="Sanjat Kumar — Full Stack Engineer" className="w-full object-cover object-top" style={{ maxHeight: '380px' }} />
                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-neutral-950 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-black text-base">Sanjat Kumar</div>
                          <div className="text-neutral-400 text-xs font-mono">Full-Stack Engineer · BCA @ CU</div>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                          <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Open to Work</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-xl bg-black/70 border border-neutral-700 backdrop-blur-sm">
                      <div className="text-white text-xs font-black font-mono">GPA 8.22</div>
                      <div className="text-neutral-500 text-[9px]">Chandigarh Uni</div>
                    </div>
                  </div>
                </GlowCard>

                <GlowCard className="p-0 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800/60 bg-neutral-950">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setTerminalOpen(true)} title="Open terminal" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-3 text-neutral-600 text-xs font-mono">about.sh — Press Ctrl+K to interact</span>
                  </div>
                  <div className="p-4 font-mono text-xs space-y-1.5">
                    {[
                      { label: 'name', value: '"Sanjat Kumar"', color: 'text-amber-300' },
                      { label: 'role', value: '"Full-Stack Engineer"', color: 'text-emerald-300' },
                      { label: 'location', value: '"Mohali, Punjab IN"', color: 'text-blue-300' },
                      { label: 'contracts', value: '["Maa Enterprises", "Zidio Dev"]', color: 'text-red-300' },
                      { label: 'status', value: '"open_to_work"', color: 'text-emerald-400' },
                    ].map((line, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex gap-2 flex-wrap">
                        <span className="text-neutral-600">const</span>
                        <span className="text-red-400">{line.label}</span>
                        <span className="text-neutral-500">=</span>
                        <span className={line.color}>{line.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlowCard>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Award, text: 'HackerRank Certified', sub: 'Software Engineer', color: 'text-amber-400' },
                    { icon: Globe, text: 'Play Store', sub: '4 apps published', color: 'text-emerald-400' },
                    { icon: Users, text: 'Team Lead', sub: '3 engineers', color: 'text-blue-400' },
                    { icon: TrendingUp, text: 'INR 3.6L+', sub: 'Delivered', color: 'text-red-400' },
                  ].map(({ icon: Icon, text, sub, color }) => (
                    <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800/60">
                      <Icon size={16} className={color} />
                      <div>
                        <div className="text-white text-xs font-bold">{text}</div>
                        <div className="text-neutral-600 text-[10px]">{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════ INTERACTIVE TERMINAL ABOUT (NEW EMBEDDED) ══════════════ */}
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionHeader eyebrow="System Profiler" title="Interactive" accent="Terminal." />
              <p className="text-neutral-400 text-sm mb-10 max-w-2xl leading-relaxed">
                Want to know more about my background? Access the secure terminal below and execute system commands to extract my professional records.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp}>
              <TerminalAbout />
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════ TECH STACK BAR ══════════════ */}
        <section className="px-6 py-12 border-y border-neutral-900/60 bg-neutral-950/40">
          <div className="max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {techStackBar.map(({ icon: Icon, label, stack, color }) => (
                <motion.div key={label} variants={fadeUp} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-neutral-700 transition-colors shrink-0">
                    <Icon size={22} className={color} />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{label}</div>
                    <div className="text-neutral-600 text-xs mt-0.5">{stack}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════ EXPERIENCE ══════════════ */}
        <section id="experience" className="px-6 py-28 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.div variants={fadeUp}><SectionHeader eyebrow="Work History" title="What I've" accent="Built." /></motion.div>
            <div className="space-y-6">
              {experiences.map((exp, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <GlowCard className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {exp.status === 'active' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live
                            </span>
                          )}
                          <span className="text-neutral-600 text-xs font-mono">{exp.period}</span>
                        </div>
                        <h3 className="text-xl font-black text-white mb-1">{exp.role}</h3>
                        <p className="text-red-500 text-sm font-bold uppercase tracking-wider">{exp.company}</p>
                        <p className="text-neutral-600 text-xs mt-0.5">{exp.type}</p>
                      </div>
                    </div>
                    <ul className="space-y-2.5 mb-6">
                      {exp.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-3 text-neutral-400 text-sm leading-relaxed">
                          <ChevronRight size={14} className="text-red-600 mt-0.5 shrink-0" />{h}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">{exp.tech.map(t => <SkillPill key={t} skill={t} />)}</div>
                  </GlowCard>
                </motion.div>
              ))}

              {/* Education */}
              <motion.div variants={fadeUp}>
                <GlowCard className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                      <Award size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <span className="text-neutral-600 text-xs font-mono">Jun 2024 – Present</span>
                      <h3 className="text-lg font-black text-white mt-1">Bachelor of Computer Applications</h3>
                      <p className="text-red-500 text-sm font-bold uppercase tracking-wider mt-0.5">Chandigarh University</p>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="flex items-center gap-1.5 text-amber-400 text-sm font-bold"><Star size={14} /> GPA: 8.22 / 10.00</span>
                        <span className="text-neutral-700">·</span>
                        <span className="text-neutral-500 text-xs">DSA · OOP · DBMS · Web Dev · System Design</span>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════ PROJECTS ══════════════ */}
        <section id="projects" className="px-6 py-28 bg-neutral-950/30 border-y border-neutral-900/40">
          <div className="max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
              <motion.div variants={fadeUp}><SectionHeader eyebrow="Portfolio" title="Things I've" accent="Shipped." /></motion.div>

              {/* PROJECT FILTER TABS */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-10">
                <div className="flex items-center gap-2 mr-2">
                  <Filter size={14} className="text-neutral-600" />
                  <span className="text-neutral-600 text-xs font-bold uppercase tracking-widest">Filter:</span>
                </div>
                {filterCategories.map(cat => (
                  <button key={cat} onClick={() => handleFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                      activeFilter === cat
                        ? 'bg-red-700 text-white shadow-lg shadow-red-950/40'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                    }`}>
                    {cat}
                  </button>
                ))}
                {activeFilter !== 'All' && (
                  <span className="flex items-center gap-1.5 px-3 py-2 text-xs text-neutral-600 font-mono">
                    {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
                  </span>
                )}
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div key={activeFilter} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="rounded-2xl border border-neutral-900 bg-neutral-950 p-6 animate-pulse">
                        <div className="h-4 w-2/3 bg-neutral-800 rounded mb-3" />
                        <div className="h-3 w-1/3 bg-neutral-800 rounded mb-6" />
                        <div className="space-y-2">
                          <div className="h-3 bg-neutral-800 rounded" />
                          <div className="h-3 bg-neutral-800 rounded w-5/6" />
                        </div>
                      </div>
                    ))
                    : filteredProjects.length === 0
                      ? (
                        <div className="col-span-3 text-center py-16">
                          <div className="text-neutral-700 text-sm font-mono mb-2">// No projects found for "{activeFilter}"</div>
                          <button onClick={() => handleFilter('All')} className="text-red-500 text-xs font-bold uppercase tracking-widest hover:text-red-400 transition-colors">
                            Clear filter
                          </button>
                        </div>
                      )
                      : filteredProjects.map((project, i) => (
                        <motion.div key={project.id} variants={fadeUp} custom={i}>
                          <GlowCard className="p-6 h-full flex flex-col group">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-base font-black text-white group-hover:text-red-400 transition-colors leading-tight">
                                  {project.title}
                                </h3>
                                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">{project.tagline}</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                                {project.github_url && (
                                  <a href={project.github_url} target="_blank" rel="noreferrer"
                                    className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-600 flex items-center justify-center transition-colors">
                                    <GitBranch size={13} className="text-neutral-500" />
                                  </a>
                                )}
                                {project.live_url && (
                                  <a href={project.live_url} target="_blank" rel="noreferrer"
                                    className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-red-800 flex items-center justify-center transition-colors">
                                    <ExternalLink size={13} className="text-neutral-500 hover:text-red-400" />
                                  </a>
                                )}
                              </div>
                            </div>
                            <p className="text-neutral-500 text-sm leading-relaxed flex-grow mb-5 line-clamp-3">{project.description}</p>
                            <div className="flex flex-wrap gap-1.5 mb-5">
                              {(Array.isArray(project.tech_stack) ? project.tech_stack : (project.tech_stack || '').split(',')).slice(0, 4).map(t => (
                                <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-500 font-mono">{t.trim()}</span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-neutral-900">
                              <span className="flex items-center gap-1 text-[10px] text-neutral-600 font-mono">
                                <Shield size={10} className="text-red-600" /> {project.views_count || 0} views
                              </span>
                              <Link to={`/project/${project.slug}`}
                                className="flex items-center gap-1.5 text-xs font-black text-neutral-400 hover:text-red-400 transition-colors uppercase tracking-wider">
                                Details <ArrowRight size={12} />
                              </Link>
                            </div>
                          </GlowCard>
                        </motion.div>
                      ))
                  }
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ══════════════ SKILLS ══════════════ */}
        <section id="skills" className="px-6 py-28 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.div variants={fadeUp}><SectionHeader eyebrow="Tech Arsenal" title="Tools I" accent="Master." /></motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(skills).map(([category, items]) => (
                <motion.div key={category} variants={fadeUp}>
                  <GlowCard className="p-5 h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-5 rounded-full bg-red-600" />
                      <h3 className="text-white font-black text-sm uppercase tracking-wider">{category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">{items.map(s => <SkillPill key={s} skill={s} />)}</div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>

            {/* Certifications */}
            <motion.div variants={fadeUp} className="mt-8">
              <GlowCard className="p-6 md:p-8">
                <h3 className="text-white font-black text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                  <Award size={16} className="text-amber-400" /> Certifications
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: 'HackerRank Software Engineer', issuer: 'HackerRank', color: 'border-emerald-800/40 bg-emerald-950/20' },
                    { title: 'IBM Data Analysis with Python', issuer: 'IBM', color: 'border-blue-800/40 bg-blue-950/20' },
                    { title: 'Internship Excellence Award', issuer: 'Zidio Development', color: 'border-amber-800/40 bg-amber-950/20' },
                  ].map(cert => (
                    <div key={cert.title} className={`rounded-xl p-4 border ${cert.color}`}>
                      <div className="text-white text-sm font-bold mb-1">{cert.title}</div>
                      <div className="text-neutral-600 text-xs">{cert.issuer}</div>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════ CONTACT ══════════════ */}
        <section id="contact" className="px-6 py-28 bg-neutral-950/40 border-t border-neutral-900/60">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}><SectionHeader eyebrow="Get In Touch" title="Open for" accent="Opportunities." /></motion.div>

              <div className="grid md:grid-cols-[380px_1fr] gap-10">
                <motion.div variants={fadeUp} className="space-y-4">
                  <GlowCard className="p-6">
                    <h3 className="text-white font-black text-base mb-2">Let's build something great</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                      Open to internships, freelance contracts, and full-time SDE roles. Fast response guaranteed.
                    </p>
                    {[
                      { icon: Phone, text: '+91 78703 53493', href: 'tel:+917870353493' },
                      { icon: Mail, text: 'sanjatkumar18@gmail.com', href: 'mailto:sanjatkumar18@gmail.com' },
                      { icon: MapPin, text: 'Mohali, Punjab, India', href: '#' },
                    ].map(({ icon: Icon, text, href }) => (
                      <a key={text} href={href} className="flex items-center gap-3 mb-4 text-sm text-neutral-400 hover:text-white transition-colors group">
                        <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-red-900 flex items-center justify-center shrink-0 transition-colors">
                          <Icon size={15} className="text-red-500" />
                        </div>
                        {text}
                      </a>
                    ))}
                  </GlowCard>

                  <GlowCard className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock size={13} className="text-emerald-400" />
                      <span className="text-xs text-neutral-500 font-mono">secure_channel.init()</span>
                    </div>
                    <div className="flex gap-3">
                      <a href="https://github.com/Sanjat123" target="_blank" rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-xs font-bold text-neutral-400 hover:text-white transition-all">
                        <GitBranch size={15} /> GitHub
                      </a>
                      <a href="https://www.linkedin.com/in/sanjatkumar/" target="_blank" rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-blue-800 text-xs font-bold text-neutral-400 hover:text-blue-400 transition-all">
                        <ExternalLink size={15} /> LinkedIn
                      </a>
                    </div>
                    {/* 🔥 WhatsApp direct contact */}
                    <a href="https://wa.me/917870353493?text=Hi%20Sanjat!%20I%20saw%20your%20portfolio."
                      target="_blank" rel="noreferrer"
                      className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white uppercase tracking-wider transition-all"
                      style={{ backgroundColor: '#25D366' }}>
                      <MessageCircle size={15} /> WhatsApp Me
                    </a>
                  </GlowCard>

                  {/* 🔥 Resume download card */}
                  <GlowCard className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-black text-sm mb-1">My Resume</div>
                        <div className="text-neutral-600 text-xs">Updated June 2026 · PDF</div>
                      </div>
                      <a href="/resume/Sanjat_Kumar_Resume.pdf" download
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all">
                        <Download size={14} /> Download
                      </a>
                    </div>
                  </GlowCard>
                </motion.div>

                {/* Contact Form */}
                <motion.div variants={fadeUp}>
                  <GlowCard className="p-6 md:p-8">
                    <form onSubmit={handleContactSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="text-[10px] font-black tracking-widest uppercase text-neutral-600 block mb-2 font-mono">
                            <span className="text-red-600">01</span> Name
                          </label>
                          <input type="text" required value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your full name"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-700 focus:outline-none focus:border-red-800 transition-colors" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black tracking-widest uppercase text-neutral-600 block mb-2 font-mono">
                            <span className="text-red-600">02</span> Email
                          </label>
                          <input type="email" required value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-700 focus:outline-none focus:border-red-800 transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black tracking-widest uppercase text-neutral-600 block mb-2 font-mono">
                          <span className="text-red-600">03</span> Message
                        </label>
                        <textarea rows={5} required value={formData.message}
                          onChange={e => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell me about the project, role, or opportunity..."
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-700 focus:outline-none focus:border-red-800 transition-colors resize-none" />
                      </div>
                      <button type="submit" disabled={formStatus.loading}
                        className="w-full py-4 rounded-xl bg-red-700 hover:bg-red-600 disabled:bg-neutral-900 disabled:text-neutral-700 text-white font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-red-950/30 flex items-center justify-center gap-2">
                        {formStatus.loading
                          ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Sending...</>
                          : formStatus.success
                            ? <><CheckCircle size={16} /> Message Sent!</>
                            : <><Send size={16} /> Send Message</>}
                      </button>
                      {formStatus.error && <p className="text-red-500 text-xs text-center font-bold uppercase tracking-widest">Failed to send. Try emailing directly.</p>}
                    </form>
                  </GlowCard>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer className="px-6 py-10 border-t border-neutral-900/60">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-3">
              {/* Footer mein bhi aapki image */}
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-neutral-900 flex items-center justify-center shadow-md shadow-red-900/20">
                <img src="/logo.png" alt="Sanjat Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-neutral-600 text-xs font-mono">Sanjat Kumar © 2026</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-700 text-xs font-mono">
              <Shield size={11} className="text-red-700" />
              Built with React · Django · PostgreSQL · AWS
            </div>
            <div className="flex items-center gap-4">
              {[{ href: '#experience', label: 'Experience' }, { href: '#projects', label: 'Projects' }, { href: '#contact', label: 'Contact' }].map(l => (
                <a key={l.label} href={l.href} className="text-neutral-700 hover:text-neutral-400 text-xs uppercase tracking-widest font-bold transition-colors">{l.label}</a>
              ))}
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}