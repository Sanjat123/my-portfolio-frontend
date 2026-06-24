import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Shield, Eye, Calendar, Terminal } from 'lucide-react';

function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    // 1. Project ka data fetch karo
    axios.get(`http://127.0.0.1:8000/api/projects/${slug}/`)
      .then(response => {
        setProject(response.data);
      })
      .catch(error => console.error("Error fetching project:", error));

    // 2. Chupke se (Silently) View Count badhane ki API hit karo
    axios.post(`http://127.0.0.1:8000/api/projects/${slug}/add_view/`)
      .then(res => console.log("System log: View incremented"))
      .catch(err => console.error("System error: Failed to update view", err));

  }, [slug]);

  // Loading State (Skeleton for Detail Page)
  if (!project) return (
    <div className="min-h-screen bg-[#050505] flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-red-500 font-bold tracking-widest uppercase text-sm">Decrypting Files...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-red-500/30 p-6 md:p-12">
      
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white font-bold tracking-widest uppercase text-xs mb-10 transition-colors bg-[#111] px-4 py-2 rounded-full border border-white/5 hover:border-white/20">
          <ArrowLeft size={16} /> Return to Dashboard
        </Link>
        
        {/* Main Content Card */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-14 shadow-2xl shadow-red-900/10 relative overflow-hidden">
          
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent"></div>

          {/* Header Info */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-red-950/30 border-l-2 border-red-500 text-red-500 text-[10px] font-black tracking-[0.2em] uppercase mb-6 w-max">
            <Terminal size={12} /> Project Log
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-red-500 font-bold tracking-widest uppercase mb-10">
            {project.tagline}
          </p>
          
          {/* Meta Data Pills */}
          <div className="flex flex-wrap gap-4 mb-12 border-b border-white/5 pb-10">
            <span className="bg-[#111] text-gray-300 py-2 px-4 rounded-lg text-xs font-bold tracking-widest uppercase border border-white/5 flex items-center gap-2">
              <Eye size={14} className="text-red-500" /> {project.views_count + 1} System Views
            </span>
            <span className="bg-[#111] text-gray-300 py-2 px-4 rounded-lg text-xs font-bold tracking-widest uppercase border border-white/5 flex items-center gap-2">
              <Calendar size={14} className="text-red-500" /> {new Date(project.created_at).toLocaleDateString()}
            </span>
            {project.is_featured && (
              <span className="bg-red-950/40 text-red-400 py-2 px-4 rounded-lg text-xs font-bold tracking-widest uppercase border border-red-900/50 flex items-center gap-2">
                <Shield size={14} /> Featured Asset
              </span>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed text-lg whitespace-pre-wrap font-medium">
            {project.description}
          </div>

          {/* Links Section (If Github/Live URLs exist in DB) */}
          {(project.github_url || project.live_url) && (
            <div className="mt-14 pt-8 border-t border-white/5 flex gap-4">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm uppercase tracking-widest">
                  Launch App
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer" className="bg-[#111] hover:bg-[#1a1a1a] text-white border border-white/10 font-bold px-6 py-3 rounded-xl transition-all text-sm uppercase tracking-widest">
                  View Source
                </a>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;