import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Server } from 'lucide-react';

function Footer() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    // Har 30 seconds mein health check karega
    const checkHealth = () => {
      axios.get('http://127.0.0.1:8000/api/health-check/')
        .then(response => setHealth(response.data))
        .catch(error => console.error("Health check failed:", error));
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full border-t border-white/5 bg-[#050505] py-6 px-6 mt-12 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="text-gray-500 text-xs font-bold tracking-widest uppercase">
          © {new Date().getFullYear()} Sanjat Kumar. All systems running.
        </div>

        {/* Live Health Status UI */}
        <div className="flex items-center gap-4 bg-[#0a0a0a] border border-white/5 px-4 py-2 rounded-lg shadow-inner">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${health?.status === 'Operational' ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${health?.status === 'Operational' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-1">
              <Server size={10} /> {health ? health.status : "Checking..."}
            </span>
          </div>

          <div className="w-px h-4 bg-white/10"></div>

          <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-gray-400 font-mono">
            <Activity size={10} className="text-red-500" /> DB PING: {health ? `${health.latency_ms}ms` : "--"}
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;