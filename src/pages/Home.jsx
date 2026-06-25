import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  LayoutDashboard, FolderOpen, Briefcase, Shield,
  Terminal, Database, Cloud, Code2, ArrowRight,
  Send, CheckCircle, Copy, ExternalLink, Award, Users,
  Zap, Globe, GitBranch, Mail, Phone, MapPin,
  ChevronRight, Star, TrendingUp, Cpu, Lock, X, Menu,
  Download, Filter, MessageCircle, Minus, Maximize2,
  Sun, Moon
} from 'lucide-react';

// ─── HARDCODED PROJECT DATA ───
export const PROJECTS_DATA = [
  {
    id: 1,
    title: "Universal CRM Platform",
    slug: "universal-crm-platform",
    tagline: "Multi-tenant SaaS CRM System",
    description: "Architected a multi-tenant SaaS CRM with system design, REST API contracts, and database schema across 5 production modules.\nLed the team via Agile sprints and managed the end-to-end lifecycle from architecture to AWS deployment.\nIntegrated Razorpay, WhatsApp Business API, SendGrid, and SMS APIs with full RBAC.",
    tech_stack: ["React.js", "NestJS", "PostgreSQL", "Redis", "AWS", "Docker"],
    live_url: "",
    github_url: "",
    views_count: 342,
    is_featured: true,
    created_at: "2026-05-10T00:00:00Z"
  },
  {
    id: 2,
    title: "Student Nagari EdTech",
    slug: "student-nagari",
    tagline: "Production-grade EdTech App",
    description: "Built a production-grade Flutter + React.js Android app with Django REST APIs supporting RBAC, payments, and live-class management.\nManaged full deployment lifecycle on AWS EC2 with Cloud Firestore sync and published on Google Play Store.",
    tech_stack: ["Flutter", "React.js", "Django", "PostgreSQL", "AWS EC2", "Firebase"],
    live_url: "https://play.google.com/store/apps/details?id=com.studentnagari",
    github_url: "",
    views_count: 512,
    is_featured: true,
    created_at: "2026-04-01T00:00:00Z"
  },
  {
    id: 3,
    title: "Face-AI Photo Finder",
    slug: "face-ai-finder",
    tagline: "Facial Recognition Platform",
    description: "Developed facial recognition platform using FastAPI + Dlib (128-dim embeddings).\nImplemented pgvector similarity search and Docker + Redis for containerized async processing at scale.",
    tech_stack: ["FastAPI", "Python", "PostgreSQL", "pgvector", "Redis", "Docker", "AI"],
    live_url: "",
    github_url: "https://github.com/Sanjat123",
    views_count: 189,
    is_featured: false,
    created_at: "2026-03-15T00:00:00Z"
  },
  {
    id: 4,
    title: "Master Calculation AI",
    slug: "master-calculation-ai",
    tagline: "AI Financial Suite",
    description: "Built AI-powered Flutter financial calculator integrating Google Gemini API for natural language computations.\nImplemented Provider state management for scalability and performance.",
    tech_stack: ["Flutter", "Dart", "Gemini API", "Provider"],
    live_url: "https://play.google.com/store/apps/details?id=com.mastercalculation",
    github_url: "",
    views_count: 275,
    is_featured: false,
    created_at: "2026-05-01T00:00:00Z"
  }
];

// ─── TYPED ANIMATION HOOK ───
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

// ─── NOISE OVERLAY ───
function NoiseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.025]"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '200px' }} />
  );
}

// ─── STAT COUNTER ───
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
      <div className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white font-mono">{prefix}{count}{suffix}</div>
      <div className="text-xs text-neutral-500 uppercase tracking-widest mt-1 font-semibold">{label}</div>
    </div>
  );
}

// ─── SKILL PILL ───
function SkillPill({ skill }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-red-600 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 cursor-default shadow-sm dark:shadow-none">
      {skill}
    </span>
  );
}

// ─── SECTION HEADER ───
function SectionHeader({ eyebrow, title, accent }) {
  return (
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-8 bg-red-600"></div>
        <span className="text-red-600 dark:text-red-500 text-xs font-black tracking-[0.3em] uppercase font-mono">{eyebrow}</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
        {title} <span className="text-red-600 dark:text-red-500">{accent}</span>
      </h2>
    </div>
  );
}

// ─── GLOW CARD ───
function GlowCard({ children, className = '' }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const ref = useRef();
  return (
    <div ref={ref}
      onMouseMove={(e) => { const r = ref.current.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800/60 bg-white dark:bg-neutral-950 shadow-lg shadow-neutral-200/50 dark:shadow-none transition-all duration-300 ${hover ? 'border-red-300 dark:border-red-900/60' : ''} ${className}`}>
      {hover && <div className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, rgba(220,38,38,0.08), transparent 70%)` }} />}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── CLI BADGE ───
function CLIBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-xs text-neutral-600 dark:text-neutral-400">
      <span className="text-red-600 dark:text-red-500">$</span> {children}
    </span>
  );
}

// ─── WHATSAPP FLOATING BUTTON ───
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917870353493?text=Hi%20Sanjat!%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect."
      target="_blank" rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-green-900/50 group"
      style={{ backgroundColor: '#25D366' }}
      title="Chat on WhatsApp"
    >
      <MessageCircle size={22} className="text-white" />
      <span className="text-white text-xs font-black uppercase tracking-wider hidden sm:block">Chat Now</span>
    </a>
  );
}

// ─── EMBEDDED TERMINAL SECTION COMPONENT (ALWAYS DARK) ───
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

  // Terminal is intentionally forced to remain dark theme for the hacker vibe
  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-neutral-800/60 bg-[#080808] shadow-2xl font-mono transition-all hover:border-red-900/40">
      <div className="bg-[#111] px-3 md:px-4 py-3 flex justify-between items-center border-b border-neutral-800/60">
        <div className="flex gap-1.5 md:gap-2">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500/80"></div>
        </div>
        <div className="flex items-center gap-2 text-neutral-400 text-[10px] md:text-xs font-bold tracking-widest uppercase">
          <Terminal size={12} className="hidden md:block" /> guest@vault-server
        </div>
        <div className="flex gap-2 md:gap-3 text-neutral-600">
          <Minus size={14} className="hover:text-neutral-300 cursor-pointer hidden md:block" />
          <Maximize2 size={14} className="hover:text-neutral-300 cursor-pointer hidden md:block" />
          <X size={14} className="hover:text-red-500 cursor-pointer" />
        </div>
      </div>

      <div ref={terminalScrollRef} className="p-4 md:p-6 h-[300px] md:h-[400px] overflow-y-auto text-xs md:text-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {history.map((line, index) => (
          <div key={index} className={`mb-1.5 leading-relaxed break-words ${line.type === 'system' ? 'text-emerald-400' : line.type === 'user' ? 'text-white font-bold mt-4 md:mt-5' : 'text-neutral-400 ml-2 md:ml-4'}`}>
            {line.text}
          </div>
        ))}
        <div className="flex items-start md:items-center mt-4 md:mt-5 text-red-500 font-bold flex-col md:flex-row">
          <span className="mr-3 whitespace-nowrap mb-1 md:mb-0">guest@sanjat-vault:~$</span>
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand}
            className="flex-grow bg-transparent outline-none text-white font-normal placeholder-neutral-700 w-full"
            autoFocus spellCheck="false" autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

// ─── TERMINAL EASTER EGG (CTRL+K) ───
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

// ─── MAIN COMPONENT ───
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
  
  // Theme State Setup
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const typedRole = useTyped(['Full-Stack Developer.', 'Backend Architect.', 'Mobile Engineer.', 'Cloud & DevOps.'], 75, 2000);

  useEffect(() => {
    // Apply theme class to HTML body
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handler = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setTerminalOpen(t => !t); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
        setProjects(PROJECTS_DATA);
        setFilteredProjects(PROJECTS_DATA);
        setLoading(false);
    }, 600);
  }, []);

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

    emailjs.init('fz9BpAxiaUNulJwVI'); 

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: 'Sanjat Kumar',
    };

    const SERVICE_ID = 'service_f1hojje';     
    const TEMPLATE_ID = 'template_67cki6s';   

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then((response) => {
        setFormStatus({ loading: false, success: true, error: false });
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setFormStatus(p => ({ ...p, success: false })), 5000);
      })
      .catch((err) => {
        setFormStatus({ loading: false, success: false, error: true });
      });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('sanjatkumar18@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const techStackBar = [
    { icon: Code2, label: 'Frontend', stack: 'React · Flutter · Next.js', color: 'text-blue-500 dark:text-blue-400' },
    { icon: Terminal, label: 'Backend', stack: 'Django · Node.js · NestJS', color: 'text-emerald-600 dark:text-emerald-400' },
    { icon: Database, label: 'Database', stack: 'PostgreSQL · Redis · MongoDB', color: 'text-amber-500 dark:text-amber-400' },
    { icon: Cloud, label: 'DevOps', stack: 'AWS EC2 · Docker · Firebase', color: 'text-purple-500 dark:text-purple-400' },
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
    <div className="min-h-screen bg-neutral-50 dark:bg-[#080808] text-neutral-800 dark:text-neutral-200 font-sans antialiased selection:bg-red-500/20 selection:text-red-600 dark:selection:bg-red-900/40 dark:selection:text-red-300 transition-colors duration-300">
      <NoiseOverlay />
      <WhatsAppButton />

      <AnimatePresence>
        {terminalOpen && <TerminalEasterEgg onClose={() => setTerminalOpen(false)} />}
      </AnimatePresence>

      <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-red-500/10 dark:bg-red-950/20 rounded-full blur-[180px] pointer-events-none -z-0" />
      <div className="fixed bottom-[10%] left-0 w-[400px] h-[500px] bg-red-500/5 dark:bg-red-950/10 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* ══════════════ HEADER ══════════════ */}
      <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/80 dark:border-neutral-900/80 bg-white/90 dark:bg-[#080808]/90 backdrop-blur-xl px-6 py-3 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg overflow-hidden shadow-lg shadow-neutral-200 dark:shadow-red-900/50 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <img src="/logo.png" alt="Sanjat Logo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#080808] animate-pulse" />
            </div>
            <div>
              <div className="text-neutral-900 dark:text-white font-black text-sm tracking-widest uppercase font-mono">SANJAT KUMAR</div>
              <div className="text-neutral-500 dark:text-neutral-600 text-[9px] tracking-[0.25em] uppercase font-semibold flex items-center gap-1">
                <Shield size={8} className="text-red-600" /> Full-Stack Engineer
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800/60 rounded-full px-2 py-1.5 transition-colors duration-300">
            {[
              { label: 'Home', href: '#', icon: LayoutDashboard },
              { label: 'Experience', href: '#experience', icon: Briefcase },
              { label: 'Projects', href: '#projects', icon: FolderOpen },
              { label: 'Skills', href: '#skills', icon: Cpu },
              { label: 'Contact', href: '#contact', icon: Mail },
            ].map(({ label, href, icon: Icon }) => (
              <a key={label} href={href}
                className="flex items-center gap-1.5 px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all hover:bg-white dark:hover:bg-neutral-900 shadow-sm hover:shadow-md dark:shadow-none">
                <Icon size={12} /> {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* 🔥 THEME TOGGLE BUTTON 🔥 */}
            <button onClick={toggleTheme} className="flex w-9 h-9 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-sm dark:shadow-none text-neutral-600 dark:text-neutral-400 hover:text-amber-500 dark:hover:text-amber-400">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <button onClick={() => setTerminalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-red-600 dark:hover:border-red-900 text-neutral-600 dark:text-neutral-600 hover:text-red-600 dark:hover:text-red-400 text-[10px] font-mono transition-all shadow-sm dark:shadow-none"
              title="Open Terminal">
              <Terminal size={12} /> <span>Ctrl+K</span>
            </button>
            <a href="https://github.com/Sanjat123" target="_blank" rel="noreferrer"
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors shadow-sm dark:shadow-none text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
              <GitBranch size={15} />
            </a>
            <a href="/resume/Sanjat_Kumar_Resume.pdf" download
              className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-800 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm dark:shadow-none">
              <Download size={14} /> CV
            </a>
            <a href="#contact"
              className="hidden md:flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/30 dark:shadow-red-950/40">
              Hire Me <Zap size={12} />
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
              {menuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-neutral-200 dark:border-neutral-900 mt-3 pt-3">
              {['Home', 'Experience', 'Projects', 'Skills', 'Contact'].map(item => (
                <a key={item} href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 px-3 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg uppercase tracking-widest transition-colors">
                  {item}
                </a>
              ))}
              <a href="/resume/Sanjat_Kumar_Resume.pdf" download
                className="flex items-center gap-2 py-3 px-3 text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-2 border-t border-neutral-100 dark:border-neutral-800">
                <Download size={14} /> Download CV
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="relative z-10 pt-20">

        {/* ══════════════ HERO ══════════════ */}
        <section className="min-h-screen flex items-center px-6 py-24 max-w-7xl mx-auto">
          {/* Removed Opacity Fade logic for Mobile Smoothness */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="w-full">
            <div className="grid lg:grid-cols-[1fr_440px] gap-16 items-center">
              <motion.div variants={fadeUp}>
                <div className="flex items-center gap-3 mb-8 flex-wrap">
                  <CLIBadge>status --online</CLIBadge>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    Available for hire
                  </span>
                  <button onClick={() => setTerminalOpen(true)}
                    className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-700 hover:text-red-600 dark:hover:text-red-400 text-xs font-mono transition-colors">
                    <Terminal size={11} /> Press Ctrl+K
                  </button>
                </div>

                <div>
                  <p className="text-red-600 dark:text-red-500 text-sm font-black tracking-[0.3em] uppercase font-mono mb-3">Sanjat Kumar</p>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-neutral-900 dark:text-white leading-[1.02] tracking-tight mb-3">
                    Building systems<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500 dark:from-red-500 dark:via-red-400 dark:to-orange-400">that scale.</span>
                  </h1>
                  <div className="h-14 flex items-center mt-4 mb-8">
                    <span className="text-2xl md:text-3xl font-bold text-neutral-600 dark:text-neutral-400 font-mono">
                      {typedRole}<span className="animate-pulse text-red-600 dark:text-red-500 ml-0.5">|</span>
                    </span>
                  </div>
                </div>

                <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed max-w-xl mb-10">
                  BCA student at Chandigarh University (GPA 8.22) with real production experience —
                  delivered <span className="text-neutral-900 dark:text-white font-semibold">3 signed enterprise contracts</span>,
                  led a <span className="text-neutral-900 dark:text-white font-semibold">3-engineer team</span>, and shipped
                  <span className="text-neutral-900 dark:text-white font-semibold"> 4 apps</span> to 500+ users.
                </p>

                <div className="flex flex-wrap gap-3 mb-12">
                  <a href="#projects"
                    className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-red-600/20 dark:shadow-red-950/40 transition-all hover:-translate-y-0.5">
                    <FolderOpen size={16} /> View Projects
                  </a>
                  <a href="/resume/Sanjat_Kumar_Resume.pdf" download
                    className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-emerald-600/20 dark:shadow-emerald-950/30 transition-all hover:-translate-y-0.5">
                    <Download size={16} /> Download CV
                  </a>
                  <a href="#contact"
                    className="flex items-center gap-2 px-5 py-3.5 bg-white dark:bg-transparent border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-sm dark:shadow-none">
                    <Terminal size={16} className="text-red-600 dark:text-red-500" /> Let's Talk
                  </a>
                  <button onClick={copyEmail}
                    className="flex items-center gap-2 px-4 py-3.5 bg-white dark:bg-transparent border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm dark:shadow-none">
                    {copied ? <><CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" /> Copied!</> : <><Copy size={14} /> Email</>}
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-6 pt-8 border-t border-neutral-200 dark:border-neutral-900">
                  <StatCounter value="3" label="Contracts" prefix="₹" suffix="L+" />
                  <StatCounter value="500" label="Users" suffix="+" />
                  <StatCounter value="4" label="Live Apps" />
                  <StatCounter value="8" label="GPA" suffix=".22" />
                </div>
              </motion.div>

              {/* Right Side Visuals */}
              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4">
                <GlowCard className="p-0 overflow-hidden">
                  <div className="relative">
                    <img src="/hero.png" alt="Sanjat Kumar — Full Stack Engineer" className="w-full object-cover object-top" style={{ maxHeight: '380px' }} />
                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-neutral-900 dark:text-white font-black text-base drop-shadow-md dark:drop-shadow-none">Sanjat Kumar</div>
                          <div className="text-neutral-700 dark:text-neutral-400 text-xs font-mono drop-shadow-md dark:drop-shadow-none">Full-Stack Engineer · BCA @ CU</div>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-emerald-950/80 border border-neutral-200 dark:border-emerald-800/60 shadow-sm dark:shadow-none backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                          <span className="text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">Open to Work</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-xl bg-white/80 dark:bg-black/70 border border-neutral-200 dark:border-neutral-700 backdrop-blur-sm shadow-sm">
                      <div className="text-neutral-900 dark:text-white text-xs font-black font-mono">GPA 8.22</div>
                      <div className="text-neutral-600 dark:text-neutral-500 text-[9px]">Chandigarh Uni</div>
                    </div>
                  </div>
                </GlowCard>

                <GlowCard className="p-0 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800/60 bg-neutral-100 dark:bg-neutral-950">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setTerminalOpen(true)} title="Open terminal" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-3 text-neutral-500 dark:text-neutral-600 text-xs font-mono">about.sh — Press Ctrl+K to interact</span>
                  </div>
                  <div className="p-4 font-mono text-xs space-y-1.5">
                    {[
                      { label: 'name', value: '"Sanjat Kumar"', color: 'text-amber-600 dark:text-amber-300' },
                      { label: 'role', value: '"Full-Stack Engineer"', color: 'text-emerald-600 dark:text-emerald-300' },
                      { label: 'location', value: '"Mohali, Punjab IN"', color: 'text-blue-600 dark:text-blue-300' },
                      { label: 'contracts', value: '["Maa Enterprises", "Zidio Dev"]', color: 'text-red-600 dark:text-red-300' },
                      { label: 'status', value: '"open_to_work"', color: 'text-emerald-600 dark:text-emerald-400' },
                    ].map((line, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex gap-2 flex-wrap">
                        <span className="text-neutral-500 dark:text-neutral-600">const</span>
                        <span className="text-red-600 dark:text-red-400">{line.label}</span>
                        <span className="text-neutral-400 dark:text-neutral-500">=</span>
                        <span className={line.color}>{line.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlowCard>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Award, text: 'HackerRank Certified', sub: 'Software Engineer', color: 'text-amber-500 dark:text-amber-400' },
                    { icon: Globe, text: 'Play Store', sub: '4 apps published', color: 'text-emerald-500 dark:text-emerald-400' },
                    { icon: Users, text: 'Team Lead', sub: '3 engineers', color: 'text-blue-500 dark:text-blue-400' },
                    { icon: TrendingUp, text: 'INR 3.6L+', sub: 'Delivered', color: 'text-red-500 dark:text-red-400' },
                  ].map(({ icon: Icon, text, sub, color }) => (
                    <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800/60 shadow-sm dark:shadow-none">
                      <Icon size={16} className={color} />
                      <div>
                        <div className="text-neutral-900 dark:text-white text-xs font-bold">{text}</div>
                        <div className="text-neutral-500 dark:text-neutral-600 text-[10px]">{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════ INTERACTIVE TERMINAL ══════════════ */}
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionHeader eyebrow="System Profiler" title="Interactive" accent="Terminal." />
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-10 max-w-2xl leading-relaxed">
                Want to know more about my background? Access the secure terminal below and execute system commands to extract my professional records.
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <TerminalAbout />
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════ TECH STACK BAR ══════════════ */}
        <section className="px-6 py-12 border-y border-neutral-200 dark:border-neutral-900/60 bg-neutral-100/50 dark:bg-neutral-950/40">
          <div className="max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {techStackBar.map(({ icon: Icon, label, stack, color }) => (
                <motion.div key={label} variants={fadeUp} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-colors shrink-0 shadow-sm dark:shadow-none">
                    <Icon size={22} className={color} />
                  </div>
                  <div>
                    <div className="text-neutral-900 dark:text-white font-bold text-sm">{label}</div>
                    <div className="text-neutral-500 dark:text-neutral-600 text-xs mt-0.5">{stack}</div>
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
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-sm dark:shadow-none">
                              <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse" /> Live
                            </span>
                          )}
                          <span className="text-neutral-500 dark:text-neutral-600 text-xs font-mono">{exp.period}</span>
                        </div>
                        <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-1">{exp.role}</h3>
                        <p className="text-red-600 dark:text-red-500 text-sm font-bold uppercase tracking-wider">{exp.company}</p>
                        <p className="text-neutral-500 dark:text-neutral-600 text-xs mt-0.5">{exp.type}</p>
                      </div>
                    </div>
                    <ul className="space-y-2.5 mb-6">
                      {exp.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-3 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                          <ChevronRight size={14} className="text-red-600 mt-0.5 shrink-0" />{h}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">{exp.tech.map(t => <SkillPill key={t} skill={t} />)}</div>
                  </GlowCard>
                </motion.div>
              ))}

              <motion.div variants={fadeUp}>
                <GlowCard className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0 shadow-sm dark:shadow-none">
                      <Award size={20} className="text-amber-500 dark:text-amber-400" />
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-600 text-xs font-mono">Jun 2024 – Present</span>
                      <h3 className="text-lg font-black text-neutral-900 dark:text-white mt-1">Bachelor of Computer Applications</h3>
                      <p className="text-red-600 dark:text-red-500 text-sm font-bold uppercase tracking-wider mt-0.5">Chandigarh University</p>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-sm font-bold"><Star size={14} /> GPA: 8.22 / 10.00</span>
                        <span className="text-neutral-300 dark:text-neutral-700">·</span>
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
        <section id="projects" className="px-6 py-28 bg-neutral-100/30 dark:bg-neutral-950/30 border-y border-neutral-200 dark:border-neutral-900/40 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
              <motion.div variants={fadeUp}><SectionHeader eyebrow="Portfolio" title="Things I've" accent="Shipped." /></motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-10">
                <div className="flex items-center gap-2 mr-2">
                  <Filter size={14} className="text-neutral-500 dark:text-neutral-600" />
                  <span className="text-neutral-500 dark:text-neutral-600 text-xs font-bold uppercase tracking-widest">Filter:</span>
                </div>
                {filterCategories.map(cat => (
                  <button key={cat} onClick={() => handleFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                      activeFilter === cat
                        ? 'bg-red-600 dark:bg-red-700 text-white shadow-md dark:shadow-lg dark:shadow-red-950/40'
                        : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-500 hover:border-neutral-300 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-300 shadow-sm dark:shadow-none'
                    }`}>
                    {cat}
                  </button>
                ))}
                {activeFilter !== 'All' && (
                  <span className="flex items-center gap-1.5 px-3 py-2 text-xs text-neutral-500 dark:text-neutral-600 font-mono">
                    {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
                  </span>
                )}
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div key={activeFilter} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 animate-pulse">
                        <div className="h-4 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded mb-3" />
                        <div className="h-3 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded mb-6" />
                        <div className="space-y-2">
                          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
                          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6" />
                        </div>
                      </div>
                    ))
                    : filteredProjects.length === 0
                      ? (
                        <div className="col-span-3 text-center py-16">
                          <div className="text-neutral-500 dark:text-neutral-700 text-sm font-mono mb-2">// No projects found for "{activeFilter}"</div>
                          <button onClick={() => handleFilter('All')} className="text-red-600 dark:text-red-500 text-xs font-bold uppercase tracking-widest hover:text-red-700 dark:hover:text-red-400 transition-colors">
                            Clear filter
                          </button>
                        </div>
                      )
                      : filteredProjects.map((project, i) => (
                        <motion.div key={project.id} variants={fadeUp} custom={i}>
                          <GlowCard className="p-6 h-full flex flex-col group">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-base font-black text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-tight">
                                  {project.title}
                                </h3>
                                <p className="text-red-600 dark:text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">{project.tagline}</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                                {project.github_url && (
                                  <a href={project.github_url} target="_blank" rel="noreferrer"
                                    className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 flex items-center justify-center transition-colors">
                                    <GitBranch size={13} className="text-neutral-500" />
                                  </a>
                                )}
                                {project.live_url && (
                                  <a href={project.live_url} target="_blank" rel="noreferrer"
                                    className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-red-300 dark:hover:border-red-800 flex items-center justify-center transition-colors">
                                    <ExternalLink size={13} className="text-neutral-500 hover:text-red-600 dark:hover:text-red-400" />
                                  </a>
                                )}
                              </div>
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-500 text-sm leading-relaxed flex-grow mb-5 line-clamp-3">{project.description}</p>
                            <div className="flex flex-wrap gap-1.5 mb-5">
                              {(Array.isArray(project.tech_stack) ? project.tech_stack : (project.tech_stack || '').split(',')).slice(0, 4).map(t => (
                                <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-500 font-mono shadow-sm dark:shadow-none">{t.trim()}</span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-900">
                              <span className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-600 font-mono">
                                <Shield size={10} className="text-red-600" /> {project.views_count || 0} views
                              </span>
                              <Link to={`/project/${project.slug}`}
                                className="flex items-center gap-1.5 text-xs font-black text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors uppercase tracking-wider">
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
                      <h3 className="text-neutral-900 dark:text-white font-black text-sm uppercase tracking-wider">{category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">{items.map(s => <SkillPill key={s} skill={s} />)}</div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="mt-8">
              <GlowCard className="p-6 md:p-8">
                <h3 className="text-neutral-900 dark:text-white font-black text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                  <Award size={16} className="text-amber-500 dark:text-amber-400" /> Certifications
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: 'HackerRank Software Engineer', issuer: 'HackerRank', color: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/40 dark:bg-emerald-950/20' },
                    { title: 'IBM Data Analysis with Python', issuer: 'IBM', color: 'border-blue-200 bg-blue-50 dark:border-blue-800/40 dark:bg-blue-950/20' },
                    { title: 'Internship Excellence Award', issuer: 'Zidio Development', color: 'border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20' },
                  ].map(cert => (
                    <div key={cert.title} className={`rounded-xl p-4 border ${cert.color} transition-colors duration-300 shadow-sm dark:shadow-none`}>
                      <div className="text-neutral-900 dark:text-white text-sm font-bold mb-1">{cert.title}</div>
                      <div className="text-neutral-500 dark:text-neutral-600 text-xs">{cert.issuer}</div>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════ CONTACT ══════════════ */}
        <section id="contact" className="px-6 py-28 bg-neutral-100/50 dark:bg-neutral-950/40 border-t border-neutral-200 dark:border-neutral-900/60 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}><SectionHeader eyebrow="Get In Touch" title="Open for" accent="Opportunities." /></motion.div>

              <div className="grid md:grid-cols-[380px_1fr] gap-10">
                <motion.div variants={fadeUp} className="space-y-4">
                  <GlowCard className="p-6">
                    <h3 className="text-neutral-900 dark:text-white font-black text-base mb-2">Let's build something great</h3>
                    <p className="text-neutral-600 dark:text-neutral-500 text-sm leading-relaxed mb-6">
                      Open to internships, freelance contracts, and full-time SDE roles. Fast response guaranteed.
                    </p>
                    {[
                      { icon: Phone, text: '+91 78703 53493', href: 'tel:+917870353493' },
                      { icon: Mail, text: 'sanjatkumar18@gmail.com', href: 'mailto:sanjatkumar18@gmail.com' },
                      { icon: MapPin, text: 'Mohali, Punjab, India', href: '#' },
                    ].map(({ icon: Icon, text, href }) => (
                      <a key={text} href={href} className="flex items-center gap-3 mb-4 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group">
                        <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 group-hover:border-red-300 dark:group-hover:border-red-900 flex items-center justify-center shrink-0 transition-colors shadow-sm dark:shadow-none">
                          <Icon size={15} className="text-red-600 dark:text-red-500" />
                        </div>
                        {text}
                      </a>
                    ))}
                  </GlowCard>

                  <GlowCard className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock size={13} className="text-emerald-500 dark:text-emerald-400" />
                      <span className="text-xs text-neutral-500 font-mono">secure_channel.init()</span>
                    </div>
                    <div className="flex gap-3">
                      <a href="https://github.com/Sanjat123" target="_blank" rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all shadow-sm dark:shadow-none">
                        <GitBranch size={15} /> GitHub
                      </a>
                      <a href="https://www.linkedin.com/in/sanjatkumar/" target="_blank" rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-200 dark:hover:border-blue-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm dark:shadow-none">
                        <ExternalLink size={15} /> LinkedIn
                      </a>
                    </div>
                    <a href="https://wa.me/917870353493?text=Hi%20Sanjat!%20I%20saw%20your%20portfolio."
                      target="_blank" rel="noreferrer"
                      className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white uppercase tracking-wider transition-all shadow-md"
                      style={{ backgroundColor: '#25D366' }}>
                      <MessageCircle size={15} /> WhatsApp Me
                    </a>
                  </GlowCard>

                  <GlowCard className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-neutral-900 dark:text-white font-black text-sm mb-1">My Resume</div>
                        <div className="text-neutral-500 dark:text-neutral-600 text-xs">Updated June 2026 · PDF</div>
                      </div>
                      <a href="/resume/Sanjat_Kumar_Resume.pdf" download
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md">
                        <Download size={14} /> Download
                      </a>
                    </div>
                  </GlowCard>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <GlowCard className="p-6 md:p-8">
                    <form onSubmit={handleContactSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="text-[10px] font-black tracking-widest uppercase text-neutral-500 dark:text-neutral-600 block mb-2 font-mono">
                            <span className="text-red-600">01</span> Name
                          </label>
                          <input type="text" required value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your full name"
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 dark:text-white text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-700 focus:outline-none focus:border-red-400 dark:focus:border-red-800 transition-colors shadow-sm dark:shadow-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black tracking-widest uppercase text-neutral-500 dark:text-neutral-600 block mb-2 font-mono">
                            <span className="text-red-600">02</span> Email
                          </label>
                          <input type="email" required value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 dark:text-white text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-700 focus:outline-none focus:border-red-400 dark:focus:border-red-800 transition-colors shadow-sm dark:shadow-none" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black tracking-widest uppercase text-neutral-500 dark:text-neutral-600 block mb-2 font-mono">
                          <span className="text-red-600">03</span> Message
                        </label>
                        <textarea rows={5} required value={formData.message}
                          onChange={e => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell me about the project, role, or opportunity..."
                          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 dark:text-white text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-700 focus:outline-none focus:border-red-400 dark:focus:border-red-800 transition-colors resize-none shadow-sm dark:shadow-none" />
                      </div>
                      <button type="submit" disabled={formStatus.loading}
                        className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 disabled:bg-neutral-200 dark:disabled:bg-neutral-900 disabled:text-neutral-400 dark:disabled:text-neutral-700 text-white font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-red-600/30 dark:shadow-red-950/30 flex items-center justify-center gap-2">
                        {formStatus.loading
                          ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Sending...</>
                          : formStatus.success
                            ? <><CheckCircle size={16} /> Message Sent!</>
                            : <><Send size={16} /> Send Message</>}
                      </button>

                      <AnimatePresence>
                        {formStatus.success && (
                          <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 backdrop-blur-md flex items-start gap-3"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 shadow-sm dark:shadow-md dark:shadow-emerald-950">
                              <CheckCircle size={18} className="animate-pulse" />
                            </div>
                            <div>
                              <h4 className="text-emerald-700 dark:text-emerald-400 font-mono text-xs font-black uppercase tracking-widest">
                                Message Sent Successfully
                              </h4>
                              <p className="text-neutral-600 dark:text-neutral-300 text-xs mt-1.5 font-sans leading-relaxed">
                                Thank you for reaching out! Your message has been safely delivered to my inbox. I will review your inquiry or opportunity details and respond to you as soon as possible.
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {formStatus.error && (
                          <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 backdrop-blur-md flex items-start gap-3"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 mt-0.5">
                              <X size={18} />
                            </div>
                            <div>
                              <h4 className="text-red-600 dark:text-red-400 font-mono text-xs font-black uppercase tracking-widest">
                                Submission Failed
                              </h4>
                              <p className="text-neutral-600 dark:text-neutral-300 text-xs mt-1.5 leading-relaxed font-sans">
                                Something went wrong while processing your request. Please check your internet connection or email me directly at <a href="mailto:sanjatkumar18@gmail.com" className="text-red-600 dark:text-red-400 font-semibold underline hover:text-red-500 dark:hover:text-red-300">sanjatkumar18@gmail.com</a>.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </GlowCard>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer className="px-6 py-12 border-t border-neutral-200 dark:border-neutral-900/60 bg-neutral-100/50 dark:bg-neutral-950/20 backdrop-blur-sm relative z-20 font-sans transition-colors duration-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Left Side: Brand & Copyright */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 flex items-center justify-center shadow-sm dark:shadow-md dark:shadow-red-950/50 border border-neutral-200 dark:border-neutral-800">
                <img src="/logo.png" alt="Sanjat Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-900 dark:text-white font-mono text-xs font-black uppercase tracking-widest">Sanjat Kumar</span>
                <span className="text-neutral-500 dark:text-neutral-600 text-[10px] font-mono mt-0.5">© 2026 · All Rights Reserved</span>
              </div>
            </div>

            {/* Center: Built Tag */}
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs font-medium tracking-wide">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 shadow-sm dark:shadow-none">
                <Code2 size={12} className="text-red-600 dark:text-red-500" />
                Crafted with <span className="text-red-600 dark:text-red-500">❤️</span> by Sanjat Kumar
              </span>
              <span className="hidden md:inline text-neutral-300 dark:text-neutral-700">|</span>
              <span className="hidden md:inline font-mono text-[11px] text-neutral-400 dark:text-neutral-500">React · Tailwind · Serverless</span>
            </div>

            {/* Right Side: Quick Navigation */}
            <div className="flex items-center gap-5">
              {[
                { href: '#experience', label: 'Experience' },
                { href: '#projects', label: 'Projects' },
                { href: '#contact', label: 'Contact' }
              ].map(link => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className="text-neutral-500 dark:text-neutral-500 hover:text-red-600 dark:hover:text-white text-xs uppercase tracking-widest font-bold transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

          </div>
        </footer>

      </main>
    </div>
  );
}