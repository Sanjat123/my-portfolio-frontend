import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import TerminalAbout from '../components/TerminalAbout';
import {
  LayoutDashboard, FolderOpen, Briefcase, Shield,
  Terminal, Database, Cloud, Code2, ArrowRight,
  Send, CheckCircle, Copy, ExternalLink, Award, Users,
  Zap, Globe, GitBranch, Mail, Phone, MapPin,
  ChevronRight, Star, TrendingUp, Cpu, Lock, X, Menu
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
   Primary:  #0a0a0a  (obsidian)
   Surface:  #101010  (card)
   Border:   #1e1e1e
   Accent1:  #dc2626  (crimson)
   Accent2:  #ef4444  (red-500)
   Glow:     #7f1d1d  (red-900)
   Text:     #f5f5f5 / #a3a3a3 / #525252
   Font:     JetBrains Mono (display) + Inter (body)
───────────────────────────────────────────── */

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

// ─── NOISE CANVAS BACKGROUND ────────────────
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
    const duration = 1500;
    const step = target / (duration / 16);
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
      <div className="text-3xl md:text-4xl font-black text-white font-mono">
        {prefix}{count}{suffix}
      </div>
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
function GlowCard({ children, className = '', glowColor = 'red' }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const ref = useRef();

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative overflow-hidden rounded-2xl border border-neutral-800/60 bg-neutral-950 transition-all duration-300 ${hover ? 'border-red-900/60' : ''} ${className}`}
    >
      {hover && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, rgba(127,29,29,0.12), transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── COMMAND LINE BADGE ─────────────────────
function CLIBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-400">
      <span className="text-red-500">$</span> {children}
    </span>
  );
}

// ─── MAIN COMPONENT ─────────────────────────
export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: false });
  const [copied, setCopied] = useState(false);

  const typedRole = useTyped(
    ['Full-Stack Developer.', 'Backend Architect.', 'Mobile Engineer.', 'Cloud & DevOps.'],
    75, 2000
  );

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/projects/')
      .then(r => { setProjects(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: false });
    try {
      await axios.post('http://127.0.0.1:8000/api/contact/', formData);
      setFormStatus({ loading: false, success: true, error: false });
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus(p => ({ ...p, success: false })), 5000);
    } catch {
      setFormStatus({ loading: false, success: false, error: true });
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('sanjatkumar18@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const techStack = [
    { icon: Code2, label: 'Frontend', stack: 'React · Flutter · Next.js', color: 'text-blue-400' },
    { icon: Terminal, label: 'Backend', stack: 'Django · Node.js · NestJS', color: 'text-emerald-400' },
    { icon: Database, label: 'Database', stack: 'PostgreSQL · Redis · MongoDB', color: 'text-amber-400' },
    { icon: Cloud, label: 'DevOps', stack: 'AWS EC2 · Docker · Firebase', color: 'text-purple-400' },
  ];

  const experiences = [
    {
      period: 'Dec 2025 – Present',
      role: 'Lead Developer & System Architect',
      company: 'Maa Enterprises',
      type: 'Freelance · Remote',
      status: 'active',
      highlights: [
        'Architected multi-tenant SaaS CRM — 5 modules, 5 RBAC roles, INR 2,50,000 contract',
        'Led 3-engineer Agile team; integrated Razorpay, WhatsApp API, SendGrid',
        'Designed scalable REST APIs, PostgreSQL schemas, Docker + AWS EC2 deployment',
      ],
      tech: ['React.js', 'NestJS', 'Django REST', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
    },
    {
      period: 'Aug 2025 – Oct 2025',
      role: 'Web Application Development Intern',
      company: 'Zidio Development Pvt. Ltd.',
      type: 'Remote',
      status: 'done',
      highlights: [
        'Developed responsive MERN Stack web applications end-to-end',
        'Executed test cases, performed root cause analysis, compiled MIS reports for stakeholders',
      ],
      tech: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Git'],
    },
  ];

  const skills = {
    Languages: ['JavaScript (ES6+)', 'Python', 'Java', 'C/C++', 'Dart', 'SQL', 'PL/SQL'],
    Frontend: ['React.js', 'Next.js', 'Flutter', 'Tailwind CSS', 'Framer Motion', 'HTML5', 'CSS3'],
    Backend: ['Django REST', 'Node.js', 'NestJS', 'FastAPI', 'REST APIs', 'Microservices'],
    'Cloud & DevOps': ['AWS EC2', 'Docker', 'Firebase', 'CI/CD', 'Git', 'GitHub'],
    'Databases': ['PostgreSQL', 'Redis', 'MongoDB', 'pgvector', 'Cloud Firestore'],
    'Integrations': ['Razorpay', 'WhatsApp API', 'SendGrid', 'Gemini API', 'Dlib', 'RBAC'],
  };

  const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-200 font-sans antialiased selection:bg-red-900/40 selection:text-red-300">
      <NoiseOverlay />

      {/* ══════════════ AMBIENT GLOWS ══════════════ */}
      <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-red-950/20 rounded-full blur-[180px] pointer-events-none -z-0" />
      <div className="fixed bottom-[10%] left-0 w-[400px] h-[500px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* ══════════════ HEADER ══════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-900/80 bg-[#080808]/90 backdrop-blur-xl px-6 py-3"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/50">
                <span className="text-white font-black text-lg font-mono">S</span>
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

          {/* Right */}
          <div className="flex items-center gap-3">
            <a href="https://github.com/Sanjat123" target="_blank" rel="noreferrer"
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 hover:border-red-800 transition-colors">
              <GitBranch size={14} className="text-neutral-400" />
            </a>
            <a href="https://www.linkedin.com/in/sanjatkumar/" target="_blank" rel="noreferrer"
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 hover:border-red-800 transition-colors">
              <ExternalLink size={14} className="text-neutral-400" />
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-neutral-900 mt-3 pt-3"
            >
              {['Home', 'Experience', 'Projects', 'Skills', 'Contact'].map(item => (
                <a key={item} href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 px-2 text-sm font-bold text-neutral-400 hover:text-white uppercase tracking-widest">
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="relative z-10 pt-20">

        {/* ══════════════ HERO ══════════════ */}
        <section className="min-h-screen flex items-center px-6 py-24 max-w-7xl mx-auto">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="w-full">
            <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">

              {/* Left */}
              <motion.div initial="hidden" animate="visible" variants={stagger}>

                <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8 flex-wrap">
                  <CLIBadge>status --online</CLIBadge>
                  <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    Available for hire
                  </span>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <p className="text-red-500 text-sm font-black tracking-[0.3em] uppercase font-mono mb-3">
                    Sanjat Kumar
                  </p>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.02] tracking-tight mb-3">
                    Building systems<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-orange-400">
                      that scale.
                    </span>
                  </h1>
                  <div className="h-14 flex items-center mt-4 mb-8">
                    <span className="text-2xl md:text-3xl font-bold text-neutral-400 font-mono">
                      {typedRole}
                      <span className="animate-pulse text-red-500 ml-0.5">|</span>
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
                    className="flex items-center gap-2 px-6 py-3.5 bg-red-700 hover:bg-red-600 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-red-950/40 transition-all hover:shadow-red-900/50 hover:-translate-y-0.5">
                    <FolderOpen size={16} /> View Projects
                  </a>
                  <a href="#contact"
                    className="flex items-center gap-2 px-6 py-3.5 bg-transparent border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all">
                    <Terminal size={16} className="text-red-500" /> Let's Talk
                  </a>
                  <button onClick={copyEmail}
                    className="flex items-center gap-2 px-4 py-3.5 bg-transparent border border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
                    {copied ? <><CheckCircle size={14} className="text-emerald-400" /> Copied!</> : <><Copy size={14} /> Copy Email</>}
                  </button>
                </motion.div>

                {/* Stats row */}
                <motion.div variants={fadeUp}
                  className="grid grid-cols-4 gap-6 pt-8 border-t border-neutral-900">
                  <StatCounter value="3" label="Contracts" prefix="₹" suffix="L+" />
                  <StatCounter value="500" label="Users" suffix="+" />
                  <StatCounter value="4" label="Live Apps" />
                  <StatCounter value="8" label="GPA" prefix="" suffix=".22" />
                </motion.div>
              </motion.div>

              {/* Right — Terminal card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlowCard className="p-0 overflow-hidden">
                  {/* Terminal titlebar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800/60 bg-neutral-950">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-3 text-neutral-600 text-xs font-mono">sanjat@portfolio ~ about.sh</span>
                  </div>
                  <div className="p-5 font-mono text-sm space-y-2">
                    {[
                      { label: 'name', value: '"Sanjat Kumar"', color: 'text-amber-300' },
                      { label: 'role', value: '"Full-Stack Engineer"', color: 'text-emerald-300' },
                      { label: 'location', value: '"Mohali, Punjab IN"', color: 'text-blue-300' },
                      { label: 'gpa', value: '8.22', color: 'text-purple-300' },
                      { label: 'contracts', value: '["Maa Enterprises", "Zidio Dev"]', color: 'text-red-300' },
                      { label: 'stack', value: '["React", "Django", "Flutter", "AWS"]', color: 'text-amber-300' },
                      { label: 'status', value: '"open_to_work"', color: 'text-emerald-400' },
                    ].map((line, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex gap-2 flex-wrap">
                        <span className="text-neutral-600">const</span>
                        <span className="text-red-400">{line.label}</span>
                        <span className="text-neutral-500">=</span>
                        <span className={line.color}>{line.value}</span>
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                      className="pt-2 flex items-center gap-2 text-emerald-400">
                      <span className="text-neutral-600">{'>'}</span>
                      <span>System initialized successfully</span>
                      <CheckCircle size={14} />
                    </motion.div>
                  </div>
                </GlowCard>

                {/* Floating badges */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { icon: Award, text: 'HackerRank Certified', sub: 'Software Engineer', color: 'text-amber-400' },
                    { icon: Globe, text: 'Play Store', sub: '4 apps published', color: 'text-emerald-400' },
                    { icon: Users, text: 'Team Lead', sub: '3 engineers', color: 'text-blue-400' },
                    { icon: TrendingUp, text: 'INR 3.6L+', sub: 'Contracts delivered', color: 'text-red-400' },
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


      {/* ══════════════ INTERACTIVE TERMINAL ABOUT ══════════════ */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: '-80px' }} 
          variants={stagger}
        >
          {/* Ye aapke naye design ka SectionHeader use karega */}
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
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {techStack.map(({ icon: Icon, label, stack, color }) => (
                <motion.div key={label} variants={fadeUp}
                  className="flex items-center gap-4 group">
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
            <motion.div variants={fadeUp}>
              <SectionHeader eyebrow="Work History" title="What I've" accent="Built." />
            </motion.div>

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
                          <ChevronRight size={14} className="text-red-600 mt-0.5 shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map(t => <SkillPill key={t} skill={t} />)}
                    </div>
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
                        <span className="flex items-center gap-1.5 text-amber-400 text-sm font-bold">
                          <Star size={14} /> GPA: 8.22 / 10.00
                        </span>
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
              <motion.div variants={fadeUp}>
                <SectionHeader eyebrow="Project" title="Things I've" accent="Shipped." />
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-neutral-900 bg-neutral-950 p-6 animate-pulse">
                      <div className="h-4 w-2/3 bg-neutral-800 rounded mb-3" />
                      <div className="h-3 w-1/3 bg-neutral-800 rounded mb-6" />
                      <div className="space-y-2">
                        <div className="h-3 bg-neutral-800 rounded" />
                        <div className="h-3 bg-neutral-800 rounded w-5/6" />
                        <div className="h-3 bg-neutral-800 rounded w-4/6" />
                      </div>
                    </div>
                  ))
                  : projects.map((project, i) => (
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
                            {project.demo_url && (
                              <a href={project.demo_url} target="_blank" rel="noreferrer"
                                className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-red-800 flex items-center justify-center transition-colors">
                                <ExternalLink size={13} className="text-neutral-500 hover:text-red-400" />
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="text-neutral-500 text-sm leading-relaxed flex-grow mb-5 line-clamp-3">{project.description}</p>

                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {(project.tech_stack || []).slice(0, 4).map(t => (
                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-500 font-mono">{t}</span>
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
                  ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════ SKILLS ══════════════ */}
        <section id="skills" className="px-6 py-28 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionHeader eyebrow="Tech Arsenal" title="Tools I" accent="Master." />
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(skills).map(([category, items]) => (
                <motion.div key={category} variants={fadeUp}>
                  <GlowCard className="p-5 h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-5 rounded-full bg-red-600" />
                      <h3 className="text-white font-black text-sm uppercase tracking-wider">{category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map(s => <SkillPill key={s} skill={s} />)}
                    </div>
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
              <motion.div variants={fadeUp}>
                <SectionHeader eyebrow="Get In Touch" title="Open for" accent="Opportunities." />
              </motion.div>

              <div className="grid md:grid-cols-[380px_1fr] gap-10">

                {/* Left info panel */}
                <motion.div variants={fadeUp} className="space-y-4">
                  <GlowCard className="p-6">
                    <h3 className="text-white font-black text-base mb-2">Let's build something great</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                      Open to internships, freelance contracts, and full-time SDE roles.
                      Fast response guaranteed.
                    </p>

                    {[
                      { icon: Phone, text: '+91 78703 53493', href: 'tel:+917870353493' },
                      { icon: Mail, text: 'sanjatkumar18@gmail.com', href: 'mailto:sanjatkumar18@gmail.com' },
                      { icon: MapPin, text: 'Mohali, Punjab, India', href: '#' },
                    ].map(({ icon: Icon, text, href }) => (
                      <a key={text} href={href}
                        className="flex items-center gap-3 mb-4 text-sm text-neutral-400 hover:text-white transition-colors group">
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

                      {formStatus.error && (
                        <p className="text-red-500 text-xs text-center font-bold uppercase tracking-widest">
                          Failed to send. Try emailing directly.
                        </p>
                      )}
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
              <div className="w-7 h-7 bg-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm font-mono">S</span>
              </div>
              <span className="text-neutral-600 text-xs font-mono">Sanjat Kumar © 2026</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-700 text-xs font-mono">
              <Shield size={11} className="text-red-700" />
              Built with React · Django · PostgreSQL · AWS
            </div>
            <div className="flex items-center gap-4">
              {[
                { href: '#experience', label: 'Experience' },
                { href: '#projects', label: 'Projects' },
                { href: '#contact', label: 'Contact' },
              ].map(l => (
                <a key={l.label} href={l.href}
                  className="text-neutral-700 hover:text-neutral-400 text-xs uppercase tracking-widest font-bold transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}