
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Search, Play, Heart, Flame, Bot, MapPin, Send, User as UserIcon, Lock, 
  Mail, GraduationCap, Briefcase as BriefcaseIcon, LogOut, Plus, Users, 
  Calendar, FileText, Edit3, BookOpen, LayoutDashboard, MessageSquare, 
  Clock, ScanFace, CheckCircle, AlertCircle, PlaySquare, Image as ImageIcon, 
  Film, Save, Eye, Github, Linkedin, Network, Building, Zap, ArrowRight,
  TrendingUp, Globe, Smartphone, Laptop, Filter, Check, Camera, Upload,
  ExternalLink, ChevronRight, Book, Award, MoreVertical, Briefcase
} from 'lucide-react';
import { User, UserRole, Video as VideoType, CampusBuilding, Course, CampusEvent, Job, NewsArticle, Applicant } from './types';
import { NAV_ITEMS, MOCK_BUILDINGS, MOCK_COURSES, MOCK_VIDEOS, MOCK_EVENTS, MOCK_NEWS, MOCK_JOBS } from './constants';
import { askUnistoneAI } from './services/gemini';

// --- Global State Persistence ---
const useSyncedState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
};

// --- Auth View ---
const AuthView = ({ onLogin, logo }: { onLogin: (user: User) => void; logo: string }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'STU-2024-X', name: 'Sarah Connor', email: 'sarah@unistone.edu', role: UserRole.STUDENT,
        department: 'CS', attendance: 88, xp: 12400, streak: 12, bio: 'Synchronizing intelligence nodes.',
        skills: ['React', 'Python', 'AI'], profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop'
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white">
        <div className="md:w-1/2 p-12 text-white academic-gradient flex flex-col justify-between">
          <div>
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl overflow-hidden">
              <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase">UNISTONE</h1>
            <p className="text-[#F0E68C] text-lg font-medium tracking-tight">Synchronized Smart Campus OS</p>
          </div>
          <div className="p-5 bg-white/10 rounded-[1.5rem] backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-center">Verified Node</div>
        </div>
        <div className="md:w-1/2 p-12 bg-white flex flex-col justify-center">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-8 uppercase">Establish Link</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative"><Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input name="email" type="email" required placeholder="University ID" className="w-full pl-14 pr-6 py-4 bg-slate-50 border rounded-2xl outline-none focus:border-[#8B0000]" /></div>
            <div className="relative"><Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input name="password" type="password" required placeholder="Credential" className="w-full pl-14 pr-6 py-4 bg-slate-50 border rounded-2xl outline-none focus:border-[#8B0000]" /></div>
            <button disabled={loading} className="w-full py-5 bg-[#8B0000] text-white font-black rounded-2xl shadow-xl uppercase text-[11px] tracking-widest hover:bg-[#a50000] transition-all">{loading ? 'Synchronizing...' : 'Establish Connection'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- News Reader ---
const NewsReader = ({ news, onClose }: { news: NewsArticle, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[3000] bg-white animate-in slide-in-from-bottom duration-500 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto px-6 py-20 relative">
        <button onClick={onClose} className="fixed top-10 right-10 p-4 bg-slate-100 rounded-full hover:bg-slate-200 transition-all z-50"><X size={24}/></button>
        <div className="space-y-10">
          <div className="space-y-6">
            <span className="px-5 py-2 bg-[#F0E68C] text-[#8B0000] text-[10px] font-black uppercase rounded-xl">{news.source} • {news.readTime}</span>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{news.title}</h1>
          </div>
          <div className="h-[500px] rounded-[4rem] overflow-hidden shadow-2xl"><img src={news.image} className="w-full h-full object-cover" alt="" /></div>
          <div className="prose prose-xl text-slate-600 font-medium leading-relaxed space-y-8">
            <p className="text-2xl text-slate-900 font-bold italic">Latest synchronization report from {news.source}:</p>
            <p>{news.content || "The intersection of digital infrastructure and academic pedagogy is reaching a critical inflection point. As neural-sync technologies mature, platforms like UNISTONE are pioneering how students interact with their environment. This breakthrough represents a significant shift in how we process real-time campus data and personal learning trajectories."}</p>
            <p>Experts suggest that by 2025, over 80% of top-tier universities will have transitioned to a decentralized 'Mesh Node' architecture, where events, learning assets, and professional networking are handled via a single synchronized identity protocol.</p>
          </div>
          <button className="flex items-center gap-4 text-[#8B0000] font-black uppercase tracking-widest hover:gap-6 transition-all">Read Full Protocol on {news.source} <ArrowRight/></button>
        </div>
      </div>
    </div>
  );
};

// --- Map Module ---
const RealisticMap = ({ buildings }: { buildings: CampusBuilding[] }) => {
  const [selected, setSelected] = useState<CampusBuilding | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const focusBuilding = (b: CampusBuilding) => {
    setSelected(b);
    if (mapRef.current) {
      mapRef.current.scrollTo({ top: parseInt(b.mapCoords.top) * 5, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <div ref={mapRef} className="h-[70vh] bg-slate-100 rounded-[5rem] border border-slate-200 relative overflow-hidden shadow-inner">
        {/* Realistic Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b0000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }} />
        
        {/* Synthetic Pathways */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
          <path d="M0,100 L500,500 L1000,200" stroke="#8B0000" strokeWidth="40" fill="none" />
          <path d="M200,0 L600,800" stroke="#8B0000" strokeWidth="20" fill="none" />
        </svg>

        {buildings.map(b => (
          <div key={b.id} onClick={() => setSelected(b)} className="map-pin group" style={{ top: b.mapCoords.top, left: b.mapCoords.left }}>
            <div className={`w-16 h-16 ${b.color} rounded-[1.5rem] border-[6px] border-white shadow-2xl flex items-center justify-center text-white transition-all hover:scale-125 cursor-pointer hover:rotate-12 ${selected?.id === b.id ? 'ring-[12px] ring-[#8B0000]/30 border-[#8B0000] scale-110 shadow-[0_0_50px_rgba(139,0,0,0.5)]' : ''}`}>
              <Building size={28} />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 px-4 py-1.5 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              <p className="text-[10px] font-black uppercase text-slate-900">{b.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">Infrastructure Ledger <span className="text-slate-300 text-sm">({buildings.length} Nodes)</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {buildings.map(b => (
            <div key={b.id} onClick={() => focusBuilding(b)} className={`bg-white p-6 rounded-[3.5rem] border-2 transition-all cursor-pointer group ${selected?.id === b.id ? 'border-[#8B0000] shadow-2xl scale-105' : 'border-slate-100 hover:border-[#F0E68C] shadow-sm'}`}>
              <div className="h-44 rounded-[2.5rem] overflow-hidden mb-6 relative">
                <img src={b.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-2xl text-[#8B0000]"><Zap size={16}/></div>
              </div>
              <div className="px-2 pb-2">
                <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900">{b.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-3 tracking-widest flex items-center gap-2"><MapPin size={12} className="text-[#8B0000]"/> Lat/Long Node Synced</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in zoom-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-5xl border-[10px] border-[#F0E68C]/20 flex flex-col md:flex-row">
            <div className="md:w-1/2 h-96 md:h-auto"><img src={selected.image} className="w-full h-full object-cover" /></div>
            <div className="md:w-1/2 p-16 space-y-10">
              <div className="flex justify-between items-start">
                <div><h3 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">{selected.name}</h3><p className="text-[#8B0000] font-black uppercase mt-4 text-xs tracking-widest">Mesh Zone: Prime Node</p></div>
                <button onClick={() => setSelected(null)} className="p-3 bg-slate-50 rounded-2xl"><X/></button>
              </div>
              <p className="text-slate-500 font-medium italic leading-relaxed text-lg">{selected.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-[1.8rem] border border-slate-100"><p className="text-xs font-black text-slate-400 uppercase">Levels</p><p className="text-2xl font-black">{selected.floors}</p></div>
                <div className="p-6 bg-slate-50 rounded-[1.8rem] border border-slate-100"><p className="text-xs font-black text-slate-400 uppercase">Sync Status</p><p className="text-2xl font-black text-emerald-500">Active</p></div>
              </div>
              <button className="w-full py-8 bg-[#8B0000] text-white rounded-[3rem] font-black uppercase text-[12px] shadow-2xl hover:scale-[1.02] transition-all">Initiate Navigation Link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Profile Hub ---
const ProfileHub = ({ user, setUser }: { user: User, setUser: Function }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const profileFileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, [type === 'profile' ? 'profileImage' : 'coverImage']: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const save = () => { setUser(formData); setEditing(false); };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden relative">
        <div className="h-64 relative group cursor-pointer" onClick={() => editing && coverFileRef.current?.click()}>
          <img src={formData.coverImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=400&fit=crop'} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {editing && <div className="absolute inset-0 flex items-center justify-center bg-black/40"><Camera size={40} className="text-white animate-bounce-slow"/></div>}
          <input type="file" ref={coverFileRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
        </div>
        <div className="px-12 pb-12 relative">
          <div className="flex justify-between items-end -translate-y-16">
            <div className="relative group cursor-pointer" onClick={() => editing && profileFileRef.current?.click()}>
              <div className="w-44 h-44 rounded-full bg-white border-[8px] border-white shadow-2xl overflow-hidden">
                <img src={formData.profileImage} className="w-full h-full object-cover" />
              </div>
              {editing && <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full"><Upload size={32} className="text-white"/></div>}
              <input type="file" ref={profileFileRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'profile')} />
            </div>
            <button onClick={() => editing ? save() : setEditing(true)} className={`mb-6 px-10 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-105 transition-all ${editing ? 'bg-emerald-500 text-white' : 'bg-[#8B0000] text-white'}`}>
              {editing ? 'Commit Sync' : 'Edit Identity Node'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 -mt-4">
            <div className="space-y-10">
              {editing ? (
                <div className="space-y-6">
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border rounded-3xl font-black text-slate-700" placeholder="Master Name" />
                  <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border rounded-3xl font-medium h-32 resize-none" placeholder="Bio Data" />
                  <div className="space-y-4">
                    <div className="flex gap-4"><Github size={18} className="text-[#8B0000]"/><input value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="flex-1 text-xs border-b pb-2" placeholder="GitHub Handle" /></div>
                    <div className="flex gap-4"><Linkedin size={18} className="text-[#8B0000]"/><input value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} className="flex-1 text-xs border-b pb-2" placeholder="LinkedIn Handle" /></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{formData.name}</h2>
                    <div className="flex items-center gap-3 mt-6">
                      <span className="px-4 py-1.5 bg-[#F0E68C]/20 text-[#8B0000] text-[10px] font-black uppercase rounded-lg border border-[#F0E68C]/40">{formData.department} Hub Node</span>
                      <span className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-lg border border-slate-100">{formData.id}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 font-medium italic text-lg leading-relaxed">{formData.bio}</p>
                  <div className="flex gap-4">
                    <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-[#8B0000] transition-all"><Github size={24}/></button>
                    <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-[#8B0000] transition-all"><Linkedin size={24}/></button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-10">
              <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 space-y-8 shadow-inner">
                <div className="flex justify-between items-center"><h3 className="text-xl font-black uppercase tracking-tight">Sync Integrity</h3><Zap className="text-[#8B0000]" /></div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end"><p className="text-[10px] font-black uppercase text-slate-400">Attendance Sync</p><p className="text-4xl font-black text-[#8B0000]">{formData.attendance}%</p></div>
                   <div className="h-4 bg-white rounded-full overflow-hidden border border-slate-100"><div className="h-full bg-gradient-to-r from-[#8B0000] to-[#F0E68C]" style={{width: `${formData.attendance}%`}}/></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 text-center shadow-sm hover:shadow-2xl transition-all">
                  <Flame className="mx-auto text-orange-500 mb-4" size={48} fill="currentColor"/>
                  <p className="text-4xl font-black text-slate-900">{formData.streak}</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 mt-2">Days Sync</p>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 text-center shadow-sm hover:shadow-2xl transition-all">
                  <Award className="mx-auto text-[#8B0000] mb-4" size={48} />
                  <p className="text-4xl font-black text-slate-900">{formData.xp}</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 mt-2">Energy (XP)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Career Hub ---
const CareerHub = ({ user }: { user: User }) => {
  const [jobs, setJobs] = useSyncedState<Job[]>('unistone-jobs-dynamic', MOCK_JOBS);
  const [activeTab, setActiveTab] = useState<'find' | 'applied' | 'faculty'>('find');
  const [viewingApplicantsFor, setViewingApplicantsFor] = useState<Job | null>(null);

  const nicheJobs = useMemo(() => jobs.filter(j => j.niche === user.department || j.niche === 'General'), [user.department, jobs]);
  const appliedJobs = useMemo(() => jobs.filter(j => j.applicants.some(a => a.studentId === user.id)), [user.id, jobs]);

  const apply = (jobId: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          applicants: [...j.applicants, { studentId: user.id, studentName: user.name, appliedDate: new Date().toLocaleDateString(), status: 'pending', studentImage: user.profileImage }]
        };
      }
      return j;
    }));
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in">
      <header className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
           <h2 className="text-7xl font-black uppercase tracking-tighter leading-none">Career <span className="text-[#8B0000]">Mesh</span></h2>
           <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed">Active synchronization with industrial nodes.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
           <button onClick={() => setActiveTab('find')} className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'find' ? 'bg-[#8B0000] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Opportunities</button>
           <button onClick={() => setActiveTab('applied')} className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'applied' ? 'bg-[#8B0000] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>My Syncs</button>
           {user.role === UserRole.FACULTY && <button onClick={() => setActiveTab('faculty')} className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'faculty' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Faculty Terminal</button>}
        </div>
      </header>

      {activeTab === 'find' && (
        <div className="grid grid-cols-1 gap-8">
          {nicheJobs.map(job => {
            const hasApplied = job.applicants.some(a => a.studentId === user.id);
            return (
              <div key={job.id} className="bg-white p-12 rounded-[4.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between group hover:border-[#F0E68C] transition-all gap-8">
                <div className="flex items-center gap-10">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center font-black text-4xl text-[#8B0000] group-hover:bg-[#8B0000] group-hover:text-white transition-all duration-500 shadow-inner">{job.company[0]}</div>
                  <div className="space-y-4">
                    <h4 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">{job.title}</h4>
                    <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest italic">{job.company} • {job.location}</p>
                    <div className="flex flex-wrap gap-3">{job.tags.map(tag => <span key={tag} className="px-5 py-2 bg-slate-50 text-[10px] font-black uppercase text-slate-500 rounded-xl border border-slate-100">{tag}</span>)}</div>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-6 pt-8 md:pt-0">
                   <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{job.salary}</p>
                   <button onClick={() => apply(job.id)} disabled={hasApplied} className={`px-14 py-7 rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 shadow-2xl ${hasApplied ? 'bg-emerald-500 text-white cursor-default' : 'bg-[#8B0000] text-white hover:bg-black'}`}>
                     {hasApplied ? <span className="flex items-center gap-3"><CheckCircle size={18}/> Synced</span> : 'Initiate Application'}
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'applied' && (
        <div className="space-y-8">
          {appliedJobs.length === 0 ? (
            <div className="p-32 text-center bg-white rounded-[5rem] border-2 border-dashed border-slate-200">
               <BriefcaseIcon size={64} className="mx-auto text-slate-100 mb-8" />
               <p className="text-slate-400 font-bold uppercase tracking-widest">No active career syncs detected.</p>
            </div>
          ) : appliedJobs.map(job => {
            const myApp = job.applicants.find(a => a.studentId === user.id);
            return (
              <div key={job.id} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><Check size={32}/></div>
                  <div><h4 className="text-2xl font-black uppercase tracking-tight text-slate-900">{job.title}</h4><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{job.company} • Applied on {myApp?.appliedDate}</p></div>
                </div>
                <span className="px-8 py-3 bg-emerald-50 text-emerald-600 font-black uppercase text-[10px] tracking-widest rounded-2xl border border-emerald-100">Status: {myApp?.status}</span>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'faculty' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map(job => (
              <div key={job.id} onClick={() => setViewingApplicantsFor(job)} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:border-slate-900 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl">{job.company[0]}</div>
                  <span className="px-5 py-2 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-xl">{job.applicants.length} Nodes Applied</span>
                </div>
                <h4 className="text-xl font-black uppercase text-slate-900 leading-tight group-hover:text-[#8B0000]">{job.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 tracking-widest">{job.company}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewingApplicantsFor && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in">
           <div className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-5xl border-[8px] border-slate-900/20 flex flex-col max-h-[80vh]">
              <div className="p-12 bg-slate-900 text-white flex justify-between items-center">
                 <div><h3 className="text-3xl font-black uppercase tracking-tighter">Placement Terminal</h3><p className="text-slate-400 font-bold uppercase text-[10px] mt-2">Node: {viewingApplicantsFor.title} @ {viewingApplicantsFor.company}</p></div>
                 <button onClick={() => setViewingApplicantsFor(null)} className="p-4 bg-white/10 rounded-3xl hover:bg-white/20 transition-all"><X/></button>
              </div>
              <div className="p-12 overflow-y-auto space-y-6">
                 {viewingApplicantsFor.applicants.length === 0 ? (
                   <p className="text-center py-20 text-slate-300 font-black uppercase">Awaiting Student Synchronization...</p>
                 ) : viewingApplicantsFor.applicants.map(app => (
                   <div key={app.studentId} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-between group hover:bg-white transition-all">
                      <div className="flex items-center gap-6">
                         <img src={app.studentImage} className="w-16 h-16 rounded-full border-4 border-white shadow-xl object-cover" />
                         <div><p className="text-xl font-black text-slate-900 uppercase leading-none">{app.studentName}</p><p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">ID: {app.studentId} • Applied: {app.appliedDate}</p></div>
                      </div>
                      <div className="flex gap-4">
                         <button className="px-8 py-3 bg-[#8B0000] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Shortlist</button>
                         <button className="px-8 py-3 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest">View Identity</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- News Section ---
const NewsSection = ({ department }: { department: string }) => {
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const filteredNews = useMemo(() => MOCK_NEWS.filter(n => n.category === department || n.category === 'General'), [department]);

  return (
    <div className="space-y-12 animate-in fade-in pb-20">
      <header>
        <h2 className="text-7xl font-black uppercase tracking-tighter leading-none">Tech <span className="text-[#8B0000]">Pulse</span></h2>
        <p className="text-slate-500 font-medium italic mt-5 text-xl">High-priority intelligence filtered for the <span className="text-[#8B0000] font-black">{department} Node</span>.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredNews.map(news => (
          <div key={news.id} onClick={() => setSelectedNews(news)} className="bg-white p-8 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group cursor-pointer">
            <div className="h-56 rounded-[3rem] overflow-hidden mb-8 relative">
              <img src={news.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-6 left-6 px-5 py-2 bg-[#F0E68C]/90 backdrop-blur-md text-[#8B0000] text-[9px] font-black uppercase rounded-2xl">{news.source}</div>
            </div>
            <div className="px-4 space-y-4">
               <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-tight line-clamp-2">{news.title}</h4>
               <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={14}/> {news.readTime}</span>
                  <button className="text-[#8B0000] font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:gap-4 transition-all">Protocol Details <ChevronRight size={14}/></button>
               </div>
            </div>
          </div>
        ))}
      </div>
      {selectedNews && <NewsReader news={selectedNews} onClose={() => setSelectedNews(null)} />}
    </div>
  );
};

// --- Sidebar Controller ---
const Sidebar = ({ activeTab, setActiveTab, user, onLogout, logo }: any) => {
  const dynamicNav = useMemo(() => [
    ...NAV_ITEMS,
    { id: 'tech-news', label: 'Tech Pulse', icon: <Globe size={20} /> }
  ], []);

  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-100 z-[900] flex flex-col p-10 hidden md:flex">
      <div className="flex items-center gap-5 mb-16">
        <div className="w-16 h-16 bg-white rounded-[1.2rem] flex items-center justify-center shadow-xl border border-slate-100 overflow-hidden"><img src={logo} className="w-full h-full object-contain p-2" /></div>
        <span className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">Unistone</span>
      </div>
      <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar no-scrollbar">
        {dynamicNav.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all group ${activeTab === item.id ? 'bg-[#8B0000] text-white shadow-2xl shadow-[#8B0000]/20' : 'text-slate-400 hover:bg-slate-50'}`}>
            <div className={`${activeTab === item.id ? 'text-white' : 'text-slate-300 group-hover:text-[#8B0000]'}`}>{item.icon}</div>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>
      <button onClick={onLogout} className="w-full flex items-center gap-5 px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-50 transition-all mt-10"><LogOut size={22} /> Disconnect</button>
    </aside>
  );
};

// --- Course Detail Modal ---
const CourseDetail = ({ course, onClose }: { course: Course, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in">
      <div className="bg-white w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-5xl border-[10px] border-[#F0E68C]/20 flex flex-col max-h-[90vh]">
        <div className="h-64 academic-gradient relative p-16 flex items-end">
          <button onClick={onClose} className="absolute top-10 right-10 p-4 bg-white/20 backdrop-blur-md text-white rounded-3xl hover:bg-white/40 transition-all"><X size={24}/></button>
          <div className="flex items-center gap-10">
            <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center font-black text-5xl text-[#8B0000] shadow-2xl">{course.code[0]}</div>
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{course.name}</h2>
              <p className="text-[#F0E68C] font-black uppercase text-sm tracking-[0.2em]">{course.code} • MASTER HUB INSTRUCTOR: {course.instructor}</p>
            </div>
          </div>
        </div>
        <div className="p-16 overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-3 gap-16 bg-slate-50/50">
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-slate-400">Hub Curriculum <span className="px-4 py-1.5 bg-slate-200 text-slate-500 rounded-lg text-xs font-black">{course.lecturesCount} Streams</span></h3>
              <div className="space-y-4">
                {course.lectures.map((l, i) => (
                  <div key={l.id} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:border-[#F0E68C] shadow-sm hover:shadow-xl transition-all cursor-pointer">
                    <div className="flex items-center gap-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${l.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'}`}>{i + 1}</div>
                      <div><p className="text-xl font-black uppercase tracking-tight text-slate-900">{l.title}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Node Stream Duration: {l.duration}</p></div>
                    </div>
                    {l.status === 'completed' ? <div className="p-3 bg-emerald-50 text-emerald-500 rounded-full"><CheckCircle size={24}/></div> : <div className="p-3 bg-[#8B0000]/5 text-[#8B0000] rounded-full group-hover:bg-[#8B0000] group-hover:text-white transition-all"><Play size={24} fill="currentColor"/></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-10">
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 space-y-8 shadow-sm">
              <h4 className="text-[12px] font-black uppercase text-slate-300 tracking-widest">Master Instructor</h4>
              <div className="flex items-center gap-6">
                <img src={course.instructorImage} className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-xl object-cover" />
                <div><p className="text-xl font-black text-slate-900 uppercase leading-none">{course.instructor}</p><p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Verified Academic Node</p></div>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed italic">{course.description}</p>
            </div>
            <button className="w-full py-8 bg-[#8B0000] text-white rounded-[3rem] font-black uppercase text-[12px] shadow-2xl hover:scale-[1.03] transition-all flex items-center justify-center gap-4"><Zap size={20}/> Establish Full Hub Link</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Controller ---
export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('unistone-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [logo] = useSyncedState('unistone-logo', 'https://colleges18.s3.ap-south-1.amazonaws.com/Sage_univ_indore_b02eee0e17.jpg');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => { if (user) localStorage.setItem('unistone-user', JSON.stringify(user)); else localStorage.removeItem('unistone-user'); }, [user]);

  if (!user) return <AuthView onLogin={setUser} logo={logo} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return (
        <div className="space-y-16 pb-20 animate-in fade-in duration-500">
          <header className="flex flex-col lg:flex-row justify-between items-end gap-8">
            <div>
              <h2 className="text-7xl font-black uppercase tracking-tighter leading-none">System <span className="text-[#8B0000]">Feed</span></h2>
              <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Welcome back, {user.name}. Your academic identity is fully synchronized.</p>
            </div>
            <div className="flex gap-6">
              <div className="px-10 py-6 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-6"><Zap className="text-[#8B0000]" fill="currentColor" size={40}/><div className="text-center"><p className="text-4xl font-black">{user.attendance}%</p><p className="text-[8px] font-black uppercase text-slate-400">Integrity</p></div></div>
              <div className="px-10 py-6 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-6"><Flame className="text-orange-500" fill="currentColor" size={40}/><div className="text-center"><p className="text-4xl font-black">{user.streak}</p><p className="text-[8px] font-black uppercase text-slate-400">Streak</p></div></div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-16">
              <section className="bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-end mb-12"><h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4"><TrendingUp className="text-[#8B0000]"/> Recent Intel</h3><button onClick={() => setActiveTab('tech-news')} className="text-[#8B0000] text-xs font-black uppercase tracking-widest hover:underline">Full Pulse Terminal</button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {MOCK_NEWS.slice(0, 2).map(news => (
                    <div key={news.id} className="group cursor-pointer" onClick={() => setActiveTab('tech-news')}>
                      <div className="h-48 rounded-[3rem] overflow-hidden mb-6 shadow-xl relative"><img src={news.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /><div className="absolute top-5 left-5 px-4 py-1.5 bg-[#F0E68C] text-[#8B0000] text-[9px] font-black uppercase rounded-xl">{news.source}</div></div>
                      <h4 className="text-xl font-black uppercase text-slate-900 leading-tight group-hover:text-[#8B0000] transition-colors">{news.title}</h4>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-10">
                <div className="flex justify-between items-end"><h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4"><PlaySquare className="text-red-500" size={32}/> Knowledge Stream</h3><button className="px-8 py-3 bg-[#8B0000] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3"><Upload size={14}/> Contribute Insight</button></div>
                <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar snap-x">
                  {MOCK_VIDEOS.map(v => (
                    <div key={v.id} className="w-56 h-96 bg-slate-200 rounded-[3.5rem] overflow-hidden shrink-0 relative group shadow-2xl snap-start border-[6px] border-white">
                      <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex flex-col justify-end p-8">
                        <div className="flex items-center gap-3 mb-4"><img src={v.uploaderImage} className="w-8 h-8 rounded-full border-2 border-white shadow-md"/><p className="text-white text-[9px] font-black uppercase">{v.uploadedBy}</p></div>
                        <p className="text-white text-[12px] font-black line-clamp-2 uppercase tracking-tight leading-relaxed">{v.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-12">
              <section className="bg-slate-900 p-14 rounded-[5rem] text-white relative overflow-hidden shadow-3xl">
                 <h3 className="text-3xl font-black uppercase mb-12 flex items-center gap-4 tracking-tighter"><Calendar className="text-[#F0E68C]" size={32}/> Campus Pulse</h3>
                 <div className="space-y-10">
                    {MOCK_EVENTS.map(e => (
                      <div key={e.id} className="flex gap-6 group cursor-pointer" onClick={() => setActiveTab('events')}>
                        <div className="w-20 h-20 rounded-[1.8rem] overflow-hidden border border-white/10 shrink-0 shadow-2xl"><img src={e.image} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"/></div>
                        <div className="overflow-hidden flex flex-col justify-center">
                          <p className="text-lg font-black truncate uppercase tracking-tighter group-hover:text-[#F0E68C] transition-colors leading-none">{e.title}</p>
                          <p className="text-[10px] text-slate-500 truncate mt-3 tracking-widest uppercase font-bold">{e.date} • {e.location}</p>
                        </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-16 py-7 bg-white/5 border border-white/10 rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest hover:bg-white/10 transition-all" onClick={() => setActiveTab('events')}>Full Pulse Registry</button>
              </section>
            </div>
          </div>
        </div>
      );
      case 'navigation': return <RealisticMap buildings={MOCK_BUILDINGS} />;
      case 'tech-news': return <NewsSection department={user.department} />;
      case 'edustone': return (
        <div className="space-y-12 pb-20 animate-in fade-in">
          <h2 className="text-7xl font-black uppercase leading-none tracking-tighter">Edustone <span className="text-[#8B0000]">Repository</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {MOCK_COURSES.map(course => (
              <div key={course.id} onClick={() => setSelectedCourse(course)} className="bg-white p-12 rounded-[4.5rem] border border-slate-100 shadow-sm group hover:border-[#F0E68C] transition-all hover:shadow-2xl cursor-pointer">
                <div className="w-24 h-24 bg-[#F0E68C]/20 rounded-[2rem] flex items-center justify-center font-black text-4xl text-[#8B0000] mb-12 shadow-inner group-hover:bg-[#8B0000] group-hover:text-white transition-all duration-500">{course.code[0]}</div>
                <h4 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-tight line-clamp-1">{course.name}</h4>
                <p className="text-[12px] font-black text-slate-400 uppercase mt-4 tracking-widest italic">{course.instructor}</p>
                <div className="flex gap-6 mt-12">
                  <div className="flex-1 p-8 bg-slate-50 rounded-[2.5rem] text-center border border-slate-50 group-hover:bg-white group-hover:border-slate-100 transition-all"><p className="text-3xl font-black text-slate-900">{course.lecturesCount}</p><p className="text-[10px] font-black uppercase text-slate-400 mt-2">Streams</p></div>
                  <div className="flex-1 p-8 bg-slate-50 rounded-[2.5rem] text-center border border-slate-50 group-hover:bg-white group-hover:border-slate-100 transition-all"><p className="text-3xl font-black text-slate-900">{course.notesCount}</p><p className="text-[10px] font-black uppercase text-slate-400 mt-2">Intel Logs</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'videohub': return (
        <div className="space-y-12 pb-20 animate-in fade-in">
          <header className="flex justify-between items-end"><h2 className="text-7xl font-black uppercase leading-none tracking-tighter">Collaboration <span className="text-[#8B0000]">Stream</span></h2><button className="px-12 py-6 bg-[#8B0000] text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl flex items-center gap-4 hover:scale-105 transition-all"><Film size={20}/> Contribute Insight</button></header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {MOCK_VIDEOS.map(video => (
              <div key={video.id} className="bg-white rounded-[4rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-3xl transition-all">
                <div className="aspect-[9/16] relative overflow-hidden bg-slate-200">
                  <img src={video.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40"><Play size={40} fill="currentColor" /></div></div>
                </div>
                <div className="p-10 space-y-6">
                  <h4 className="text-slate-900 text-lg font-black uppercase tracking-tight line-clamp-2 leading-relaxed">{video.title}</h4>
                  <div className="flex items-center gap-4 border-t pt-6 border-slate-50"><img src={video.uploaderImage} className="w-12 h-12 rounded-2xl shadow-lg object-cover"/><div className="overflow-hidden"><p className="text-[11px] font-black text-slate-900 uppercase truncate leading-none">{video.uploadedBy}</p><p className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{video.uploaderRole}</p></div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'careers': return <CareerHub user={user} />;
      case 'profile': return <ProfileHub user={user} setUser={setUser} />;
      case 'comms': return (
        <div className="space-y-12 animate-in fade-in pb-20">
          <h2 className="text-7xl font-black uppercase leading-none tracking-tighter">Campus <span className="text-[#8B0000]">Connect</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {MOCK_COURSES.map(f => (
              <div key={f.id} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm group hover:border-[#F0E68C] transition-all hover:shadow-3xl cursor-pointer">
                 <div className="flex items-center gap-8 mb-10">
                    <img src={f.instructorImage} className="w-24 h-24 rounded-[2.5rem] object-cover shadow-2xl group-hover:scale-110 transition-transform duration-700 border-4 border-slate-50" />
                    <div className="space-y-2"><h4 className="text-2xl font-black text-slate-900 leading-none uppercase tracking-tighter">{f.instructor}</h4><p className="text-[10px] font-black text-[#8B0000] uppercase tracking-[0.2em]">{f.code} Faculty Hub</p></div>
                 </div>
                 <div className="space-y-4 pt-10 border-t border-slate-50"><button className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3"><Network size={16}/> Establish Direct Sync</button></div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'events': return (
        <div className="space-y-12 animate-in fade-in pb-20">
          <h2 className="text-7xl font-black uppercase leading-none tracking-tighter">Event <span className="text-[#8B0000]">Pulse</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {MOCK_EVENTS.map(e => (
              <div key={e.id} className="bg-white rounded-[5rem] border border-slate-100 shadow-sm overflow-hidden group hover:border-[#F0E68C] transition-all hover:shadow-4xl flex flex-col">
                <div className="h-80 relative overflow-hidden"><img src={e.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /><div className="absolute top-10 left-10 px-8 py-3 bg-[#8B0000]/80 backdrop-blur-md border border-white/20 text-white font-black uppercase text-[11px] tracking-widest rounded-[2rem]">{e.type}</div></div>
                <div className="p-16 flex-1 bg-white">
                   <div className="flex justify-between items-start mb-8">
                     <div><p className="text-[14px] font-black text-[#8B0000] uppercase tracking-[0.2em] mb-4">{e.date} • {e.time}</p><h4 className="text-5xl font-black uppercase tracking-tighter leading-tight">{e.title}</h4></div>
                     <div className="w-20 h-20 bg-slate-50 rounded-3xl flex flex-col items-center justify-center border border-slate-100"><p className="text-[10px] font-black uppercase text-slate-400">Energy</p><p className="text-2xl font-black">2.4k</p></div>
                   </div>
                   <div className="flex items-center gap-4 text-slate-400 font-bold text-base uppercase tracking-widest"><MapPin size={24} className="text-[#8B0000]"/> {e.location}</div>
                   <div className="mt-14 flex items-center justify-between pt-10 border-t border-slate-50"><div className="flex -space-x-4"><div className="w-12 h-12 rounded-full border-4 border-white bg-slate-200"></div><div className="w-12 h-12 rounded-full border-4 border-white bg-slate-300"></div><div className="w-12 h-12 rounded-full border-4 border-white bg-slate-400 flex items-center justify-center text-[10px] font-black text-white">+{e.registeredCount}</div></div><button className="px-14 py-7 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-[#8B0000] transition-all">Sync Registration</button></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser(null)} logo={logo} />
      <main className="md:ml-72 p-6 md:p-14 h-screen overflow-y-auto custom-scrollbar no-scrollbar scroll-smooth">{renderContent()}</main>
      {selectedCourse && <CourseDetail course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
    </div>
  );
}
