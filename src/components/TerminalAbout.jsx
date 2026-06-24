import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minus } from 'lucide-react';

function TerminalAbout() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'VAULT OS v2.0.4 [Secure Connection Established]' },
    { type: 'system', text: 'Type "help" to view available commands.' }
  ]);
  
  // Naya Ref: Ab hum sirf scrollable box ko target karenge
  const terminalScrollRef = useRef(null);

  // Auto-scroll sirf terminal ke andar hoga, page scroll nahi hoga
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
            '> DATABASE: PostgreSQL, MongoDB, MySQL',
            '> DEVOPS: AWS EC2, Docker, Nginx',
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
      
      {/* Terminal Header */}
      <div className="bg-neutral-900/80 px-3 md:px-4 py-3 flex justify-between items-center border-b border-neutral-800/60 backdrop-blur-sm">
        <div className="flex gap-1.5 md:gap-2">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500/80"></div>
        </div>
        <div className="flex items-center gap-2 text-neutral-500 text-[10px] md:text-xs font-bold tracking-widest uppercase">
          <TerminalIcon size={12} className="hidden md:block" /> guest@vault-server
        </div>
        <div className="flex gap-2 md:gap-3 text-neutral-600">
          <Minus size={14} className="hover:text-neutral-400 cursor-pointer hidden md:block" />
          <Maximize2 size={14} className="hover:text-neutral-400 cursor-pointer hidden md:block" />
          <X size={14} className="hover:text-red-500 cursor-pointer" />
        </div>
      </div>

      {/* Terminal Body */}
      {/* Custom scrollbar hiding classes added for clean look */}
      <div 
        ref={terminalScrollRef}
        className="p-4 md:p-6 h-[300px] md:h-[400px] overflow-y-auto text-xs md:text-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {history.map((line, index) => (
          <div 
            key={index} 
            className={`mb-1.5 leading-relaxed break-words ${
              line.type === 'system' ? 'text-emerald-400' : 
              line.type === 'user' ? 'text-white font-bold mt-4 md:mt-5' : 
              'text-neutral-400 ml-2 md:ml-4'
            }`}
          >
            {line.text}
          </div>
        ))}
        
        {/* Input Line */}
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

export default TerminalAbout;