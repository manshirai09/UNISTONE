import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bell, Search, X, ShieldAlert, Play, Heart, MessageCircle, Share2, 
  TrendingUp, Award, Flame, Bot, MapPin, Info, Send, ZoomIn, ZoomOut, 
  Maximize, Compass, Layers, ChevronRight, User as UserIcon, Lock, 
  Mail, ArrowRight, GraduationCap, Briefcase as BriefcaseIcon, 
  ShieldCheck, LogOut, Plus, Upload, Users, Calendar, Settings, 
  FileText, CheckCircle2, Trash2, Edit3, Map as MapIcon, BookOpen, Video, LayoutDashboard, MessageSquare, Briefcase,
  Users2, Clock, Ticket, Navigation, Phone, Mail as MailIcon, Building2, Github, Linkedin, ExternalLink, Camera,
  Users as CommunityIcon, Laptop, Trophy, ClipboardCheck, Book, CalendarDays, Download, Link2, ScanFace, CheckCircle, AlertCircle,
  FileUp, PlaySquare, HelpCircle, GraduationCap as QuizIcon, FileStack, Database, Activity, HardDrive, Terminal, MoreVertical,
  Sliders, UserPlus, Filter, Shield, Settings2, Power, Globe, Palette, RefreshCw, Image as ImageIcon, Film, FilePlus, Key, Save,
  Eye, ThumbsUp, ChevronDown, Check, Briefcase as JobIcon, MessageSquare as ChatIcon, Laptop2, Link as LinkIcon
} from 'lucide-react';
import { User, UserRole, Video as VideoType, CampusBuilding, Course, MapCoords, CampusEvent, Authority, Project, Job, CommunityPost } from './types';
import { NAV_ITEMS, MOCK_BUILDINGS, MOCK_COURSES, MOCK_VIDEOS, MOCK_EVENTS, MOCK_JOBS, MOCK_POSTS, MOCK_SCHEDULE } from './constants';
import { askUnistoneAI } from './services/gemini';

// --- Global State Persistence Hook ---
const useSyncedState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

let globalAttendanceSession: any = null;
let onAttendanceStarted: ((session: any) => void) | null = null;

// --- Authentication View ---
const AuthView = ({ onLogin, logo }: { onLogin: (user: User) => void; logo: string }) => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const finalRole = isAdminPortal ? UserRole.ADMIN : role;

    setTimeout(() => {
      onLogin({
        id: finalRole === UserRole.ADMIN ? 'ADM-001' : (finalRole === UserRole.FACULTY ? 'FAC-301' : 'STU-2024'),
        name: finalRole === UserRole.ADMIN ? 'System Master' : (finalRole === UserRole.FACULTY ? 'Dr. Alan Turing' : 'Sarah Connor'),
        email: email,
        role: finalRole,
        department: 'Engineering',
        xp: finalRole === UserRole.STUDENT ? 12400 : 0,
        streak: finalRole === UserRole.STUDENT ? 12 : 0,
        bio: 'Optimizing my digital footprint at UNISTONE.',
        skills: finalRole === UserRole.STUDENT ? ['React', 'Python', 'AI'] : [],
        projects: []
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className={`md:w-1/2 p-12 text-white flex flex-col justify-between transition-all duration-700 ${isAdminPortal ? 'bg-slate-900' : 'academic-gradient'}`}>
          <div>
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl overflow-hidden">
              {logo.length > 5 ? <img src={logo} alt="Logo" className="w-full h-full object-cover" /> : <span className={`font-black italic text-3xl ${isAdminPortal ? 'text-slate-900' : 'text-blue-600'}`}>{logo}</span>}
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase">UNISTONE</h1>
            <p className="text-blue-100 text-lg font-medium leading-relaxed opacity-90 tracking-tight">Synchronized Smart Campus OS</p>
          </div>
          <div className="p-5 bg-white/10 rounded-[1.5rem] backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-center">
             Verified System Node
          </div>
        </div>
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white relative">
          <button onClick={() => setIsAdminPortal(!isAdminPortal)} className="absolute top-10 right-10 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all">
            {isAdminPortal ? 'Student Hub' : 'Admin Control'}
          </button>
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 uppercase">Connect Node</h2>
            <p className="text-slate-500 font-medium italic">Synchronizing academic identity...</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isAdminPortal && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button type="button" onClick={() => setRole(UserRole.STUDENT)} className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${role === UserRole.STUDENT ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-105' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <GraduationCap size={24} /><span className="text-[10px] font-black uppercase tracking-widest">Student</span>
                </button>
                <button type="button" onClick={() => setRole(UserRole.FACULTY)} className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${role === UserRole.FACULTY ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-105' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <BriefcaseIcon size={24} /><span className="text-[10px] font-black uppercase tracking-widest">Faculty</span>
                </button>
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="email" type="email" required placeholder="University ID / Email" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-sm font-bold transition-all shadow-inner" />
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="password" type="password" required placeholder="Security Credential" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-sm font-bold transition-all shadow-inner" />
            </div>
            <button disabled={loading} className={`w-full py-5 text-white font-black rounded-2xl shadow-2xl transition-all uppercase text-[11px] tracking-widest mt-6 ${isAdminPortal ? 'bg-slate-900 shadow-slate-900/20' : 'bg-blue-600 shadow-blue-500/20 active:scale-95 hover:bg-blue-700'}`}>
              {loading ? 'Synchronizing Node...' : 'Establish Connection'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Module: Connect Hub ---
const ConnectHub = ({ facultyList, studentList }: any) => {
  const [tab, setTab] = useState<'faculty' | 'community'>('faculty');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
           <h2 className="text-5xl font-black uppercase leading-none tracking-tighter">Campus <span className="text-blue-600">Connect</span></h2>
           <p className="text-slate-400 font-bold italic mt-3 text-sm tracking-widest uppercase">Peer-to-Peer Synchronization Hub</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm">
           <button onClick={() => setTab('faculty')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${tab === 'faculty' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50'}`}>Faculty Directory</button>
           <button onClick={() => setTab('community')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${tab === 'community' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50'}`}>Student Grid</button>
        </div>
      </div>

      <div className="relative max-w-xl">
         <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
         <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${tab} nodes...`} className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] font-bold text-sm outline-none focus:border-blue-500 transition-all shadow-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(tab === 'faculty' ? facultyList : studentList).filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase())).map((item: any) => (
          <div key={item.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:border-blue-200 transition-all hover:shadow-2xl">
             <div className="flex items-center gap-6 mb-8">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500 ${tab === 'faculty' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                   {item.name[0]}
                </div>
                <div>
                   <h4 className="text-xl font-black text-slate-900 leading-none uppercase tracking-tighter">{item.name}</h4>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{item.role || item.dept}</p>
                   {tab === 'faculty' && <p className="text-[9px] font-bold text-blue-600 uppercase mt-1">Room: {item.block}</p>}
                </div>
             </div>
             <div className="space-y-4 pt-8 border-t border-slate-50">
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl">Establish Direct Flow</button>
                <button className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">View Node Intel</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Module: Profile View ---
const ProfileView = ({ user, setUser, studentList, setStudentList }: any) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const saveProfile = () => {
    setUser(formData);
    setStudentList(studentList.map((s: any) => s.id === user.id ? { ...s, name: formData.name, dept: formData.department } : s));
    setEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
         <div className="h-48 academic-gradient relative">
            <div className="absolute inset-0 opacity-10"><div className="w-full h-full bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:30px_30px]" /></div>
         </div>
         <div className="px-12 pb-12 relative">
            <div className="flex justify-between items-end -translate-y-16">
               <div className="w-40 h-40 rounded-[3rem] bg-white border-[8px] border-white shadow-2xl flex items-center justify-center font-black text-5xl text-blue-600">
                  {formData.name[0]}
               </div>
               <button onClick={() => editing ? saveProfile() : setEditing(true)} className="mb-6 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                  {editing ? 'Commit Identity Sync' : 'Reconfigure Node'}
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
               <div className="space-y-8">
                  {editing ? (
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Master Identity Name</label>
                          <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all shadow-inner" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Assigned Department</label>
                          <input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all shadow-inner" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Public Bio Data</label>
                          <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-sm h-32 outline-none focus:border-blue-500 transition-all shadow-inner resize-none" />
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       <div>
                          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{formData.name}</h2>
                          <div className="flex items-center gap-3 mt-4">
                             <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100">{formData.department}</span>
                             <span className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-lg border border-slate-100">{formData.id}</span>
                          </div>
                       </div>
                       <p className="text-slate-500 font-medium italic text-lg leading-relaxed">{formData.bio || 'Awaiting synchronization...'}</p>
                       <div className="flex gap-3">
                          <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-all"><Github size={20}/></button>
                          <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-all"><Linkedin size={20}/></button>
                          <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-all"><LinkIcon size={20}/></button>
                       </div>
                    </div>
                  )}
               </div>
               
               <div className="space-y-8">
                  <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-6 shadow-inner">
                     <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3"><Laptop2 className="text-blue-600" size={24}/> Synced Skillset</h3>
                     <div className="flex flex-wrap gap-3">
                        {(formData.skills || []).map((s: string) => (
                          <span key={s} className="px-5 py-2.5 bg-white text-slate-600 text-[10px] font-black uppercase rounded-xl border border-slate-100 shadow-sm">{s}</span>
                        ))}
                        {editing && <button className="px-5 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-blue-500/20">+</button>}
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center group hover:border-orange-200 transition-all">
                        <Flame className="mx-auto text-orange-500 mb-3 group-hover:scale-110 transition-transform" size={32} fill="currentColor"/>
                        <p className="text-3xl font-black leading-none text-slate-900">{formData.streak}</p>
                        <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">Node Streak</p>
                     </div>
                     <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center group hover:border-blue-200 transition-all">
                        <Award className="mx-auto text-blue-500 mb-3 group-hover:scale-110 transition-transform" size={32} fill="currentColor"/>
                        <p className="text-3xl font-black leading-none text-slate-900">{formData.xp}</p>
                        <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">Total Energy</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- Sub-Module: Map View ---
// Fixed Redeclaration: Kept the primary MapView definition here.
const MapView = ({ buildings, facultyList }: any) => {
  const [selected, setSelected] = useState<any>(null);
  const buildingFaculty = useMemo(() => {
    if (!selected) return [];
    return facultyList.filter((f: any) => f.block === selected.name);
  }, [selected, facultyList]);

  return (
    <div className="h-[calc(100vh-160px)] bg-white rounded-[5rem] border border-slate-100 relative overflow-hidden shadow-sm animate-in fade-in duration-1000">
      <div className="absolute inset-0 bg-slate-50 overflow-hidden">
         <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563eb_1.5px,transparent_1.5px)] bg-[length:60px:60px]" />
            {buildings.map((b: any) => (
              <div key={b.id} className="absolute transition-all duration-700 z-10" style={{ top: b.mapCoords.top, left: b.mapCoords.left }}>
                <div onClick={() => setSelected(b)} className="group relative">
                   <div className={`w-14 h-14 ${b.color} rounded-full border-[6px] border-white shadow-3xl flex items-center justify-center text-white transition-all group-hover:scale-150 hover:z-50 cursor-pointer`}>
                      <MapPin size={26} fill="currentColor"/>
                   </div>
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 bg-white px-7 py-3.5 rounded-[1.8rem] shadow-4xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-[60] translate-y-3 group-hover:translate-y-0">
                      <p className="text-[13px] font-black uppercase tracking-tighter text-slate-900">{b.name}</p>
                   </div>
                </div>
              </div>
            ))}
         </div>
      </div>
      
      {selected && (
        <div className="absolute bottom-16 right-16 w-[480px] bg-white rounded-[5rem] border border-slate-100 shadow-4xl overflow-hidden animate-in slide-in-from-right-16 duration-700 z-[100]">
           <div className="h-64 relative group">
              <img src={selected.image} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" alt=""/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button onClick={() => setSelected(null)} className="absolute top-10 right-10 p-4 bg-white/20 backdrop-blur-md text-white rounded-3xl hover:bg-white/40 transition-all active:scale-90"><X size={24}/></button>
              <div className="absolute bottom-10 left-12">
                 <h4 className="text-4xl font-black leading-none uppercase tracking-tighter text-white">{selected.name}</h4>
              </div>
           </div>
           <div className="p-16 space-y-12 max-h-[600px] overflow-y-auto custom-scrollbar no-scrollbar">
              <div className="space-y-6">
                 <p className="text-slate-500 text-base font-medium leading-relaxed italic border-l-[6px] border-blue-500 pl-10">{selected.description}</p>
                 <div className="flex flex-wrap gap-3 mt-6">
                    {selected.departments.map((d: string) => (
                       <span key={d} className="px-6 py-3 bg-slate-50 text-slate-700 text-[10px] font-black uppercase rounded-[1.5rem] border border-slate-100">{d}</span>
                    ))}
                 </div>
              </div>

              <div className="space-y-8">
                 <h5 className="text-[12px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                    <BriefcaseIcon size={18}/> Active Faculty Nodes
                 </h5>
                 <div className="space-y-4">
                    {buildingFaculty.length > 0 ? buildingFaculty.map((f: any) => (
                       <div key={f.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-blue-100 transition-all cursor-pointer shadow-sm">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-2xl text-blue-600 shadow-sm transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white">{f.name[0]}</div>
                             <div>
                                <p className="text-lg font-black text-slate-900 leading-none uppercase tracking-tighter">{f.name}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase mt-2 tracking-widest">{f.role}</p>
                             </div>
                          </div>
                          <ChevronRight size={24} className="text-slate-300 group-hover:text-blue-600 transition-all duration-300 group-hover:translate-x-2" />
                       </div>
                    )) : <p className="text-sm text-slate-300 font-bold italic text-center py-8">No faculty nodes associated with this mesh block.</p>}
                 </div>
              </div>

              <button className="w-full py-8 bg-blue-600 text-white rounded-[3rem] font-black uppercase text-[12px] shadow-4xl shadow-blue-500/30 hover:scale-[1.03] transition-all tracking-widest active:scale-95">Establish Navigation Link</button>
           </div>
        </div>
      )}
      
      <div className="absolute top-16 left-16 w-[420px] z-50">
         <div className="bg-white/80 backdrop-blur-3xl p-10 rounded-[4rem] border-2 border-white shadow-4xl flex items-center gap-8 group hover:bg-white transition-all duration-500">
            <Search className="text-blue-600 group-hover:scale-125 transition-transform duration-500" size={32} />
            <input placeholder="Locate Campus Hub..." className="bg-transparent outline-none text-base font-black flex-1 uppercase tracking-tighter text-slate-900 placeholder-slate-400" />
         </div>
      </div>
    </div>
  );
};

// --- Sub-Module: Admin CRM ---
// Added missing component AdminCRMView
const AdminCRMView = ({ 
  studentList, facultyList, logo, setLogo 
}: any) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <h2 className="text-6xl font-black uppercase tracking-tighter">Master <span className="text-blue-600">Ledger</span></h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm">
           <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-4"><Settings2 className="text-blue-600" size={32}/> Branding</h3>
           <div className="space-y-6">
              <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-4">Node Shortname (Logo)</label>
              <input value={logo} onChange={e => setLogo(e.target.value)} className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none focus:border-blue-500 transition-all shadow-inner" />
           </div>
        </div>
        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm">
           <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-4"><Users2 className="text-blue-600" size={32}/> Node Statistics</h3>
           <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
                 <p className="text-4xl font-black text-slate-900">{studentList.length}</p>
                 <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">Students</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
                 <p className="text-4xl font-black text-slate-900">{facultyList.length}</p>
                 <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">Faculty</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Module: Faculty Dashboard ---
// Added missing component FacultyDashboard
const FacultyDashboard = ({ user }: { user: User }) => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <header>
        <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">Node <span className="text-blue-600">Terminal</span></h2>
        <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Operational status: <span className="text-emerald-500 font-black">FULLY SYNCED</span>. Welcome back, {user.name}.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm text-center">
          <Clock size={48} className="mx-auto text-blue-600 mb-8" />
          <p className="text-4xl font-black text-slate-900">09:00 AM</p>
          <p className="text-[11px] font-black uppercase text-slate-400 mt-3 tracking-widest">Next Sync Hub: CS101</p>
        </div>
        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm text-center">
          <FileText size={48} className="mx-auto text-emerald-600 mb-8" />
          <p className="text-4xl font-black text-slate-900">14</p>
          <p className="text-[11px] font-black uppercase text-slate-400 mt-3 tracking-widest">Pending Node Queries</p>
        </div>
        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm text-center">
          <MessageSquare size={48} className="mx-auto text-purple-600 mb-8" />
          <p className="text-4xl font-black text-slate-900">5</p>
          <p className="text-[11px] font-black uppercase text-slate-400 mt-3 tracking-widest">System Broadcasts</p>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Module: Edustone Hub ---
// Added missing component EdustoneHub
const EdustoneHub = ({ courses }: { courses: Course[] }) => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Edustone <span className="text-blue-600">Repository</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm group hover:border-blue-200 transition-all hover:shadow-2xl">
            <div className="w-20 h-20 bg-blue-50 rounded-[1.8rem] flex items-center justify-center font-black text-3xl text-blue-600 mb-10 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">{course.code[0]}</div>
            <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-tight">{course.name}</h4>
            <p className="text-[12px] font-black text-slate-400 uppercase mt-4 tracking-widest italic">{course.code} • {course.instructor}</p>
            <div className="flex gap-6 mt-10">
              <div className="flex-1 p-6 bg-slate-50 rounded-[1.8rem] text-center border border-slate-50 group-hover:bg-white group-hover:border-slate-100 transition-all">
                <p className="text-2xl font-black text-slate-900">{course.notesCount}</p>
                <p className="text-[9px] font-black uppercase text-slate-400 mt-1 tracking-widest">Intel Logs</p>
              </div>
              <div className="flex-1 p-6 bg-slate-50 rounded-[1.8rem] text-center border border-slate-50 group-hover:bg-white group-hover:border-slate-100 transition-all">
                <p className="text-2xl font-black text-slate-900">{course.lecturesCount}</p>
                <p className="text-[9px] font-black uppercase text-slate-400 mt-1 tracking-widest">Streams</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Sub-Module: Video Hub ---
// Added missing component VideoHub
const VideoHub = ({ mediaList }: { mediaList: VideoType[] }) => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Vertical <span className="text-blue-600">Streams</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {mediaList.map(video => (
          <div key={video.id} className="bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-3xl transition-all">
            <div className="aspect-[9/16] relative overflow-hidden bg-slate-200">
              <img src={video.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40"><Play size={32} fill="currentColor" /></div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-white text-[12px] font-black uppercase tracking-tight line-clamp-2 leading-relaxed drop-shadow-lg">{video.title}</h4>
              </div>
            </div>
            <div className="p-8 flex items-center justify-between border-t border-slate-50 bg-white">
              <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase">
                <Eye size={14}/> {video.views}
              </div>
              <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase">
                <Heart size={14} fill="currentColor"/> {video.likes}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Sub-Module: Careers View ---
// Added missing component CareersView
const CareersView = ({ jobs }: { jobs: Job[] }) => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Career <span className="text-blue-600">Mesh</span></h2>
      <div className="grid grid-cols-1 gap-8">
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-12 rounded-[4.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between group hover:border-blue-200 transition-all hover:shadow-2xl gap-8">
            <div className="flex items-center gap-10">
              <div className="w-20 h-20 bg-slate-50 rounded-[1.8rem] flex items-center justify-center font-black text-3xl text-blue-600 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">{job.company[0]}</div>
              <div>
                <h4 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">{job.title}</h4>
                <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mt-4 italic">{job.company} • {job.location}</p>
                <div className="flex flex-wrap gap-3 mt-6">
                  {job.tags.map(tag => (
                    <span key={tag} className="px-5 py-2 bg-slate-50 text-[10px] font-black uppercase text-slate-500 rounded-xl border border-slate-100">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:items-end gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-8 md:pt-0 md:pl-12">
               <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{job.salary}</p>
               <button className="px-14 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-widest hover:bg-black transition-all active:scale-95 shadow-2xl">Establish Flow</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Sub-Module: Sidebar Controller ---
const Sidebar = ({ activeTab, setActiveTab, user, onLogout, logo }: any) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(() => {
    if (user.role === UserRole.ADMIN) {
      return [
        { id: 'admin-dashboard', label: 'Command Desk', icon: <LayoutDashboard size={20} /> },
        { id: 'admin-crm', label: 'Master Ledger', icon: <Database size={20} /> },
        { id: 'navigation', label: 'Campus Mesh', icon: <MapIcon size={20} /> },
      ];
    }
    if (user.role === UserRole.FACULTY) {
      return [
        { id: 'faculty-dashboard', label: 'Node Desk', icon: <LayoutDashboard size={20} /> },
        { id: 'attendance', label: 'Roster Hub', icon: <ScanFace size={20} /> },
        { id: 'navigation', label: 'Campus Mesh', icon: <MapIcon size={20} /> },
        { id: 'profile', label: 'Terminal', icon: <UserIcon size={20} /> },
      ];
    }
    return NAV_ITEMS;
  }, [user.role]);

  return (
    <>
      <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden fixed top-8 left-8 z-[1000] p-5 bg-white rounded-[1.5rem] shadow-2xl text-blue-600 border border-slate-100 active:scale-95 transition-all">
        {mobileOpen ? <X size={28} /> : <LayoutDashboard size={28} />}
      </button>

      <aside className={`fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-100 z-[900] flex flex-col p-10 transition-transform duration-500 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-5 mb-16">
          <div className="w-12 h-12 bg-blue-600 rounded-[1.2rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20">
            {logo.length > 5 ? 'U' : logo}
          </div>
          <span className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">Unistone</span>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all group ${activeTab === item.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
            >
              <div className={`${activeTab === item.id ? 'text-white' : 'text-slate-300 group-hover:text-blue-500'}`}>{item.icon}</div>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-10 border-t border-slate-50 space-y-8">
          <div className="flex items-center gap-5 px-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 shadow-inner">
               <UserIcon size={24} />
            </div>
            <div className="overflow-hidden">
               <p className="text-[11px] font-black uppercase tracking-tighter truncate text-slate-900 leading-none">{user.name}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic opacity-60">{user.role}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-5 px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-50 transition-all shrink-0">
            <LogOut size={22} /> Disconnect
          </button>
        </div>
      </aside>
    </>
  );
};

// --- Main Hub Controller ---
export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('unistone-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [logo, setLogo] = useSyncedState('unistone-logo', 'U');
  const [buildings, setBuildings] = useSyncedState('unistone-buildings', MOCK_BUILDINGS);
  const [courses, setCourses] = useSyncedState('unistone-courses', MOCK_COURSES);
  const [facultyList, setFacultyList] = useSyncedState('unistone-faculty', [
    { id: 'f1', name: 'Dr. Alan Turing', role: 'Head of AI', block: 'Engineering Block', status: 'Active', bio: 'AI Visionary' },
    { id: 'f2', name: 'Prof. Feynman', role: 'Quantum Director', block: 'Science Block', status: 'Active', bio: 'Quantum Master' },
    { id: 'f3', name: 'Dr. Neha Gupta', role: 'HOD Pharmacy', block: 'Pharmacy Block', status: 'Active', bio: 'Pharma Specialist' }
  ]);
  const [mediaList, setMediaList] = useSyncedState('unistone-media', MOCK_VIDEOS);
  const [events, setEvents] = useSyncedState('unistone-events', MOCK_EVENTS);
  const [jobs, setJobs] = useSyncedState('unistone-jobs', MOCK_JOBS);
  const [studentList, setStudentList] = useSyncedState('unistone-students', [
    { id: 's1', name: 'Sarah Connor', dept: 'AI/ML Node', status: 'Active' },
    { id: 's2', name: 'John Doe', dept: 'Software Dev', status: 'Active' },
    { id: 's3', name: 'Alex Reed', dept: 'Design Mesh', status: 'Active' }
  ]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (user) localStorage.setItem('unistone-user', JSON.stringify(user));
    else localStorage.removeItem('unistone-user');
  }, [user]);

  useEffect(() => {
    onAttendanceStarted = (s) => { if (user?.role === UserRole.STUDENT) setSession(s); };
    return () => { onAttendanceStarted = null; };
  }, [user]);

  useEffect(() => {
    if (user) {
      if (user.role === UserRole.FACULTY) setActiveTab('faculty-dashboard');
      else if (user.role === UserRole.ADMIN) setActiveTab('admin-dashboard');
      else setActiveTab('dashboard');
    }
  }, [user]);

  if (!user) return <AuthView onLogin={setUser} logo={logo} />;

  const renderContent = () => {
    if (activeTab === 'navigation') return <MapView buildings={buildings} facultyList={facultyList} />;
    if (activeTab === 'profile') return <ProfileView user={user} setUser={setUser} studentList={studentList} setStudentList={setStudentList} />;
    if (activeTab === 'comms') return <ConnectHub facultyList={facultyList} studentList={studentList} />;

    if (user.role === UserRole.ADMIN) {
      if (activeTab === 'admin-crm') return <AdminCRMView mediaList={mediaList} setMediaList={setMediaList} buildings={buildings} setBuildings={setBuildings} courses={courses} setCourses={setCourses} facultyList={facultyList} setFacultyList={setFacultyList} studentList={studentList} setStudentList={setStudentList} events={events} setEvents={setEvents} jobs={jobs} setJobs={setJobs} logo={logo} setLogo={setLogo} />;
      if (activeTab === 'admin-dashboard') return (
        <div className="space-y-12 animate-in fade-in duration-500">
           <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                 <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">System <span className="text-blue-600">Master</span></h2>
                 <p className="text-slate-400 font-bold italic mt-4 uppercase tracking-widest text-sm">Central Node Control Protocol</p>
              </div>
              <button onClick={() => setActiveTab('admin-crm')} className="px-14 py-7 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-xs shadow-2xl flex items-center gap-5 hover:scale-105 transition-all active:scale-95"><Database size={32} className="text-blue-500"/> Master Hub Terminal</button>
           </header>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[ 
                 { l: 'Synced Hubs', v: studentList.length + facultyList.length, i: <Users className="text-blue-500" size={32}/> }, 
                 { l: 'Mesh Blocks', v: buildings.length, i: <MapPin className="text-emerald-500" size={32}/> }, 
                 { l: 'Intel Hub', v: mediaList.length, i: <Film className="text-red-500" size={32}/> }, 
                 { l: 'Event Ledger', v: events.length, i: <Calendar className="text-purple-500" size={32}/> } 
              ].map((s, i) => (
                <div key={i} className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 group">
                   <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-12 shadow-inner group-hover:bg-blue-50 group-hover:scale-110 transition-all">{s.i}</div>
                   <p className="text-7xl font-black tracking-tighter leading-none text-slate-900">{s.v}</p>
                   <p className="text-[12px] font-black uppercase text-slate-400 mt-5 tracking-widest">{s.l}</p>
                </div>
              ))}
           </div>
        </div>
      );
    }

    if (user.role === UserRole.FACULTY) {
      if (activeTab === 'faculty-dashboard') return <FacultyDashboard user={user} />;
      if (activeTab === 'attendance') return <FacultyAttendance user={user} />;
    }

    if (user.role === UserRole.STUDENT) {
      if (activeTab === 'dashboard') return (
        <div className="space-y-16 animate-in fade-in duration-500 pb-20">
           <header className="flex justify-between items-end">
              <div>
                 <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">Command <span className="text-blue-600">Feed</span></h2>
                 <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Welcome back, {user.name}. Your academic identity is fully synchronized with the campus mesh nodes.</p>
              </div>
              <div className="flex gap-8">
                 <div className="px-10 py-6 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all"><Flame className="text-orange-500" fill="currentColor" size={40}/><p className="text-4xl font-black leading-none">{user.streak}</p></div>
                 <div className="px-10 py-6 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all"><Award className="text-blue-500" fill="currentColor" size={40}/><p className="text-4xl font-black leading-none">{user.xp}</p></div>
              </div>
           </header>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-16">
                 <section className="bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-end mb-12">
                       <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4"><LayoutDashboard className="text-blue-600" size={32}/> Authorized Hubs</h3>
                       <button className="text-[12px] font-black text-blue-600 uppercase tracking-widest hover:underline" onClick={() => setActiveTab('edustone')}>Edustone Repository</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {courses.slice(0, 2).map((c: any) => (
                         <div key={c.id} className="p-12 bg-slate-50 rounded-[3.5rem] border border-slate-100 group hover:bg-white hover:border-blue-200 transition-all cursor-pointer shadow-sm hover:shadow-2xl">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center font-black text-3xl mb-10 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">{c.code[0]}</div>
                            <p className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tighter line-clamp-1">{c.name}</p>
                            <p className="text-[12px] font-bold text-slate-400 uppercase mt-4 tracking-widest italic">{c.instructor}</p>
                         </div>
                       ))}
                    </div>
                 </section>
                 <section className="space-y-10">
                    <div className="flex justify-between items-end">
                       <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4"><PlaySquare className="text-red-500" size={32}/> Mesh Reels</h3>
                       <button className="text-[12px] font-black text-blue-600 uppercase tracking-widest hover:underline" onClick={() => setActiveTab('videohub')}>Vertical Stream</button>
                    </div>
                    <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar snap-x">
                       {mediaList.filter((m: any) => m.type === 'short').map((v: any) => (
                         <div key={v.id} className="w-56 h-96 bg-slate-200 rounded-[3.5rem] overflow-hidden shrink-0 relative group shadow-2xl snap-start border-[6px] border-white">
                            <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt=""/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex flex-col justify-end p-8">
                               <p className="text-white text-[12px] font-black line-clamp-2 uppercase tracking-tight leading-relaxed">{v.title}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>
              </div>
              <div className="space-y-12">
                 <section className="bg-slate-900 p-14 rounded-[5rem] text-white relative overflow-hidden shadow-3xl">
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full translate-x-[-20%] translate-y-[20%]" />
                    <h3 className="text-3xl font-black uppercase mb-12 flex items-center gap-4 tracking-tighter"><Calendar className="text-blue-400" size={32}/> Campus Pulse</h3>
                    <div className="space-y-12">
                       {events.slice(0, 3).map((e: any) => (
                         <div key={e.id} className="flex gap-8 group cursor-pointer">
                            <div className="w-20 h-20 rounded-[1.8rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500">
                               <p className="text-[11px] font-black uppercase leading-none opacity-60">{e.date.split(' ')[0]}</p>
                               <p className="text-3xl font-black leading-none mt-2">{e.date.split(' ')[1].replace(',', '')}</p>
                            </div>
                            <div className="overflow-hidden flex flex-col justify-center">
                               <p className="text-lg font-black truncate uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors">{e.title}</p>
                               <p className="text-[12px] text-slate-500 truncate mt-3 tracking-widest uppercase font-bold">{e.location}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    <button className="w-full mt-16 py-7 bg-white/5 border border-white/10 rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95" onClick={() => setActiveTab('events')}>Establish Full Link</button>
                 </section>
              </div>
           </div>
        </div>
      );
      if (activeTab === 'edustone') return <EdustoneHub courses={courses} />;
      if (activeTab === 'videohub') return <VideoHub mediaList={mediaList} />;
      if (activeTab === 'careers') return <CareersView jobs={jobs} />;
      if (activeTab === 'events') return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-20">
          <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Event <span className="text-blue-600">Mesh</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {events.map((e: any) => (
              <div key={e.id} className="bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all hover:shadow-3xl">
                <div className="flex-1">
                   <p className="text-[12px] font-black text-blue-600 uppercase tracking-widest mb-3 leading-none">{e.date}</p>
                   <h4 className="text-4xl font-black leading-tight uppercase tracking-tighter mb-5 pr-6">{e.title}</h4>
                   <div className="flex items-center gap-4 text-slate-400 font-bold text-[12px] uppercase tracking-widest">
                      <MapPin size={20} className="text-blue-400"/> {e.location}
                   </div>
                   <div className="mt-10 flex items-center gap-5">
                      <span className="px-6 py-3 bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase rounded-[1.5rem] border border-emerald-100">{e.registeredCount || 0} Synced Nodes</span>
                   </div>
                </div>
                <button className="px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95">Establish Link</button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="p-32 text-center bg-white rounded-[5rem] border-2 border-dashed border-slate-200 animate-in zoom-in-95 duration-700">
         <Bot size={80} className="mx-auto text-blue-100 mb-10 animate-pulse" />
         <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Node Protocol Initialization</h3>
         <p className="text-slate-400 font-bold italic mt-4 uppercase tracking-widest text-sm">Optimizing subsystem mesh for: <span className="text-blue-600">"{activeTab}"</span></p>
         <button onClick={() => setActiveTab('dashboard')} className="mt-14 px-16 py-6 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-blue-500/30 hover:scale-105 transition-all active:scale-95">Establish Master Feed</button>
      </div>
    );
  };

  return (
    <div className="min-h-screen gradient-bg">
      {session && <AttendancePopup session={session} onMark={() => setSession(null)} />}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser(null)} logo={logo} />
      <main className="md:ml-72 p-6 md:p-14 h-screen flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar no-scrollbar scroll-smooth">{renderContent()}</div>
      </main>
      <AIAssistant />
    </div>
  );
}

// --- Module: AI Concierge ---
const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    const reply = await askUnistoneAI(msg);
    setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-12 right-12 z-[200]">
      {open ? (
        <div className="w-80 md:w-[460px] h-[650px] bg-white rounded-[4rem] shadow-4xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-700">
          <div className="p-12 bg-blue-600 text-white flex items-center justify-between shadow-2xl">
             <div className="flex items-center gap-6">
                <div className="p-5 bg-white/20 rounded-[1.8rem] backdrop-blur-md border border-white/20 shadow-xl"><Bot size={40} className="animate-bounce-slow"/></div>
                <div><p className="font-black uppercase text-base leading-none tracking-tighter">Unistone AI</p><p className="text-[11px] font-black uppercase opacity-60 mt-2 tracking-widest">Global Mesh Concierge</p></div>
             </div>
             <button onClick={() => setOpen(false)} className="p-4 hover:bg-white/10 rounded-3xl transition-all active:scale-90"><X size={28}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-12 space-y-10 bg-slate-50 custom-scrollbar">
            {messages.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-8 py-12">
                  <Bot size={64} className="mb-8" />
                  <p className="text-[12px] font-black uppercase tracking-widest leading-relaxed">Central Hub Synchronized. Awaiting academic node query or system protocol request.</p>
               </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3`}>
                 <div className={`max-w-[90%] p-8 rounded-[3rem] text-sm font-bold leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="flex gap-3 p-4"><div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"/><div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"/><div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"/></div>}
          </div>
          <div className="p-10 bg-white border-t border-slate-100 flex gap-5 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
             <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="System query node..." className="flex-1 px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-sm font-black outline-none focus:border-blue-500 transition-all uppercase tracking-widest text-slate-700" />
             <button onClick={send} className="p-6 bg-blue-600 text-white rounded-[2rem] shadow-3xl hover:scale-110 active:scale-90 transition-all shadow-blue-500/30 flex items-center justify-center"><Send size={28}/></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="w-28 h-28 bg-blue-600 text-white rounded-[3rem] shadow-4xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all group border-[10px] border-white relative">
           <div className="absolute inset-[-6px] rounded-[3.2rem] border-4 border-blue-600/20 animate-ping opacity-20" />
           <Bot size={48} className="group-hover:rotate-12 transition-transform duration-500"/>
        </button>
      )}
    </div>
  );
};

// --- Sub-Module: Attendance Controller ---
const FacultyAttendance = ({ user }: { user: User }) => {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => { 
    if (active) { 
      const i = setInterval(() => setCount(v => Math.min(v + 1, 45)), 800); 
      return () => clearInterval(i); 
    } 
  }, [active]);

  const startHub = () => {
     setActive(true);
     globalAttendanceSession = { active: true, instructor: user.name };
     if (onAttendanceStarted) onAttendanceStarted(globalAttendanceSession);
  };

  return (
    <div className="max-w-3xl mx-auto py-16 space-y-20 animate-in fade-in duration-1000">
      <div className="text-center space-y-5">
         <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">Smart <span className="text-blue-600">Roster Hub</span></h2>
         <p className="text-slate-400 font-bold italic text-base uppercase tracking-widest">Synchronizing student nodes with master ledger.</p>
      </div>
      <div className="bg-white p-24 rounded-[6rem] border border-slate-100 shadow-4xl flex flex-col items-center gap-16 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full translate-x-1/2 translate-y-[-1/2]" />
         <div className={`w-48 h-48 rounded-[4rem] flex items-center justify-center shadow-2xl relative z-10 transition-all duration-1000 ${active ? 'bg-emerald-50 text-emerald-600 animate-pulse' : 'bg-blue-50 text-blue-600 shadow-inner'}`}>
            <ScanFace size={100} className={active ? 'scale-110' : ''}/>
         </div>
         {active ? ( 
            <div className="w-full space-y-12 relative z-10 animate-in slide-in-from-bottom-10 duration-1000">
               <div className="flex justify-between items-end">
                  <p className="text-[14px] font-black uppercase text-slate-400 tracking-widest">Nodes Identified</p>
                  <p className="text-9xl font-black text-emerald-600 leading-none tracking-tighter">{count}<span className="text-4xl text-slate-200">/45</span></p>
               </div>
               <div className="h-10 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner p-1.5">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_30px_rgba(16,185,129,0.6)]" style={{width: `${(count/45)*100}%`}}/>
               </div>
               <div className="flex gap-6 pt-10">
                  <button onClick={() => setActive(false)} className="flex-1 py-8 bg-slate-900 text-white rounded-[3rem] font-black uppercase text-[12px] tracking-widest shadow-4xl hover:bg-black transition-all active:scale-95">Secure Protocol & Sync</button>
                  <button className="px-12 py-8 bg-slate-50 text-slate-400 rounded-[3rem] font-black uppercase text-[12px] hover:text-blue-600 transition-all active:scale-90 shadow-sm"><RefreshCw size={32}/></button>
               </div>
            </div> 
         ) : ( 
            <button onClick={startHub} className="w-full py-10 bg-blue-600 text-white rounded-[3.5rem] font-black uppercase text-sm shadow-4xl shadow-blue-500/30 hover:scale-[1.05] transition-all tracking-widest relative z-10 flex items-center justify-center gap-6 active:scale-95">
               <Compass size={36} className="animate-spin-slow" /> Initialize Master Broadcast
            </button> 
         )}
      </div>
    </div>
  );
};

const AttendancePopup = ({ session, onMark }: { session: any, onMark: () => void }) => {
  const [marked, setMarked] = useState(false);
  const mark = () => {
    setMarked(true);
    setTimeout(onMark, 2000);
  };
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-4rem)] max-w-2xl animate-in slide-in-from-top-32 duration-1000">
      <div className="bg-white rounded-[5rem] shadow-5xl border-[8px] border-blue-50 p-16 flex flex-col items-center text-center space-y-14">
        <div className={`w-40 h-40 rounded-[3.5rem] flex items-center justify-center animate-bounce duration-1000 ${marked ? 'bg-emerald-50 text-emerald-600 shadow-4xl shadow-emerald-500/20' : 'bg-blue-50 text-blue-600 shadow-4xl shadow-blue-500/20'}`}>
          {marked ? <CheckCircle size={80} /> : <AlertCircle size={80} />}
        </div>
        <div className="space-y-6">
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{marked ? 'Identity Synced!' : 'Master Node Detected!'}</h3>
          <p className="text-slate-500 font-medium text-xl mt-6 tracking-tight leading-relaxed px-6">{marked ? 'Your academic node is now globally synchronized with the university central ledger.' : `Authorized broadcast hub detected: Prof. ${session.instructor}. Do you wish to synchronize your identity?`}</p>
        </div>
        {!marked && (
           <button onClick={mark} className="w-full py-10 bg-blue-600 text-white font-black rounded-[3.5rem] shadow-4xl shadow-blue-500/30 flex items-center justify-center gap-6 hover:scale-105 transition-all uppercase tracking-widest text-[14px] active:scale-95">
              <ScanFace size={36} /> Establish Connection Link
           </button>
        )}
      </div>
    </div>
  );
};
