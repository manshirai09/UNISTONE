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
  Eye, ThumbsUp, ChevronDown, Check, Briefcase as JobIcon, MessageSquare as ChatIcon, Laptop2, Link as LinkIcon, FlaskConical, GraduationCap as GradIcon
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

// --- Mock Gallery for CRM ---
const PRESET_GALLERY = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1587854692152-cbe660feac88?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1498243639359-2818a77e8017?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop',
];

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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F0E68C]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8B0000]/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className={`md:w-1/2 p-12 text-white flex flex-col justify-between transition-all duration-700 ${isAdminPortal ? 'bg-slate-900' : 'academic-gradient'}`}>
          <div>
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl overflow-hidden border-2 border-slate-100/20">
              {logo.length > 5 ? <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" /> : <span className={`font-black italic text-3xl ${isAdminPortal ? 'text-slate-900' : 'text-[#8B0000]'}`}>{logo}</span>}
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase">UNISTONE</h1>
            <p className="text-[#F0E68C] text-lg font-medium leading-relaxed opacity-90 tracking-tight">Synchronized Smart Campus OS</p>
          </div>
          <div className="p-5 bg-white/10 rounded-[1.5rem] backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-center">
             Verified System Node
          </div>
        </div>
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white relative">
          <button onClick={() => setIsAdminPortal(!isAdminPortal)} className="absolute top-10 right-10 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-[#8B0000] transition-all">
            {isAdminPortal ? 'Student Hub' : 'Admin Control'}
          </button>
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 uppercase">Connect Node</h2>
            <p className="text-slate-500 font-medium italic">Synchronizing academic identity...</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isAdminPortal && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button type="button" onClick={() => setRole(UserRole.STUDENT)} className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${role === UserRole.STUDENT ? 'bg-[#8B0000] border-[#8B0000] text-white shadow-xl scale-105' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <GraduationCap size={24} /><span className="text-[10px] font-black uppercase tracking-widest">Student</span>
                </button>
                <button type="button" onClick={() => setRole(UserRole.FACULTY)} className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${role === UserRole.FACULTY ? 'bg-[#8B0000] border-[#8B0000] text-white shadow-xl scale-105' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <BriefcaseIcon size={24} /><span className="text-[10px] font-black uppercase tracking-widest">Faculty</span>
                </button>
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="email" type="email" required placeholder="University ID / Email" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#8B0000] text-sm font-bold transition-all shadow-inner" />
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="password" type="password" required placeholder="Security Credential" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#8B0000] text-sm font-bold transition-all shadow-inner" />
            </div>
            <button disabled={loading} className={`w-full py-5 text-white font-black rounded-2xl shadow-2xl transition-all uppercase text-[11px] tracking-widest mt-6 ${isAdminPortal ? 'bg-slate-900 shadow-slate-900/20' : 'bg-[#8B0000] shadow-[#8B0000]/20 active:scale-95 hover:bg-[#a50000]'}`}>
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
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
           <h2 className="text-5xl font-black uppercase leading-none tracking-tighter">Campus <span className="text-[#8B0000]">Connect</span></h2>
           <p className="text-slate-400 font-bold italic mt-3 text-sm tracking-widest uppercase">Peer-to-Peer Synchronization Hub</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm">
           <button onClick={() => setTab('faculty')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${tab === 'faculty' ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/20' : 'text-slate-400 hover:bg-slate-50'}`}>Faculty Directory</button>
           <button onClick={() => setTab('community')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${tab === 'community' ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/20' : 'text-slate-400 hover:bg-slate-50'}`}>Student Grid</button>
        </div>
      </div>

      <div className="relative max-w-xl">
         <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
         <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${tab} nodes...`} className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] font-bold text-sm outline-none focus:border-[#8B0000] transition-all shadow-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(tab === 'faculty' ? facultyList : studentList).filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase())).map((item: any) => (
          <div 
            key={item.id} 
            onClick={() => tab === 'faculty' && setSelectedFaculty(item)}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:border-[#F0E68C] transition-all hover:shadow-2xl cursor-pointer"
          >
             <div className="flex items-center gap-6 mb-8">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500 ${tab === 'faculty' ? 'bg-[#8B0000]/5 text-[#8B0000]' : 'bg-[#F0E68C]/10 text-[#8B0000]'}`}>
                   {item.name[0]}
                </div>
                <div>
                   <h4 className="text-xl font-black text-slate-900 leading-none uppercase tracking-tighter">{item.name}</h4>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{item.role || item.dept}</p>
                   {tab === 'faculty' && <p className="text-[9px] font-bold text-[#8B0000] uppercase mt-1">Room: {item.block}</p>}
                </div>
             </div>
             <div className="space-y-4 pt-8 border-t border-slate-50">
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl">Establish Direct Flow</button>
                <button className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">View Node Intel</button>
             </div>
          </div>
        ))}
      </div>

      {/* Faculty Profile Modal Overlay */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-2xl rounded-[5rem] overflow-hidden shadow-5xl border-[8px] border-[#F0E68C]/20 animate-in zoom-in-95 duration-500">
              <div className="h-48 academic-gradient relative">
                 <button onClick={() => setSelectedFaculty(null)} className="absolute top-10 right-10 p-4 bg-white/20 backdrop-blur-md text-white rounded-3xl hover:bg-white/40 transition-all"><X size={24}/></button>
                 <div className="absolute -bottom-16 left-16">
                    <div className="w-40 h-40 rounded-[3.5rem] bg-white border-[8px] border-white shadow-3xl flex items-center justify-center font-black text-6xl text-[#8B0000] uppercase">
                       {selectedFaculty.name[0]}
                    </div>
                 </div>
              </div>
              <div className="p-20 pt-24 space-y-12 max-h-[70vh] overflow-y-auto custom-scrollbar no-scrollbar">
                 <div className="space-y-4">
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{selectedFaculty.name}</h3>
                    <p className="text-xl font-bold text-[#8B0000] uppercase tracking-widest">{selectedFaculty.role} • {selectedFaculty.block}</p>
                    <p className="text-slate-500 font-medium italic text-lg leading-relaxed">{selectedFaculty.bio}</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><FlaskConical size={18} className="text-purple-500"/> Research Interests</h4>
                       <ul className="space-y-3">
                          {(selectedFaculty.interests || ['Neural Networks', 'Cyber-Physical Systems', 'Edge AI']).map((interest: string) => (
                             <li key={interest} className="px-6 py-3 bg-slate-50 rounded-2xl text-slate-700 text-[11px] font-black uppercase border border-slate-100">{interest}</li>
                          ))}
                       </ul>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><GradIcon size={18} className="text-[#8B0000]"/> Active Courses</h4>
                       <ul className="space-y-3">
                          {(selectedFaculty.courses || ['CS301: Algorithms', 'AI202: Machine Learning']).map((course: string) => (
                             <li key={course} className="px-6 py-3 bg-slate-50 rounded-2xl text-slate-700 text-[11px] font-black uppercase border border-slate-100">{course}</li>
                          ))}
                       </ul>
                    </div>
                 </div>

                 <div className="space-y-8 pt-10 border-t border-slate-50">
                    <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Communication Hub</h4>
                    <div className="flex flex-wrap gap-4">
                       <button className="flex-1 min-w-[200px] py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-[11px] flex items-center justify-center gap-4 hover:bg-black transition-all active:scale-95 shadow-2xl">
                          <Mail size={20}/> direct.node@unistone.edu
                       </button>
                       <button className="p-6 bg-[#8B0000]/5 text-[#8B0000] rounded-[2.5rem] hover:bg-[#8B0000]/10 transition-all">
                          <Linkedin size={24}/>
                       </button>
                       <button className="p-6 bg-[#8B0000]/5 text-[#8B0000] rounded-[2.5rem] hover:bg-[#8B0000]/10 transition-all">
                          <Github size={24}/>
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
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
            <div className="absolute inset-0 opacity-10"><div className="w-full h-full bg-[radial-gradient(circle,#F0E68C_1px,transparent_1px)] bg-[length:30px_30px]" /></div>
         </div>
         <div className="px-12 pb-12 relative">
            <div className="flex justify-between items-end -translate-y-16">
               <div className="w-40 h-40 rounded-[3rem] bg-white border-[8px] border-white shadow-2xl flex items-center justify-center font-black text-5xl text-[#8B0000]">
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
                          <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-[#8B0000] transition-all shadow-inner" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Assigned Department</label>
                          <input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-[#8B0000] transition-all shadow-inner" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Public Bio Data</label>
                          <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-sm h-32 outline-none focus:border-[#8B0000] transition-all shadow-inner resize-none" />
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       <div>
                          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{formData.name}</h2>
                          <div className="flex items-center gap-3 mt-4">
                             <span className="px-4 py-1.5 bg-[#F0E68C]/20 text-[#8B0000] text-[10px] font-black uppercase rounded-lg border border-[#F0E68C]/40">{formData.department}</span>
                             <span className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-lg border border-slate-100">{formData.id}</span>
                          </div>
                       </div>
                       <p className="text-slate-500 font-medium italic text-lg leading-relaxed">{formData.bio || 'Awaiting synchronization...'}</p>
                       <div className="flex gap-3">
                          <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-[#8B0000] transition-all"><Github size={20}/></button>
                          <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-[#8B0000] transition-all"><Linkedin size={20}/></button>
                          <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-[#8B0000] transition-all"><LinkIcon size={20}/></button>
                       </div>
                    </div>
                  )}
               </div>
               
               <div className="space-y-8">
                  <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-6 shadow-inner">
                     <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3"><Laptop2 className="text-[#8B0000]" size={24}/> Synced Skillset</h3>
                     <div className="flex flex-wrap gap-3">
                        {(formData.skills || []).map((s: string) => (
                          <span key={s} className="px-5 py-2.5 bg-white text-slate-600 text-[10px] font-black uppercase rounded-xl border border-slate-100 shadow-sm">{s}</span>
                        ))}
                        {editing && <button className="px-5 py-2.5 bg-[#8B0000] text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-[#8B0000]/20">+</button>}
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center group hover:border-[#F0E68C] transition-all">
                        <Flame className="mx-auto text-orange-500 mb-3 group-hover:scale-110 transition-transform" size={32} fill="currentColor"/>
                        <p className="text-3xl font-black leading-none text-slate-900">{formData.streak}</p>
                        <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">Node Streak</p>
                     </div>
                     <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center group hover:border-[#F0E68C] transition-all">
                        <Award className="mx-auto text-[#8B0000] mb-3 group-hover:scale-110 transition-transform" size={32} fill="currentColor"/>
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
const MapView = ({ buildings, facultyList }: any) => {
  const [selected, setSelected] = useState<any>(null);
  const [activeFaculty, setActiveFaculty] = useState<any>(null);

  const buildingFaculty = useMemo(() => {
    if (!selected) return [];
    return facultyList.filter((f: any) => f.block && (f.block.includes(selected.id) || selected.name.includes(f.block)));
  }, [selected, facultyList]);

  return (
    <div className="h-[calc(100vh-160px)] bg-white rounded-[5rem] border border-slate-100 relative overflow-hidden shadow-sm animate-in fade-in duration-1000">
      <div className="absolute inset-0 bg-white overflow-hidden">
         <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8B0000_1.5px,transparent_1.5px)] bg-[length:60px:60px]" />
            {buildings.map((b: any) => (
              <div key={b.id} className={`absolute transition-all duration-700 ${selected?.id === b.id ? 'z-[100]' : 'z-10'}`} style={{ top: b.mapCoords.top, left: b.mapCoords.left }}>
                <div onClick={() => setSelected(b)} className="group relative">
                   <div className={`w-14 h-14 ${b.color.includes('blue') ? 'bg-[#8B0000]' : b.color} rounded-full border-[6px] border-white shadow-3xl flex items-center justify-center text-white transition-all group-hover:scale-150 hover:z-50 cursor-pointer 
                     ${selected?.id === b.id ? 'ring-[12px] ring-[#8B0000]/30 scale-125 selected-pin-pulse border-[#8B0000] shadow-[0_0_40px_rgba(139,0,0,0.4)]' : ''}`}>
                      <MapPin size={26} fill="currentColor"/>
                   </div>
                   <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-6 bg-white px-7 py-3.5 rounded-[1.8rem] shadow-4xl border border-slate-100 transition-all pointer-events-none whitespace-nowrap z-[60] 
                     ${selected?.id === b.id ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0'}`}>
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
                 <p className="text-slate-500 text-base font-medium leading-relaxed italic border-l-[6px] border-[#8B0000] pl-10">{selected.description}</p>
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
                       <div key={f.id} onClick={() => setActiveFaculty(f)} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-[#F0E68C] transition-all cursor-pointer shadow-sm">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-2xl text-[#8B0000] shadow-sm transition-all duration-500 group-hover:bg-[#8B0000] group-hover:text-white">{f.name[0]}</div>
                             <div>
                                <p className="text-lg font-black text-slate-900 leading-none uppercase tracking-tighter">{f.name}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase mt-2 tracking-widest">{f.role}</p>
                             </div>
                          </div>
                          <ChevronRight size={24} className="text-slate-300 group-hover:text-[#8B0000] transition-all duration-300 group-hover:translate-x-2" />
                       </div>
                    )) : <p className="text-sm text-slate-300 font-bold italic text-center py-8">No faculty nodes associated with this mesh block.</p>}
                 </div>
              </div>

              <button className="w-full py-8 bg-[#8B0000] text-white rounded-[3rem] font-black uppercase text-[12px] shadow-4xl shadow-[#8B0000]/30 hover:scale-[1.03] transition-all tracking-widest active:scale-95">Establish Navigation Link</button>
           </div>
        </div>
      )}

      {/* Faculty Profile Modal Overlay */}
      {activeFaculty && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-2xl rounded-[5rem] overflow-hidden shadow-5xl border-[8px] border-[#F0E68C]/20 animate-in zoom-in-95 duration-500">
              <div className="h-48 academic-gradient relative">
                 <button onClick={() => setActiveFaculty(null)} className="absolute top-10 right-10 p-4 bg-white/20 backdrop-blur-md text-white rounded-3xl hover:bg-white/40 transition-all"><X size={24}/></button>
                 <div className="absolute -bottom-16 left-16">
                    <div className="w-40 h-40 rounded-[3.5rem] bg-white border-[8px] border-white shadow-3xl flex items-center justify-center font-black text-6xl text-[#8B0000] uppercase">
                       {activeFaculty.name[0]}
                    </div>
                 </div>
              </div>
              <div className="p-20 pt-24 space-y-12 max-h-[70vh] overflow-y-auto custom-scrollbar no-scrollbar">
                 <div className="space-y-4">
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{activeFaculty.name}</h3>
                    <p className="text-xl font-bold text-[#8B0000] uppercase tracking-widest">{activeFaculty.role} • {activeFaculty.block}</p>
                    <p className="text-slate-500 font-medium italic text-lg leading-relaxed">{activeFaculty.bio}</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><FlaskConical size={18} className="text-purple-500"/> Research Interests</h4>
                       <ul className="space-y-3">
                          {(activeFaculty.interests || ['Neural Networks', 'Cyber-Physical Systems', 'Edge AI']).map((interest: string) => (
                             <li key={interest} className="px-6 py-3 bg-slate-50 rounded-2xl text-slate-700 text-[11px] font-black uppercase border border-slate-100">{interest}</li>
                          ))}
                       </ul>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><GradIcon size={18} className="text-[#8B0000]"/> Active Courses</h4>
                       <ul className="space-y-3">
                          {(activeFaculty.courses || ['CS301: Algorithms', 'AI202: Machine Learning']).map((course: string) => (
                             <li key={course} className="px-6 py-3 bg-slate-50 rounded-2xl text-slate-700 text-[11px] font-black uppercase border border-slate-100">{course}</li>
                          ))}
                       </ul>
                    </div>
                 </div>

                 <div className="space-y-8 pt-10 border-t border-slate-50">
                    <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Communication Hub</h4>
                    <div className="flex flex-wrap gap-4">
                       <button className="flex-1 min-w-[200px] py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-[11px] flex items-center justify-center gap-4 hover:bg-black transition-all active:scale-95 shadow-2xl">
                          <Mail size={20}/> direct.node@unistone.edu
                       </button>
                       <button className="p-6 bg-[#8B0000]/5 text-[#8B0000] rounded-[2.5rem] hover:bg-[#8B0000]/10 transition-all">
                          <Linkedin size={24}/>
                       </button>
                       <button className="p-6 bg-[#8B0000]/5 text-[#8B0000] rounded-[2.5rem] hover:bg-[#8B0000]/10 transition-all">
                          <Github size={24}/>
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
      
      <div className="absolute top-16 left-16 w-[420px] z-50">
         <div className="bg-white/80 backdrop-blur-3xl p-10 rounded-[4rem] border-2 border-white shadow-4xl flex items-center gap-8 group hover:bg-white transition-all duration-500">
            <Search className="text-[#8B0000] group-hover:scale-125 transition-transform duration-500" size={32} />
            <input placeholder="Locate Campus Hub..." className="bg-transparent outline-none text-base font-black flex-1 uppercase tracking-tighter text-slate-900 placeholder-slate-400" />
         </div>
      </div>
    </div>
  );
};

// --- Sub-Module: Admin CRM Hub ---
const AdminCRMView = ({ 
  studentList, setStudentList,
  facultyList, setFacultyList,
  buildings, setBuildings,
  courses, setCourses,
  events, setEvents,
  jobs, setJobs,
  mediaList, setMediaList,
  logo, setLogo 
}: any) => {
  const [activeTab, setActiveTab] = useState<'nodes' | 'blocks' | 'academic' | 'comms' | 'system'>('nodes');
  const [editingItem, setEditingItem] = useState<any>(null);

  const saveItem = (list: any[], setList: Function) => {
    setList(list.map(i => i.id === editingItem.id ? editingItem : i));
    setEditingItem(null);
  };

  const deleteItem = (id: string, list: any[], setList: Function) => {
    setList(list.filter(i => i.id !== id));
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'nodes':
        return (
          <div className="space-y-12 animate-in fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3"><Users className="text-[#8B0000]"/> Student Ledger</h3>
                      <button className="p-3 bg-[#8B0000]/5 text-[#8B0000] rounded-xl hover:bg-[#8B0000] hover:text-white transition-all"><Plus size={18}/></button>
                   </div>
                   <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                      {studentList.map((s: any) => (
                        <div key={s.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                           <div className="overflow-hidden"><p className="text-sm font-black truncate uppercase tracking-tight">{s.name}</p><p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{s.dept}</p></div>
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => setEditingItem({...s, _type: 'student'})} className="p-2 text-[#8B0000]/60 hover:text-[#8B0000]"><Edit3 size={16}/></button>
                              <button onClick={() => deleteItem(s.id, studentList, setStudentList)} className="p-2 text-red-300 hover:text-red-500"><Trash2 size={16}/></button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3"><BriefcaseIcon className="text-[#8B0000]"/> Faculty Ledger</h3>
                      <button className="p-3 bg-[#8B0000]/5 text-[#8B0000] rounded-xl hover:bg-[#8B0000] hover:text-white transition-all"><Plus size={18}/></button>
                   </div>
                   <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                      {facultyList.map((f: any) => (
                        <div key={f.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                           <div className="overflow-hidden"><p className="text-sm font-black truncate uppercase tracking-tight">{f.name}</p><p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{f.role}</p></div>
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => setEditingItem({...f, _type: 'faculty'})} className="p-2 text-[#8B0000]/60 hover:text-[#8B0000]"><Edit3 size={16}/></button>
                              <button onClick={() => deleteItem(f.id, facultyList, setFacultyList)} className="p-2 text-red-300 hover:text-red-500"><Trash2 size={16}/></button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        );
      case 'academic':
        return (
          <div className="space-y-12 animate-in fade-in">
             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4"><BookOpen className="text-purple-600" size={28}/> Edustone Hubs</h3>
                   <button className="px-8 py-4 bg-[#8B0000] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Deploy New Hub</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {courses.map((c: any) => (
                     <div key={c.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white transition-all">
                        <div><p className="text-sm font-black uppercase tracking-tighter leading-none">{c.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-2">{c.code}</p></div>
                        <div className="flex gap-2">
                           <button onClick={() => setEditingItem({...c, _type: 'course'})} className="p-2 text-[#8B0000]/60 hover:text-[#8B0000]"><Edit3 size={16}/></button>
                           <button onClick={() => deleteItem(c.id, courses, setCourses)} className="p-2 text-red-300 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4"><Film className="text-red-600" size={28}/> Media Repository</h3>
                   <button className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Establish Flow</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                   {mediaList.map((m: any) => (
                     <div key={m.id} className="bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden group relative">
                        <div className="h-32 bg-slate-200"><img src={m.thumbnailUrl} className="w-full h-full object-cover" /></div>
                        <div className="p-4 flex justify-between items-center">
                           <p className="text-[10px] font-black truncate uppercase tracking-tight max-w-[100px]">{m.title}</p>
                           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => setEditingItem({...m, _type: 'media'})} className="p-2 text-[#8B0000]/60 hover:text-[#8B0000]"><Edit3 size={14}/></button>
                              <button onClick={() => deleteItem(m.id, mediaList, setMediaList)} className="p-2 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        );
      case 'blocks':
        return (
          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm animate-in fade-in">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4"><MapPin className="text-orange-600" size={28}/> Infrastructure Mesh</h3>
                <button className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Add Node Block</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {buildings.map((b: any) => (
                  <div key={b.id} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-between group hover:bg-white transition-all shadow-sm">
                     <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 ${b.color.includes('blue') ? 'bg-[#8B0000]' : b.color} rounded-2xl shadow-inner`} />
                        <div><p className="text-base font-black uppercase tracking-tight leading-none">{b.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Mesh Node Status: OK</p></div>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => setEditingItem({...b, _type: 'building'})} className="p-2 text-[#8B0000]/60 hover:text-[#8B0000]"><Edit3 size={18}/></button>
                        <button onClick={() => deleteItem(b.id, buildings, setBuildings)} className="p-2 text-red-300 hover:text-red-500"><Trash2 size={18}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'comms':
        return (
          <div className="space-y-12 animate-in fade-in">
             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4"><Calendar className="text-[#8B0000]" size={28}/> System Events</h3>
                   <button className="px-8 py-4 bg-[#8B0000] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Deploy Sync</button>
                </div>
                <div className="space-y-4">
                   {events.map((e: any) => (
                     <div key={e.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white transition-all">
                        <div className="overflow-hidden flex items-center gap-8">
                           <p className="text-sm font-black uppercase tracking-tighter leading-none w-32">{e.date}</p>
                           <div><p className="text-sm font-black uppercase tracking-tight leading-none">{e.title}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-1 italic">{e.location}</p></div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => setEditingItem({...e, _type: 'event'})} className="p-3 text-[#8B0000]/60 hover:text-[#8B0000] bg-white rounded-xl shadow-sm"><Edit3 size={18}/></button>
                           <button onClick={() => deleteItem(e.id, events, setEvents)} className="p-3 text-red-300 hover:text-red-500 bg-white rounded-xl shadow-sm"><Trash2 size={18}/></button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4"><JobIcon className="text-emerald-600" size={28}/> Career Mesh</h3>
                   <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Publish Protocol</button>
                </div>
                <div className="space-y-4">
                   {jobs.map((j: any) => (
                     <div key={j.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white transition-all">
                        <div className="flex items-center gap-8">
                           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-xl text-emerald-600 shadow-sm">{j.company[0]}</div>
                           <div><p className="text-sm font-black uppercase tracking-tight leading-none">{j.title}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{j.company} • {j.salary}</p></div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => setEditingItem({...j, _type: 'job'})} className="p-3 text-[#8B0000]/60 hover:text-[#8B0000] bg-white rounded-xl shadow-sm"><Edit3 size={18}/></button>
                           <button onClick={() => deleteItem(j.id, jobs, setJobs)} className="p-3 text-red-300 hover:text-red-500 bg-white rounded-xl shadow-sm"><Trash2 size={18}/></button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        );
      case 'system':
        return (
          <div className="max-w-xl bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-sm space-y-10 animate-in zoom-in-95">
             <h3 className="text-3xl font-black flex items-center gap-5 uppercase tracking-tighter leading-none"><Palette className="text-[#8B0000]" size={32}/> Brand Console</h3>
             <div className="space-y-5">
                <label className="text-[12px] font-black text-slate-400 uppercase ml-4 tracking-widest">Master Identity shortname (Logo)</label>
                <div className="flex gap-6">
                   <input value={logo} onChange={e => setLogo(e.target.value)} className="flex-1 px-8 py-6 bg-slate-50 border border-slate-100 rounded-3xl font-black outline-none focus:border-[#8B0000] transition-all uppercase tracking-widest text-slate-700 shadow-inner" placeholder="e.g. U or IMG URL" />
                   <div className="w-20 h-20 bg-white rounded-[1.8rem] flex items-center justify-center shadow-2xl overflow-hidden border border-slate-100">
                     {logo.length > 5 ? <img src={logo} className="w-full h-full object-contain p-2" /> : <span className="text-[#8B0000] font-black text-3xl">{logo}</span>}
                   </div>
                </div>
                <p className="text-[11px] font-bold text-slate-400 italic px-4">Instant Global Synchronization protocol active.</p>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div>
           <h2 className="text-7xl font-black uppercase leading-none tracking-tighter">Master <span className="text-[#8B0000]">Hub</span></h2>
           <p className="text-slate-400 font-bold italic mt-5 text-xl tracking-widest uppercase">Platform Synchronization Protocol</p>
        </div>
        <div className="flex gap-3 bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-x-auto no-scrollbar scroll-smooth">
           {([
             {id: 'nodes', l: 'Identity Ledger', i: <Users2 size={16}/>},
             {id: 'academic', l: 'Intel Hub', i: <BookOpen size={16}/>},
             {id: 'blocks', l: 'Infrastructure', i: <MapPin size={16}/>},
             {id: 'comms', l: 'Linkages', i: <LinkIcon size={16}/>},
             {id: 'system', l: 'Brand Node', i: <Settings2 size={16}/>}
           ] as const).map(tab => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-3 ${activeTab === tab.id ? 'bg-[#8B0000] text-white shadow-2xl shadow-[#8B0000]/30 active:scale-95' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
                {tab.i} {tab.l}
             </button>
           ))}
        </div>
      </header>

      <div className="pt-8">{renderTab()}</div>

      {editingItem && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex items-center justify-center p-8">
           <div className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden animate-in zoom-in-95 shadow-5xl border-[8px] border-[#F0E68C]/20 flex flex-col max-h-[90vh]">
              {/* Header Preview for Buildings or Media */}
              {(editingItem._type === 'building' || editingItem._type === 'media') && (
                <div className={`h-48 relative overflow-hidden ${editingItem._type === 'media' ? 'bg-slate-900' : (editingItem.color.includes('blue') ? 'bg-[#8B0000]' : editingItem.color)}`}>
                  <img src={editingItem._type === 'media' ? editingItem.thumbnailUrl : editingItem.image} className="w-full h-full object-cover opacity-60" alt="Preview" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                  <div className="absolute bottom-6 left-12 flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl ${editingItem._type === 'media' ? 'bg-red-600' : (editingItem.color.includes('blue') ? 'bg-[#8B0000]' : editingItem.color)}`}>
                      {editingItem._type === 'media' ? <Film size={32} /> : <MapPin size={32} fill="currentColor" />}
                    </div>
                    <div>
                      <h4 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">{editingItem.name || editingItem.title || 'New Entry'}</h4>
                      <p className="text-[10px] font-black text-slate-500 uppercase mt-2 tracking-widest">
                         {editingItem._type === 'media' ? 'Digital Asset Metadata' : 'Infrastructure Node Protocol'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setEditingItem(null)} className="absolute top-6 right-6 p-4 bg-white/20 backdrop-blur-md text-slate-900 rounded-3xl hover:bg-white/40 transition-all"><X size={24}/></button>
                </div>
              )}

              <div className="p-12 space-y-8 overflow-y-auto custom-scrollbar no-scrollbar flex-1">
                 {/* Default header for non-preview types */}
                 {(editingItem._type !== 'building' && editingItem._type !== 'media') && (
                    <div className="flex justify-between items-start mb-8">
                       <h4 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Terminal <span className="text-[#8B0000]">Override</span></h4>
                       <button onClick={() => setEditingItem(null)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"><X size={24}/></button>
                    </div>
                 )}

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div className="space-y-3">
                          <label className="text-[12px] font-black text-slate-400 uppercase ml-4 tracking-widest">Master Identity Name/Label</label>
                          <input value={editingItem.name || editingItem.title || ''} onChange={e => editingItem.name !== undefined ? setEditingItem({...editingItem, name: e.target.value}) : setEditingItem({...editingItem, title: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-black outline-none focus:border-[#8B0000] transition-all text-slate-700 shadow-inner" />
                       </div>
                       
                       {(editingItem._type === 'building' || editingItem._type === 'media') && (
                          <div className="bg-[#F0E68C]/10 p-6 rounded-[2.5rem] border border-[#F0E68C]/40 space-y-4">
                             <h5 className="text-[10px] font-black uppercase text-[#8B0000] tracking-widest flex items-center gap-2 px-2"><ImageIcon size={14}/> System Asset Gallery</h5>
                             <div className="grid grid-cols-4 gap-3">
                                {PRESET_GALLERY.map((url, i) => (
                                   <button 
                                      key={i} 
                                      onClick={() => editingItem._type === 'building' ? setEditingItem({...editingItem, image: url}) : setEditingItem({...editingItem, thumbnailUrl: url})}
                                      className={`aspect-video rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${ (editingItem.image === url || editingItem.thumbnailUrl === url) ? 'border-[#8B0000] shadow-lg' : 'border-white'}`}
                                   >
                                      <img src={url} className="w-full h-full object-cover" alt="" />
                                   </button>
                                ))}
                             </div>
                          </div>
                       )}

                       {editingItem._type === 'building' && (
                          <div className="space-y-3">
                             <label className="text-[12px] font-black text-slate-400 uppercase ml-4 tracking-widest">Protocol Description</label>
                             <textarea value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-medium outline-none focus:border-[#8B0000] transition-all text-slate-700 shadow-inner h-32 resize-none" />
                          </div>
                       )}

                       {editingItem._type === 'faculty' && (
                          <div className="space-y-3">
                             <label className="text-[12px] font-black text-slate-400 uppercase ml-4 tracking-widest">Node Block Allocation</label>
                             <input value={editingItem.block} onChange={e => setEditingItem({...editingItem, block: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none focus:border-[#8B0000] shadow-inner" />
                          </div>
                       )}
                    </div>
                    
                    <div className="space-y-6">
                       {editingItem._type === 'building' && (
                          <>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                   <label className="text-[12px] font-black text-slate-400 uppercase ml-4 tracking-widest">Color Class</label>
                                   <div className="flex items-center gap-3">
                                      <input value={editingItem.color} onChange={e => setEditingItem({...editingItem, color: e.target.value})} className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-[#8B0000] shadow-inner" placeholder="bg-[#8B0000]" />
                                      <div className={`w-12 h-12 rounded-xl shadow-md border-2 border-white ${editingItem.color.includes('blue') ? 'bg-[#8B0000]' : editingItem.color}`} title="Swatch Preview" />
                                   </div>
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[12px] font-black text-slate-400 uppercase ml-4 tracking-widest">Total Floors</label>
                                   <input type="number" value={editingItem.floors} onChange={e => setEditingItem({...editingItem, floors: parseInt(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-[#8B0000] shadow-inner" />
                                </div>
                             </div>
                             <div className="space-y-3">
                                <label className="text-[12px] font-black text-slate-400 uppercase ml-4 tracking-widest">Manual Image URL Path</label>
                                <input value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none focus:border-[#8B0000] shadow-inner" />
                             </div>
                          </>
                       )}

                       {editingItem._type === 'media' && (
                          <>
                             <div className="space-y-3">
                                <label className="text-[12px] font-black text-slate-400 uppercase ml-4 tracking-widest">Asset URL Override</label>
                                <input value={editingItem.thumbnailUrl} onChange={e => setEditingItem({...editingItem, thumbnailUrl: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none focus:border-[#8B0000] shadow-inner" />
                             </div>
                             <div className="space-y-3">
                                <label className="text-[12px] font-black text-slate-400 uppercase ml-4 tracking-widest">Associate with Course Hub</label>
                                <select 
                                   value={editingItem.subject || ''} 
                                   onChange={e => setEditingItem({...editingItem, subject: e.target.value})} 
                                   className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none focus:border-[#8B0000] shadow-inner appearance-none cursor-pointer"
                                >
                                   <option value="">Global Unassociated Node</option>
                                   {courses.map((c: Course) => (
                                      <option key={c.id} value={c.code}>{c.code} - {c.name}</option>
                                   ))}
                                </select>
                             </div>
                             <div className="space-y-3">
                                <label className="text-[12px] font-black text-slate-400 uppercase ml-4 tracking-widest">Digital Asset Type</label>
                                <select value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none focus:border-[#8B0000] shadow-inner appearance-none cursor-pointer">
                                    <option value="short">Short (Vertical Stream)</option>
                                    <option value="long">Long (Full Lecture)</option>
                                </select>
                             </div>
                          </>
                       )}

                       {editingItem._type === 'event' && (
                          <div className="space-y-3">
                             <label className="text-[12px] font-black text-slate-400 uppercase ml-4 tracking-widest">Mesh Timestamp</label>
                             <input value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none focus:border-[#8B0000] shadow-inner" />
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="flex gap-6 pt-10 border-t border-slate-50">
                    <button onClick={() => {
                       if(editingItem._type === 'student') saveItem(studentList, setStudentList);
                       if(editingItem._type === 'faculty') saveItem(facultyList, setFacultyList);
                       if(editingItem._type === 'course') saveItem(courses, setCourses);
                       if(editingItem._type === 'building') saveItem(buildings, setBuildings);
                       if(editingItem._type === 'event') saveItem(events, setEvents);
                       if(editingItem._type === 'job') saveItem(jobs, setJobs);
                       if(editingItem._type === 'media') saveItem(mediaList, setMediaList);
                    }} className="flex-1 py-6 bg-[#8B0000] text-white rounded-[2.5rem] font-black uppercase text-[12px] tracking-widest shadow-4xl shadow-[#8B0000]/40 hover:scale-[1.03] transition-all active:scale-95">Commit Global Sync</button>
                    <button onClick={() => setEditingItem(null)} className="px-14 py-6 bg-slate-50 text-slate-400 rounded-[2.5rem] font-black uppercase text-[12px] tracking-widest hover:bg-slate-100 transition-all active:scale-95">Abort Protocol</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Module: Faculty Dashboard ---
const FacultyDashboard = ({ user }: { user: User }) => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <header>
        <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">Node <span className="text-[#8B0000]">Terminal</span></h2>
        <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Operational status: <span className="text-emerald-500 font-black">FULLY SYNCED</span>. Welcome back, {user.name}.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm text-center">
          <Clock size={48} className="mx-auto text-[#8B0000] mb-8" />
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
const EdustoneHub = ({ courses }: { courses: Course[] }) => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Edustone <span className="text-[#8B0000]">Repository</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm group hover:border-[#F0E68C] transition-all hover:shadow-2xl">
            <div className="w-20 h-20 bg-[#F0E68C]/20 rounded-[1.8rem] flex items-center justify-center font-black text-3xl text-[#8B0000] mb-10 shadow-inner group-hover:bg-[#8B0000] group-hover:text-white transition-all duration-500">{course.code[0]}</div>
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
const VideoHub = ({ mediaList }: { mediaList: VideoType[] }) => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Vertical <span className="text-[#8B0000]">Streams</span></h2>
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
const CareersView = ({ jobs }: { jobs: Job[] }) => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Career <span className="text-[#8B0000]">Mesh</span></h2>
      <div className="grid grid-cols-1 gap-8">
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-12 rounded-[4.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between group hover:border-[#F0E68C] transition-all hover:shadow-2xl gap-8">
            <div className="flex items-center gap-10">
              <div className="w-20 h-20 bg-slate-50 rounded-[1.8rem] flex items-center justify-center font-black text-3xl text-[#8B0000] shadow-inner group-hover:bg-[#8B0000] group-hover:text-white transition-all duration-500">{job.company[0]}</div>
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
      <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden fixed top-8 left-8 z-[1000] p-5 bg-white rounded-[1.5rem] shadow-2xl text-[#8B0000] border border-slate-100 active:scale-95 transition-all">
        {mobileOpen ? <X size={28} /> : <LayoutDashboard size={28} />}
      </button>

      <aside className={`fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-100 z-[900] flex flex-col p-10 transition-transform duration-500 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-5 mb-16">
          <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center shadow-xl border border-slate-100 overflow-hidden">
            {logo.length > 5 ? <img src={logo} className="w-full h-full object-contain p-2" /> : <span className="text-[#8B0000] font-black text-2xl">{logo}</span>}
          </div>
          <span className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">Unistone</span>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all group ${activeTab === item.id ? 'bg-[#8B0000] text-white shadow-2xl shadow-[#8B0000]/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
            >
              <div className={`${activeTab === item.id ? 'text-white' : 'text-slate-300 group-hover:text-[#8B0000]'}`}>{item.icon}</div>
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

  const [logo, setLogo] = useSyncedState('unistone-logo', 'https://sageuniversity.edu.in/assets/images/logo.png');
  const [buildings, setBuildings] = useSyncedState('unistone-buildings', MOCK_BUILDINGS);
  const [courses, setCourses] = useSyncedState('unistone-courses', MOCK_COURSES);
  const [facultyList, setFacultyList] = useSyncedState('unistone-faculty', [
    { 
      id: 'f1', 
      name: 'Dr. Alan Turing', 
      role: 'Head of AI', 
      block: 'B Block', 
      status: 'Active', 
      bio: 'Visionary in the field of Artificial Intelligence and Cryptography. Leading the AI/ML Node at UNISTONE.',
      interests: ['Neural Networks', 'Cryptographic Security', 'Machine Intelligence'],
      courses: ['CS301: Data Structures', 'AI405: Deep Learning']
    },
    { 
      id: 'f2', 
      name: 'Prof. Feynman', 
      role: 'Quantum Director', 
      block: 'D Block', 
      status: 'Active', 
      bio: 'Renowned physicist focusing on Quantum Electrodynamics and Nanotechnology. Bringing quantum logic to the campus mesh.',
      interests: ['Quantum Physics', 'Nanotech', 'Fluid Dynamics'],
      courses: ['PH405: Quantum Mechanics', 'PH101: Basic Physics']
    },
    { 
      id: 'f3', 
      name: 'Dr. Neha Gupta', 
      role: 'HOD Pharmacy', 
      block: 'I Block', 
      status: 'Active', 
      bio: 'Expert in Pharmaceutical Sciences and Clinical Pharmacology. Overseeing the formulation labs at the Pharmacy Node.',
      interests: ['Pharmacokinetics', 'Drug Formulation', 'Public Health'],
      courses: ['PHARM101: Pharmaceutics', 'BIO302: Pharmacology']
    }
  ]);
  const [mediaList, setMediaList] = useSyncedState<VideoType[]>('unistone-media', MOCK_VIDEOS);
  const [events, setEvents] = useSyncedState('unistone-events', MOCK_EVENTS);
  const [jobs, setJobs] = useSyncedState('unistone-jobs', MOCK_JOBS);
  const [studentList, setStudentList] = useSyncedState('unistone-students', [
    { id: 's1', name: 'Sarah Connor', dept: 'AI/ML Node', status: 'Active' },
    { id: 's2', name: 'John Doe', dept: 'Software Dev', status: 'Active' },
    { id: 's3', name: 'Alex Reed', dept: 'Design Mesh', status: 'Active' },
    { id: 's4', name: 'Emily Chen', dept: 'Biotech Sync', status: 'Active' },
    { id: 's5', name: 'Leo Stone', dept: 'Quantum Eng', status: 'Active' },
    { id: 's6', name: 'Maya Patel', dept: 'Legal Mesh', status: 'Active' },
    { id: 's7', name: 'David Miller', dept: 'Business Flow', status: 'Active' },
    { id: 's8', name: 'Sophie Martin', dept: 'Media Node', status: 'Active' }
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
      if (activeTab === 'admin-crm') return <AdminCRMView studentList={studentList} setStudentList={setStudentList} facultyList={facultyList} setFacultyList={setFacultyList} buildings={buildings} setBuildings={setBuildings} courses={courses} setCourses={setCourses} events={events} setEvents={setEvents} jobs={jobs} setJobs={setJobs} mediaList={mediaList} setMediaList={setMediaList} logo={logo} setLogo={setLogo} />;
      if (activeTab === 'admin-dashboard') return (
        <div className="space-y-12 animate-in fade-in duration-500">
           <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                 <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">System <span className="text-[#8B0000]">Master</span></h2>
                 <p className="text-slate-400 font-bold italic mt-4 uppercase tracking-widest text-sm">Central Node Control Protocol</p>
              </div>
              <button onClick={() => setActiveTab('admin-crm')} className="px-14 py-7 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-xs shadow-2xl flex items-center gap-5 hover:scale-105 transition-all active:scale-95"><Database size={32} className="text-[#8B0000]"/> Master Hub Terminal</button>
           </header>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[ 
                 { l: 'Synced Hubs', v: studentList.length + facultyList.length, i: <Users className="text-[#8B0000]" size={32}/> }, 
                 { l: 'Mesh Blocks', v: buildings.length, i: <MapPin className="text-orange-500" size={32}/> }, 
                 { l: 'Intel Hub', v: mediaList.length, i: <Film className="text-red-500" size={32}/> }, 
                 { l: 'Event Ledger', v: events.length, i: <Calendar className="text-purple-500" size={32}/> } 
              ].map((s, i) => (
                <div key={i} className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 group">
                   <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-12 shadow-inner group-hover:bg-[#F0E68C]/20 group-hover:scale-110 transition-all">{s.i}</div>
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
                 <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">Command <span className="text-[#8B0000]">Feed</span></h2>
                 <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Welcome back, {user.name}. Your academic identity is fully synchronized with the campus mesh nodes.</p>
              </div>
              <div className="flex gap-8">
                 <div className="px-10 py-6 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all"><Flame className="text-orange-500" fill="currentColor" size={40}/><p className="text-4xl font-black leading-none">{user.streak}</p></div>
                 <div className="px-10 py-6 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all"><Award className="text-[#8B0000]" fill="currentColor" size={40}/><p className="text-4xl font-black leading-none">{user.xp}</p></div>
              </div>
           </header>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-16">
                 <section className="bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-end mb-12">
                       <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4"><LayoutDashboard className="text-[#8B0000]" size={32}/> Authorized Hubs</h3>
                       <button className="text-[12px] font-black text-[#8B0000] uppercase tracking-widest hover:underline" onClick={() => setActiveTab('edustone')}>Edustone Repository</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {courses.slice(0, 2).map((c: any) => (
                         <div key={c.id} className="p-12 bg-slate-50 rounded-[3.5rem] border border-slate-100 group hover:bg-white hover:border-[#F0E68C] transition-all cursor-pointer shadow-sm hover:shadow-2xl">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center font-black text-3xl mb-10 shadow-inner group-hover:bg-[#8B0000] group-hover:text-white transition-all duration-500">{c.code[0]}</div>
                            <p className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tighter line-clamp-1">{c.name}</p>
                            <p className="text-[12px] font-bold text-slate-400 uppercase mt-4 tracking-widest italic">{c.instructor}</p>
                         </div>
                       ))}
                    </div>
                 </section>
                 <section className="space-y-10">
                    <div className="flex justify-between items-end">
                       <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4"><PlaySquare className="text-red-500" size={32}/> Mesh Reels</h3>
                       <button className="text-[12px] font-black text-[#8B0000] uppercase tracking-widest hover:underline" onClick={() => setActiveTab('videohub')}>Vertical Stream</button>
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
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8B0000]/10 blur-[80px] rounded-full translate-x-[-20%] translate-y-[20%]" />
                    <h3 className="text-3xl font-black uppercase mb-12 flex items-center gap-4 tracking-tighter"><Calendar className="text-[#F0E68C]" size={32}/> Campus Pulse</h3>
                    <div className="space-y-12">
                       {events.slice(0, 3).map((e: any) => (
                         <div key={e.id} className="flex gap-8 group cursor-pointer">
                            <div className="w-20 h-20 rounded-[1.8rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center shrink-0 group-hover:bg-[#8B0000] group-hover:border-[#8B0000] transition-all duration-500">
                               <p className="text-[11px] font-black uppercase leading-none opacity-60">{e.date.split(' ')[0]}</p>
                               <p className="text-3xl font-black leading-none mt-2">{e.date.split(' ')[1].replace(',', '')}</p>
                            </div>
                            <div className="overflow-hidden flex flex-col justify-center">
                               <p className="text-lg font-black truncate uppercase tracking-tighter leading-none group-hover:text-[#F0E68C] transition-colors">{e.title}</p>
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
          <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Event <span className="text-[#8B0000]">Mesh</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {events.map((e: any) => (
              <div key={e.id} className="bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#F0E68C] transition-all hover:shadow-3xl">
                <div className="flex-1">
                   <p className="text-[12px] font-black text-[#8B0000] uppercase tracking-widest mb-3 leading-none">{e.date}</p>
                   <h4 className="text-4xl font-black leading-tight uppercase tracking-tighter mb-5 pr-6">{e.title}</h4>
                   <div className="flex items-center gap-4 text-slate-400 font-bold text-[12px] uppercase tracking-widest">
                      <MapPin size={20} className="text-[#8B0000]"/> {e.location}
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
         <Bot size={80} className="mx-auto text-[#8B0000]/10 mb-10 animate-pulse" />
         <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Node Protocol Initialization</h3>
         <p className="text-slate-400 font-bold italic mt-4 uppercase tracking-widest text-sm">Optimizing subsystem mesh for: <span className="text-[#8B0000]">"{activeTab}"</span></p>
         <button onClick={() => setActiveTab('dashboard')} className="mt-14 px-16 py-6 bg-[#8B0000] text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-[#8B0000]/30 hover:scale-105 transition-all active:scale-95">Establish Master Feed</button>
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
          <div className="p-12 bg-[#8B0000] text-white flex items-center justify-between shadow-2xl">
             <div className="flex items-center gap-6">
                <div className="p-5 bg-white/20 rounded-[1.8rem] backdrop-blur-md border border-white/20 shadow-xl"><Bot size={40} className="animate-bounce-slow text-[#F0E68C]"/></div>
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
                 <div className={`max-w-[90%] p-8 rounded-[3rem] text-sm font-bold leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#8B0000] text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="flex gap-3 p-4"><div className="w-3 h-3 bg-[#8B0000] rounded-full animate-bounce"/><div className="w-3 h-3 bg-[#8B0000] rounded-full animate-bounce [animation-delay:0.2s]"/><div className="w-3 h-3 bg-[#8B0000] rounded-full animate-bounce [animation-delay:0.4s]"/></div>}
          </div>
          <div className="p-10 bg-white border-t border-slate-100 flex gap-5 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
             <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="System query node..." className="flex-1 px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-sm font-black outline-none focus:border-[#8B0000] transition-all uppercase tracking-widest text-slate-700" />
             <button onClick={send} className="p-6 bg-[#8B0000] text-white rounded-[2rem] shadow-3xl hover:scale-110 active:scale-90 transition-all shadow-[#8B0000]/30 flex items-center justify-center"><Send size={28}/></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="w-28 h-28 bg-[#8B0000] text-white rounded-[3rem] shadow-4xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all group border-[10px] border-white relative">
           <div className="absolute inset-[-6px] rounded-[3.2rem] border-4 border-[#8B0000]/20 animate-ping opacity-20" />
           <Bot size={48} className="group-hover:rotate-12 transition-transform duration-500 text-[#F0E68C]"/>
        </button>
      )}
    </div>
  );
};

// --- Module: Attendance Controller ---
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
         <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">Smart <span className="text-[#8B0000]">Roster Hub</span></h2>
         <p className="text-slate-400 font-bold italic text-base uppercase tracking-widest">Synchronizing student nodes with master ledger.</p>
      </div>
      <div className="bg-white p-24 rounded-[6rem] border border-slate-100 shadow-4xl flex flex-col items-center gap-16 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-80 h-80 bg-[#8B0000]/5 blur-[120px] rounded-full translate-x-1/2 translate-y-[-1/2]" />
         <div className={`w-48 h-48 rounded-[4rem] flex items-center justify-center shadow-2xl relative z-10 transition-all duration-1000 ${active ? 'bg-emerald-50 text-emerald-600 animate-pulse' : 'bg-[#8B0000]/5 text-[#8B0000] shadow-inner'}`}>
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
                  <button className="px-12 py-8 bg-slate-50 text-slate-400 rounded-[3rem] font-black uppercase text-[12px] hover:text-[#8B0000] transition-all active:scale-90 shadow-sm"><RefreshCw size={32}/></button>
               </div>
            </div> 
         ) : ( 
            <button onClick={startHub} className="w-full py-10 bg-[#8B0000] text-white rounded-[3.5rem] font-black uppercase text-sm shadow-4xl shadow-[#8B0000]/30 hover:scale-[1.05] transition-all tracking-widest relative z-10 flex items-center justify-center gap-6 active:scale-95">
               <Compass size={36} className="animate-spin-slow text-[#F0E68C]" /> Initialize Master Broadcast
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
      <div className="bg-white rounded-[5rem] shadow-5xl border-[8px] border-[#F0E68C]/20 p-16 flex flex-col items-center text-center space-y-14">
        <div className={`w-40 h-40 rounded-[3.5rem] flex items-center justify-center animate-bounce duration-1000 ${marked ? 'bg-emerald-50 text-emerald-600 shadow-4xl shadow-emerald-500/20' : 'bg-[#8B0000]/5 text-[#8B0000] shadow-4xl shadow-[#8B0000]/20'}`}>
          {marked ? <CheckCircle size={80} /> : <AlertCircle size={80} />}
        </div>
        <div className="space-y-6">
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{marked ? 'Identity Synced!' : 'Master Node Detected!'}</h3>
          <p className="text-slate-500 font-medium text-xl mt-6 tracking-tight leading-relaxed px-6">{marked ? 'Your academic node is now globally synchronized with the university central ledger.' : `Authorized broadcast hub detected: Prof. ${session.instructor}. Do you wish to synchronize your identity?`}</p>
        </div>
        {!marked && (
           <button onClick={mark} className="w-full py-10 bg-[#8B0000] text-white font-black rounded-[3.5rem] shadow-4xl shadow-[#8B0000]/30 flex items-center justify-center gap-6 hover:scale-105 transition-all uppercase tracking-widest text-[14px] active:scale-95">
              <ScanFace size={36} className="text-[#F0E68C]" /> Establish Connection Link
           </button>
        )}
      </div>
    </div>
  );
};