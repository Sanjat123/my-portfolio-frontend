import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, PlusCircle, LogOut, Shield, Edit2, LayoutDashboard, 
  FolderOpen, Mail, Activity, Eye, Terminal, Menu, X, Check, Plus, Code2
} from 'lucide-react';

const AVAILABLE_TECH = ['React', 'Django', 'Flutter', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'AWS', 'Docker', 'C++', 'SQL'];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for Skeleton UI
  
  const [stats, setStats] = useState({ total_projects: 0, total_views: 0, total_messages: 0 });
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Form State including Tech Stack
  const [formData, setFormData] = useState({ title: '', tagline: '', description: '', slug: '', github_url: '', live_url: '', tech_stack: [] });
  const [customTech, setCustomTech] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Token ${token}` } };

  // Fetch all data on mount
 const fetchAllData = async () => {
    setLoading(true);
    
    // Smart URL detection
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isLocal 
      ? 'http://127.0.0.1:8000/api' 
      : 'https://my-portfolio-backend-2-ay2w.onrender.com/api';

    try {
      const [statsRes, projectsRes, messagesRes] = await Promise.all([
        axios.get(`${baseUrl}/stats/`, config),
        axios.get(`${baseUrl}/projects/`, config),
        axios.get(`${baseUrl}/messages/`, config)
      ]);
      
      setStats(statsRes.data);
      setProjects(projectsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Project Handlers ---
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/projects/${formData.slug}/`, formData, config);
      } else {
        await axios.post('http://127.0.0.1:8000/api/projects/', formData, config);
      }
      setFormData({ title: '', tagline: '', description: '', slug: '', github_url: '', live_url: '', tech_stack: [] });
      setEditingId(null);
      fetchAllData();
      alert("Asset Deployment Successful!");
    } catch (err) { alert("Deployment Failed. Check Slug uniqueness."); }
  };

  const deleteProject = async (id, slug) => {
    if(window.confirm("Are you sure you want to terminate this asset?")) {
      await axios.delete(`http://127.0.0.1:8000/api/projects/${slug}/`, config);
      fetchAllData();
    }
  };

  const startEdit = (p) => {
    setActiveTab('projects');
    setEditingId(p.id);
    setFormData({ ...p, tech_stack: p.tech_stack || [] });
    if (window.innerWidth < 768) setIsSidebarOpen(false); // Close sidebar on mobile
  };

  // --- Tech Stack Handlers ---
  const toggleTech = (tech) => {
    const isSelected = formData.tech_stack.includes(tech);
    setFormData(prev => ({
      ...prev,
      tech_stack: isSelected ? prev.tech_stack.filter(t => t !== tech) : [...prev.tech_stack, tech]
    }));
  };

  const addCustomTech = (e) => {
    e.preventDefault();
    if(customTech.trim() && !formData.tech_stack.includes(customTech.trim())) {
      setFormData(prev => ({ ...prev, tech_stack: [...prev.tech_stack, customTech.trim()] }));
      setCustomTech('');
    }
  };

  // --- Message Handlers ---
  const deleteMessage = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/messages/${id}/`, config);
    fetchAllData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) setIsSidebarOpen(false); // Close sidebar on mobile after clicking
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row font-sans selection:bg-red-500/30">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex justify-between items-center bg-[#0a0a0a] border-b border-white/5 p-4 z-50 relative">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-red-600" />
          <span className="font-black uppercase tracking-widest text-sm">Vault Admin</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-white/5 p-6 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 pt-20 md:pt-6' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-black tracking-widest uppercase text-sm">Vault Admin</h2>
            <p className="text-[10px] text-green-500 font-bold tracking-widest uppercase flex items-center gap-1">
              <Activity size={10} className="animate-pulse"/> System Online
            </p>
          </div>
        </div>

        <nav className="space-y-2 flex-grow">
          <button onClick={() => handleTabChange('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'overview' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard size={18} /> Overview
          </button>
          <button onClick={() => handleTabChange('projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'projects' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <FolderOpen size={18} /> Projects
          </button>
          <button onClick={() => handleTabChange('messages')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'messages' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <Mail size={18} /> Inbox
            {stats.total_messages > 0 && <span className="ml-auto bg-[#050505] text-red-500 px-2 py-0.5 rounded-md text-[10px] border border-white/10">{stats.total_messages}</span>}
          </button>
        </nav>

        <button onClick={handleLogout} className="mt-8 flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase text-red-500 hover:bg-red-950/30 rounded-xl transition-colors border border-transparent hover:border-red-900/50">
          <LogOut size={18} /> Terminate Session
        </button>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"></div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 lg:p-12 overflow-y-auto h-screen w-full">
        
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-8">System Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
              
              {loading ? (
                <>
                  {[1, 2, 3].map(n => (
                    <div key={n} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl animate-pulse h-32"></div>
                  ))}
                </>
              ) : (
                <>
                  <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-6 opacity-5"><FolderOpen size={64}/></div>
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Total Assets</p>
                    <h3 className="text-4xl md:text-5xl font-black text-white">{stats.total_projects}</h3>
                  </div>
                  <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-6 opacity-5 text-red-500"><Eye size={64}/></div>
                    <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-2">Impressions</p>
                    <h3 className="text-4xl md:text-5xl font-black text-red-500">{stats.total_views}</h3>
                  </div>
                  <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-6 opacity-5"><Mail size={64}/></div>
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Encrypted Messages</p>
                    <h3 className="text-4xl md:text-5xl font-black text-white">{stats.total_messages}</h3>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PROJECTS ================= */}
        {activeTab === 'projects' && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-8">Asset Management</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Add/Edit Form */}
              <div className="lg:col-span-1 bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl h-max shadow-xl order-2 lg:order-1">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 tracking-widest uppercase text-white border-b border-white/5 pb-4">
                  {editingId ? <><Edit2 className="text-blue-500" size={18}/> Edit Asset</> : <><PlusCircle className="text-green-500" size={18}/> Deploy Asset</>}
                </h2>
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <input required placeholder="Project Title" className="w-full bg-[#050505] border border-white/5 p-3.5 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  <input required placeholder="Slug (e.g. my-project)" className="w-full bg-[#050505] border border-white/5 p-3.5 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                  <input required placeholder="Tagline" className="w-full bg-[#050505] border border-white/5 p-3.5 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} />
                  
                  {/* TECH STACK SELECTOR UI */}
                  <div className="p-4 bg-[#050505] border border-white/5 rounded-xl">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 block flex items-center gap-2"><Code2 size={12}/> Tech Stack Setup</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {AVAILABLE_TECH.map(tech => (
                        <button type="button" key={tech} onClick={() => toggleTech(tech)} 
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors flex items-center gap-1 border
                          ${formData.tech_stack.includes(tech) ? 'bg-red-950/30 border-red-500/50 text-red-400' : 'bg-[#111] border-white/5 text-gray-500 hover:text-gray-300'}`}>
                          {formData.tech_stack.includes(tech) && <Check size={12}/>} {tech}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Custom tech..." className="flex-grow bg-[#111] border border-white/5 p-2 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/30" value={customTech} onChange={(e)=>setCustomTech(e.target.value)} />
                      <button onClick={addCustomTech} className="bg-[#222] hover:bg-[#333] px-3 rounded-lg text-xs font-bold transition-colors"><Plus size={14}/></button>
                    </div>
                    {/* Custom tags display */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tech_stack.filter(t => !AVAILABLE_TECH.includes(t)).map(tech => (
                        <button type="button" key={tech} onClick={() => toggleTech(tech)} className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase border border-red-500/50 bg-red-950/30 text-red-400 flex items-center gap-1"><Check size={12}/> {tech}</button>
                      ))}
                    </div>
                  </div>

                  <input placeholder="GitHub URL (Optional)" className="w-full bg-[#050505] border border-white/5 p-3.5 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} />
                  <input placeholder="Live Demo URL (Optional)" className="w-full bg-[#050505] border border-white/5 p-3.5 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50" value={formData.live_url} onChange={e => setFormData({...formData, live_url: e.target.value})} />
                  <textarea required placeholder="Full Description" rows="5" className="w-full bg-[#050505] border border-white/5 p-3.5 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  
                  <button type="submit" className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg ${editingId ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' : 'bg-red-600 hover:bg-red-500 shadow-red-900/20'}`}>
                    {editingId ? 'Update System' : 'Initialize Deployment'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => {setEditingId(null); setFormData({ title: '', tagline: '', description: '', slug: '', github_url: '', live_url: '', tech_stack: [] });}} className="w-full bg-[#111] hover:bg-[#1a1a1a] text-gray-400 py-3 rounded-xl text-sm font-bold uppercase tracking-widest border border-white/5 transition-colors">
                      Cancel Edit
                    </button>
                  )}
                </form>
              </div>

              {/* Projects List */}
              <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
                {loading ? (
                  [1, 2].map(n => <div key={n} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl animate-pulse h-24"></div>)
                ) : projects.length === 0 ? (
                  <p className="text-gray-500 font-mono text-sm border border-dashed border-white/10 p-8 rounded-3xl text-center">No assets deployed yet.</p>
                ) : (
                  projects.map(p => (
                    <div key={p.id} className="bg-[#0a0a0a] border border-white/5 p-5 md:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-red-500/30 transition-all group shadow-lg">
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors line-clamp-1">{p.title}</h3>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mt-1">Slug: {p.slug} | Views: {p.views_count}</p>
                        
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {p.tech_stack?.slice(0, 4).map(tech => (
                            <span key={tech} className="text-[8px] bg-[#111] border border-white/5 px-2 py-1 rounded-md text-gray-400 uppercase font-bold">{tech}</span>
                          ))}
                          {p.tech_stack?.length > 4 && <span className="text-[8px] text-gray-600 px-1 py-1 font-bold">+{p.tech_stack.length - 4}</span>}
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-white/5 pt-3 sm:pt-0 sm:pl-4">
                        <button onClick={() => startEdit(p)} className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-[#111] text-blue-400 hover:text-white px-4 py-2 rounded-lg border border-white/5 transition-colors text-xs font-bold uppercase tracking-widest">
                          <Edit2 size={14} /> Edit
                        </button>
                        <button onClick={() => deleteProject(p.id, p.slug)} className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg border border-red-900/30 transition-colors text-xs font-bold uppercase tracking-widest">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 3: INBOX (MESSAGES) ================= */}
        {activeTab === 'messages' && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
              <Terminal className="text-red-600" /> Secure Inbox
            </h1>
            <div className="space-y-4 max-w-4xl">
              {loading ? (
                [1, 2].map(n => <div key={n} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl animate-pulse h-32"></div>)
              ) : messages.length === 0 ? (
                <p className="text-gray-500 font-mono text-sm border border-dashed border-white/10 p-8 rounded-3xl text-center">Inbox is empty. No incoming transmissions.</p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl relative shadow-lg group hover:border-white/10 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-white/5 pb-4 gap-4">
                      <div>
                        <h3 className="font-bold text-white uppercase tracking-widest text-sm md:text-base">{msg.name}</h3>
                        <a href={`mailto:${msg.email}`} className="text-red-400 text-xs md:text-sm font-medium hover:underline flex items-center gap-1 mt-1"><Mail size={12}/> {msg.email}</a>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end w-full sm:w-auto justify-between sm:justify-start gap-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{new Date(msg.created_at).toLocaleString()}</span>
                        <button onClick={() => { if(window.confirm("Delete this transmission forever?")) deleteMessage(msg.id) }} className="text-gray-600 hover:text-red-500 transition-colors bg-[#111] p-1.5 rounded-md">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap font-mono bg-[#050505] p-4 rounded-xl border border-white/5">
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;