
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
  Eye, ThumbsUp, ChevronDown, Check, Briefcase as JobIcon, MessageSquare as ChatIcon
} from 'lucide-react';
import { User, UserRole, Video as VideoType, CampusBuilding, Course, MapCoords, CampusEvent, Authority, Project, Job, CommunityPost } from './types';
import { NAV_ITEMS, MOCK_BUILDINGS, MOCK_COURSES, MOCK_VIDEOS, MOCK_EVENTS, MOCK_JOBS, MOCK_POSTS, MOCK_SCHEDULE } from './constants';
import { askUnistoneAI } from './services/gemini';

// --- Global State Persistence Hook ---
// This hook simulates a backend by keeping state in localStorage, 
// allowing "synchronization" across refreshes and different user sessions in the same browser.
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
        id: Math.random().toString(36).substr(2, 9),
        name: finalRole === UserRole.ADMIN ? 'Master Admin' : (finalRole === UserRole.FACULTY ? 'Prof. Alan Turing' : 'Sarah Connor'),
        email: email,
        role: finalRole,
        department: 'General',
        xp: finalRole === UserRole.STUDENT ? 1200 : 0,
        streak: finalRole === UserRole.STUDENT ? 5 : 0,
        skills: [],
        projects: []
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className={`md:w-1/2 p-12 text-white flex flex-col justify-between transition-all duration-500 ${isAdminPortal ? 'bg-slate-900' : 'academic-gradient'}`}>
          <div>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl overflow-hidden">
              {logo.length > 5 ? <img src={logo} alt="Logo" className="w-full h-full object-cover" /> : <span className={`font-black italic text-2xl ${isAdminPortal ? 'text-slate-900' : 'text-blue-600'}`}>{logo}</span>}
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase">UNISTONE</h1>
            <p className="text-blue-100 text-lg font-medium leading-relaxed opacity-90 tracking-tight">Synchronized Campus Operating System.</p>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-center">
             Identity Synchronization Active
          </div>
        </div>
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white relative">
          <button onClick={() => setIsAdminPortal(!isAdminPortal)} className="absolute top-8 right-8 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all">
            {isAdminPortal ? 'Switch to Student Hub' : 'Enter Admin Control'}
          </button>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase">Connect Node</h2>
            <p className="text-slate-500 font-medium">Access your campus dashboard</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isAdminPortal && (
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button type="button" onClick={() => setRole(UserRole.STUDENT)} className={`py-3 rounded-xl flex flex-col items-center gap-1 border transition-all ${role === UserRole.STUDENT ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <GraduationCap size={18} /><span className="text-[9px] font-bold uppercase">Student</span>
                </button>
                <button type="button" onClick={() => setRole(UserRole.FACULTY)} className={`py-3 rounded-xl flex flex-col items-center gap-1 border transition-all ${role === UserRole.FACULTY ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <BriefcaseIcon size={18} /><span className="text-[9px] font-bold uppercase">Faculty</span>
                </button>
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input name="email" type="email" required placeholder="University Identifier" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-sm font-medium transition-all" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input name="password" type="password" required placeholder="Security Key" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-sm font-medium transition-all" />
            </div>
            <button disabled={loading} className={`w-full py-4 text-white font-black rounded-2xl shadow-xl transition-all uppercase text-[10px] tracking-widest mt-4 ${isAdminPortal ? 'bg-slate-900 shadow-slate-900/20' : 'bg-blue-600 shadow-blue-500/20 active:scale-95 hover:bg-blue-700'}`}>
              {loading ? 'Authenticating...' : 'Synchronize Identity'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Module: Admin CRM ---
const AdminCRMView = ({ 
  mediaList, setMediaList, 
  buildings, setBuildings, 
  courses, setCourses, 
  facultyList, setFacultyList, 
  studentList, setStudentList,
  events, setEvents,
  jobs, setJobs,
  logo, setLogo
}: any) => {
  const [crmTab, setCrmTab] = useState<'students' | 'faculty' | 'blocks' | 'courses' | 'media' | 'events' | 'jobs' | 'customize'>('students');
  const [editingItem, setEditingItem] = useState<any>(null);

  const saveItem = (list: any[], setList: Function) => {
    setList(list.map(i => i.id === editingItem.id ? editingItem : i));
    setEditingItem(null);
  };

  const deleteItem = (id: string, list: any[], setList: Function) => {
    setList(list.filter(i => i.id !== id));
  };

  const renderTab = () => {
    switch (crmTab) {
      case 'students':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2"><Users className="text-blue-600" /> Student Ledger</h3>
                <button className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg shadow-md hover:bg-blue-700" onClick={() => setStudentList([...studentList, { id: Math.random().toString(), name: 'New Student', dept: 'Computer Science', status: 'Active' }])}>Enroll New Node</button>
             </div>
             <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                   <thead className="bg-slate-50/50 border-b border-slate-100 uppercase tracking-widest font-black text-slate-400">
                      <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Department</th><th className="px-6 py-4">Actions</th></tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {studentList.map((s: any) => (
                        <tr key={s.id} className="hover:bg-slate-50/30 font-bold text-slate-600 transition-colors">
                           <td className="px-6 py-4">{s.name}</td>
                           <td className="px-6 py-4 uppercase text-[10px]">{s.dept}</td>
                           <td className="px-6 py-4 flex gap-2">
                              <button onClick={() => setEditingItem({ ...s, _type: 'student' })} className="text-blue-400 hover:text-blue-600"><Edit3 size={16}/></button>
                              <button onClick={() => deleteItem(s.id, studentList, setStudentList)} className="text-red-300 hover:text-red-500"><Trash2 size={16}/></button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );
      case 'faculty':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2"><BriefcaseIcon className="text-emerald-600" /> Faculty Ledger</h3>
                <button className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg shadow-md hover:bg-emerald-700" onClick={() => setFacultyList([...facultyList, { id: Math.random().toString(), name: 'New Faculty', role: 'Senior Professor', load: 'General' }])}>Appoint Member</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facultyList.map((f: any) => (
                  <div key={f.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
                     <div>
                        <p className="text-sm font-black text-slate-900 leading-none">{f.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{f.role}</p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => setEditingItem({ ...f, _type: 'faculty' })} className="p-2 text-slate-200 hover:text-blue-600"><Edit3 size={16}/></button>
                        <button onClick={() => deleteItem(f.id, facultyList, setFacultyList)} className="p-2 text-slate-200 hover:text-red-500"><Trash2 size={16}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'blocks':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2"><MapPin className="text-orange-600" /> Campus Infrastructure</h3>
                <button className="px-4 py-2 bg-orange-600 text-white text-[10px] font-black uppercase rounded-lg shadow-md" onClick={() => setBuildings([...buildings, { id: Math.random().toString(), name: 'New Block', description: 'Faculty Hub', color: 'bg-orange-500', departments: ['All'], mapCoords: { top: '50%', left: '50%' }, image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200' }])}>Add Block</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {buildings.map((b: any) => (
                  <div key={b.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 ${b.color} rounded-xl shadow-inner`} />
                        <p className="text-sm font-black text-slate-900">{b.name}</p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => setEditingItem({ ...b, _type: 'building' })} className="text-blue-400"><Edit3 size={16}/></button>
                        <button onClick={() => deleteItem(b.id, buildings, setBuildings)} className="text-red-300"><Trash2 size={16}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'courses':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2"><BookOpen className="text-purple-600" /> Edustone Catalog</h3>
                <button className="px-4 py-2 bg-purple-600 text-white text-[10px] font-black uppercase rounded-lg shadow-md hover:bg-purple-700" onClick={() => setCourses([...courses, { id: Math.random().toString(), name: 'Digital Architecture', code: 'UN-505', instructor: 'Prof. Turing', notesCount: 5, lecturesCount: 0 }])}>Create Hub</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((c: any) => (
                  <div key={c.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-purple-200 transition-all">
                     <div>
                        <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{c.code}</p>
                        <h4 className="text-sm font-black text-slate-900 mt-1 uppercase">{c.name}</h4>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => setEditingItem({ ...c, _type: 'course' })} className="p-2 text-slate-200 hover:text-blue-600 transition-all"><Edit3 size={16}/></button>
                        <button onClick={() => deleteItem(c.id, courses, setCourses)} className="p-2 text-slate-200 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'events':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black uppercase flex items-center gap-2"><Calendar className="text-blue-600"/> Synchronized Events</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase shadow-lg shadow-blue-500/20" onClick={() => setEvents([...events, { id: Math.random().toString(), title: 'Campus Summit', date: 'Oct 15, 2024', location: 'Digital Auditorium', registeredCount: 120 }])}>Deploy Event</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((e: any) => (
                <div key={e.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="overflow-hidden">
                    <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{e.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{e.date} • {e.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-200 hover:text-blue-600 transition-all" onClick={() => setEditingItem({ ...e, _type: 'event' })}><Edit3 size={16}/></button>
                    <button className="p-2 text-slate-200 hover:text-red-500 transition-all" onClick={() => deleteItem(e.id, events, setEvents)}><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'jobs':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black uppercase flex items-center gap-2"><JobIcon className="text-emerald-600"/> Career Opportunities</h3>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20" onClick={() => setJobs([...jobs, { id: Math.random().toString(), title: 'Cloud Architect', company: 'Amazon', type: 'full-time', location: 'Hybrid', salary: '22 LPA', tags: ['AWS', 'DevOps'], link: '#' }])}>Publish Role</button>
            </div>
            <div className="space-y-3">
              {jobs.map((j: any) => (
                <div key={j.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all">{j.company[0]}</div>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{j.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{j.company} • {j.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-200 hover:text-blue-600 transition-all" onClick={() => setEditingItem({ ...j, _type: 'job' })}><Edit3 size={16}/></button>
                    <button className="p-2 text-slate-200 hover:text-red-500 transition-all" onClick={() => deleteItem(j.id, jobs, setJobs)}><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'media':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-black uppercase flex items-center gap-3"><Film className="text-red-600"/> Academic Repository</h3>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase shadow-lg shadow-red-500/20" onClick={() => setMediaList([...mediaList, { id: Math.random().toString(), title: 'Quantum Intro', type: 'short', thumbnailUrl: 'https://picsum.photos/seed/new/400/700', videoUrl: '#', views: 0, likes: 0 }])}>Upload Media</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {mediaList.map((m: any) => (
                 <div key={m.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden group shadow-sm hover:shadow-xl transition-all">
                   <div className="h-40 bg-slate-100 relative overflow-hidden">
                      <img src={m.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt=""/>
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[8px] font-black rounded uppercase tracking-widest">{m.type}</div>
                   </div>
                   <div className="p-5 flex justify-between items-center">
                     <p className="text-[10px] font-black truncate max-w-[120px] uppercase text-slate-700">{m.title}</p>
                     <div className="flex gap-2">
                        <button className="p-2 text-slate-300 hover:text-blue-600 transition-all" onClick={() => setEditingItem({ ...m, _type: 'media' })}><Edit3 size={14}/></button>
                        <button className="p-2 text-slate-300 hover:text-red-500 transition-all" onClick={() => deleteItem(m.id, mediaList, setMediaList)}><Trash2 size={14}/></button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        );
      case 'customize':
        return (
          <div className="max-w-xl bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8 animate-in zoom-in-95">
            <h3 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter"><Palette className="text-blue-600"/> Brand Console</h3>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Global Logo Identifier</label>
              <div className="flex gap-4">
                 <input value={logo} onChange={e => setLogo(e.target.value)} className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black outline-none focus:border-blue-500 transition-all uppercase tracking-widest text-slate-700" placeholder="e.g. U or URL" />
                 <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20">{logo.length > 5 ? 'IMG' : logo}</div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 italic">Syncs logo across Student and Faculty hubs instantly.</p>
            </div>
          </div>
        );
      default: return <div className="text-slate-400 font-bold italic p-10 text-center bg-white rounded-[3rem] border border-dashed">Subsystem node optimization pending.</div>;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
           <h2 className="text-5xl font-black uppercase leading-none tracking-tighter">Campus <span className="text-blue-600">Master Hub</span></h2>
           <p className="text-slate-400 font-bold italic mt-2 text-xs uppercase tracking-widest">Central Repository & Sync Center</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
           {['students', 'faculty', 'blocks', 'courses', 'media', 'events', 'jobs', 'customize'].map(tab => (
             <button key={tab} onClick={() => setCrmTab(tab as any)} className={`px-5 py-3 rounded-xl font-black text-[10px] uppercase transition-all whitespace-nowrap ${crmTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50'}`}>{tab}</button>
           ))}
        </div>
      </header>
      <div className="pt-4">{renderTab()}</div>
      
      {editingItem && (
        <div className="fixed inset-0 z-[500] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-12 space-y-8 animate-in zoom-in-95 shadow-2xl border border-white">
            <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">Override Terminal</h4>
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Label / Title</label>
                  <input value={editingItem.title || editingItem.name} onChange={e => editingItem.title !== undefined ? setEditingItem({...editingItem, title: e.target.value}) : setEditingItem({...editingItem, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black outline-none focus:border-blue-500 transition-all text-slate-700" />
               </div>
               {editingItem._type === 'media' && (
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Resource Link</label>
                     <input value={editingItem.thumbnailUrl} onChange={e => setEditingItem({...editingItem, thumbnailUrl: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black outline-none focus:border-blue-500" />
                  </div>
               )}
            </div>
            <div className="flex gap-3 pt-6">
              <button onClick={() => {
                if(editingItem._type === 'student') saveItem(studentList, setStudentList);
                if(editingItem._type === 'faculty') saveItem(facultyList, setFacultyList);
                if(editingItem._type === 'course') saveItem(courses, setCourses);
                if(editingItem._type === 'event') saveItem(events, setEvents);
                if(editingItem._type === 'job') saveItem(jobs, setJobs);
                if(editingItem._type === 'media') saveItem(mediaList, setMediaList);
                if(editingItem._type === 'building') saveItem(buildings, setBuildings);
              }} className="flex-1 py-5 bg-blue-600 text-white rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Synchronize Data</button>
              <button onClick={() => setEditingItem(null)} className="px-8 py-5 bg-slate-100 text-slate-400 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Abort</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Module: Faculty Dash ---
const FacultyDashboard = ({ user }: any) => {
  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black uppercase leading-none tracking-tighter">Instructor <span className="text-blue-600">Sync Node</span></h2>
          <p className="text-slate-500 font-medium italic mt-2">Welcome back, {user.name}. Your academic ledger is synchronized.</p>
        </div>
        <button className="px-10 py-5 bg-blue-600 text-white rounded-[1.8rem] font-black uppercase text-[10px] shadow-xl shadow-blue-500/20 flex items-center gap-3 hover:scale-105 transition-all active:scale-95 tracking-widest"><Plus size={18}/> New Lecture Broadcast</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black mb-8 uppercase tracking-tight flex items-center gap-3"><PlaySquare className="text-blue-600" /> Current Academic Stream</h3>
          <div className="p-24 text-center text-slate-300 font-bold italic uppercase border-2 border-dashed border-slate-50 rounded-[3rem]">
             Master repository optimized. Awaiting content synchronization.
          </div>
        </div>
        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full translate-x-1/2 translate-y-[-1/2]" />
           <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Node Metrics</h3>
           <p className="text-6xl font-black text-blue-400 leading-none tracking-tighter">1,240</p>
           <p className="text-[10px] font-black uppercase text-slate-500 mt-4 tracking-widest leading-relaxed">Active Academic Nodes Connected to your Hub</p>
           <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase"><span className="text-slate-500">Node Latency</span><span className="text-emerald-500">2ms</span></div>
              <div className="flex justify-between text-[10px] font-black uppercase"><span className="text-slate-500">Uptime</span><span className="text-blue-500">99.9%</span></div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Module: Student Edustone Hub ---
const EdustoneHub = ({ courses }: any) => (
  <div className="space-y-8 animate-in fade-in duration-500 pb-20">
    <h2 className="text-4xl font-black uppercase leading-none tracking-tighter">Edustone <span className="text-blue-600">Hub</span></h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((c: any) => (
        <div key={c.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:border-blue-200 transition-all hover:shadow-2xl hover:translate-y-[-4px]">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">{c.code[0]}</div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 leading-none">{c.code}</p>
          <h4 className="text-2xl font-black mb-2 leading-tight uppercase tracking-tight">{c.name}</h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10 italic">Professor: {c.instructor}</p>
          <div className="flex justify-between items-center pt-8 border-t border-slate-50">
             <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest"><FileText size={16} className="text-blue-400"/> {c.notesCount || 0} Assets</div>
             <button className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-[1.2rem] hover:bg-black transition-all tracking-widest active:scale-95 shadow-lg">Enter Hub</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Module: Student Video Hub ---
const VideoHub = ({ mediaList }: any) => {
  const shorts = useMemo(() => mediaList.filter((m: any) => m.type === 'short'), [mediaList]);
  const longLectures = useMemo(() => mediaList.filter((m: any) => m.type === 'long'), [mediaList]);
  return (
    <div className="space-y-16 animate-in fade-in duration-500 pb-20">
      <section className="space-y-8">
         <div className="flex justify-between items-end">
            <h3 className="text-3xl font-black uppercase flex items-center gap-3 tracking-tighter"><PlaySquare className="text-red-600" size={32}/> Synchronized Reels</h3>
            <button className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">Vertical Stream</button>
         </div>
         <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x">
            {shorts.map((v: any) => (
              <div key={v.id} className="w-60 h-96 bg-slate-200 rounded-[3rem] overflow-hidden shrink-0 relative group shadow-2xl snap-start border-4 border-white">
                 <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt=""/>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent flex flex-col justify-end p-8">
                    <p className="text-white text-xs font-black leading-tight uppercase tracking-tight line-clamp-2">{v.title}</p>
                    <div className="flex items-center gap-2 mt-4">
                       <ThumbsUp size={12} className="text-red-500" fill="currentColor"/>
                       <span className="text-[10px] text-white font-black tracking-widest">{v.likes || '24k'}</span>
                    </div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/30 backdrop-blur-[2px]">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full border border-white/40 flex items-center justify-center text-white shadow-2xl"><Play size={32} fill="currentColor"/></div>
                 </div>
              </div>
            ))}
         </div>
      </section>
      <section className="space-y-8">
         <h3 className="text-3xl font-black uppercase flex items-center gap-3 tracking-tighter"><Film className="text-blue-600" size={32}/> Master Lectures</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {longLectures.map((v: any) => (
              <div key={v.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all hover:translate-y-[-4px]">
                 <div className="h-56 bg-slate-100 relative overflow-hidden">
                    <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt=""/>
                    <div className="absolute top-5 right-5 px-4 py-1.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-black rounded-xl uppercase tracking-widest border border-white/10">Full Session</div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/30"><div className="w-20 h-20 bg-white/10 backdrop-blur-2xl rounded-full border border-white/30 flex items-center justify-center shadow-3xl text-white"><Play fill="currentColor" size={32}/></div></div>
                 </div>
                 <div className="p-10">
                    <h4 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight line-clamp-2">{v.title}</h4>
                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-50">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.views || '150k'} Synced Views</p>
                       <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline active:scale-95 transition-all">Watch Now</button>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

// --- Module: Student Careers ---
const CareersView = ({ jobs }: any) => (
  <div className="space-y-12 animate-in fade-in duration-500 pb-20">
    <div className="flex justify-between items-end">
       <h2 className="text-4xl font-black uppercase leading-none tracking-tighter">Career <span className="text-emerald-600">Sync Hub</span></h2>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{jobs.length} Active Nodes Detected</p>
    </div>
    <div className="space-y-6">
      {jobs.map((j: any) => (
        <div key={j.id} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all hover:shadow-2xl">
          <div className="flex items-center gap-10">
             <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center font-black text-4xl shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">{j.company[0]}</div>
             <div>
                <div className="flex items-center gap-3 mb-2">
                   <h4 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter">{j.title}</h4>
                   <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase rounded-lg">Verified</span>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4">{j.company} • {j.location} • <span className="text-emerald-600 font-black">{j.salary || 'LPA Optimized'}</span></p>
                <div className="flex gap-3 mt-8">
                   {(j.tags || []).map((t: string) => <span key={t} className="px-5 py-2.5 bg-slate-50 text-slate-600 text-[10px] font-black uppercase rounded-[1.2rem] border border-slate-100 group-hover:bg-emerald-50 transition-colors">{t}</span>)}
                </div>
             </div>
          </div>
          <button className="px-12 py-6 bg-slate-900 text-white rounded-[2.2rem] font-black uppercase text-[11px] shadow-2xl hover:bg-black transition-all tracking-widest active:scale-95">Synchronize Resume</button>
        </div>
      ))}
    </div>
  </div>
);

// --- Sub-Module: Sidebar Controller ---
const Sidebar = ({ activeTab, setActiveTab, user, onLogout, logo }: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void; 
  user: User; 
  onLogout: () => void;
  logo: string;
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(() => {
    if (user.role === UserRole.ADMIN) {
      return [
        { id: 'admin-dashboard', label: 'Control Center', icon: <LayoutDashboard size={20} /> },
        { id: 'admin-crm', label: 'System Ledger', icon: <Database size={20} /> },
        { id: 'navigation', label: 'Campus Mesh', icon: <MapIcon size={20} /> },
      ];
    }
    if (user.role === UserRole.FACULTY) {
      return [
        { id: 'faculty-dashboard', label: 'Hub Console', icon: <LayoutDashboard size={20} /> },
        { id: 'attendance', label: 'Roster Node', icon: <ScanFace size={20} /> },
        { id: 'navigation', label: 'Campus Mesh', icon: <MapIcon size={20} /> },
      ];
    }
    return NAV_ITEMS;
  }, [user.role]);

  return (
    <>
      <button 
        onClick={() => setMobileOpen(!mobileOpen)} 
        className="md:hidden fixed top-8 left-8 z-[1000] p-4 bg-white rounded-2xl shadow-xl text-blue-600 border border-slate-100 active:scale-95 transition-all"
      >
        {mobileOpen ? <X size={24} /> : <LayoutDashboard size={24} />}
      </button>

      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-100 z-[900] flex flex-col p-8 transition-transform duration-500 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
            {logo.length > 5 ? 'U' : logo}
          </div>
          <span className="text-xl font-black uppercase tracking-tighter text-slate-900">Unistone</span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-slate-50 space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
               <UserIcon size={20} />
            </div>
            <div className="overflow-hidden">
               <p className="text-[10px] font-black uppercase tracking-tighter truncate text-slate-900 leading-none">{user.name}</p>
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-600 transition-all shrink-0"
          >
            <LogOut size={20} />
            Disconnect
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

  // Centralized Master States - Synchronized via useSyncedState (Simulated Global Ledger)
  const [logo, setLogo] = useSyncedState('unistone-logo', 'U');
  const [buildings, setBuildings] = useSyncedState('unistone-buildings', MOCK_BUILDINGS);
  const [courses, setCourses] = useSyncedState('unistone-courses', MOCK_COURSES);
  const [facultyList, setFacultyList] = useSyncedState('unistone-faculty', [
    { id: 'f1', name: 'Dr. Alan Turing', role: 'Dean of Computing', load: 'CS301', block: 'Engineering Block', status: 'Active' },
    { id: 'f2', name: 'Prof. Richard Feynman', role: 'Director of Physics', load: 'PH405', block: 'Science Block', status: 'Active' }
  ]);
  const [mediaList, setMediaList] = useSyncedState('unistone-media', MOCK_VIDEOS);
  const [events, setEvents] = useSyncedState('unistone-events', MOCK_EVENTS);
  const [jobs, setJobs] = useSyncedState('unistone-jobs', MOCK_JOBS);
  const [studentList, setStudentList] = useSyncedState('unistone-students', [
    { name: 'Sarah Connor', id: 'UN-2024-001', dept: 'AI/ML Node', status: 'Active' },
    { name: 'John Doe', id: 'UN-2024-115', dept: 'Software Node', status: 'Active' }
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
    // Shared Navigation for all nodes
    if (activeTab === 'navigation') return <MapView buildings={buildings} />;

    // Admin Access Protocol
    if (user.role === UserRole.ADMIN) {
      if (activeTab === 'admin-crm') return <AdminCRMView mediaList={mediaList} setMediaList={setMediaList} buildings={buildings} setBuildings={setBuildings} courses={courses} setCourses={setCourses} facultyList={facultyList} setFacultyList={setFacultyList} studentList={studentList} setStudentList={setStudentList} events={events} setEvents={setEvents} jobs={jobs} setJobs={setJobs} logo={logo} setLogo={setLogo} />;
      if (activeTab === 'admin-dashboard') return (
        <div className="space-y-8 animate-in fade-in duration-500">
           <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                 <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">System <span className="text-blue-600">Oversight</span></h2>
                 <p className="text-slate-400 font-bold italic mt-2 uppercase tracking-widest text-sm">Master Node Operation Console</p>
              </div>
              <button onClick={() => setActiveTab('admin-crm')} className="px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-xs shadow-2xl flex items-center gap-4 hover:scale-105 transition-all active:scale-95"><Database size={28} className="text-blue-500"/> Platform Management</button>
           </header>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[ 
                 { l: 'Synced Hubs', v: studentList.length + facultyList.length, i: <Users className="text-blue-500" size={32}/> }, 
                 { l: 'Campus Blocks', v: buildings.length, i: <MapPin className="text-emerald-500" size={32}/> }, 
                 { l: 'Media Repository', v: mediaList.length, i: <Film className="text-red-500" size={32}/> }, 
                 { l: 'Event Ledger', v: events.length, i: <Calendar className="text-purple-500" size={32}/> } 
              ].map((s, i) => (
                <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 shadow-inner">{s.i}</div>
                   <p className="text-6xl font-black tracking-tighter leading-none text-slate-900">{s.v}</p>
                   <p className="text-[11px] font-black uppercase text-slate-400 mt-4 tracking-widest">{s.l}</p>
                </div>
              ))}
           </div>
        </div>
      );
    }

    // Faculty Access Protocol
    if (user.role === UserRole.FACULTY) {
      if (activeTab === 'faculty-dashboard') return <FacultyDashboard user={user} />;
      if (activeTab === 'attendance') return <FacultyAttendance user={user} />;
    }

    // Student Access Protocol
    if (user.role === UserRole.STUDENT) {
      if (activeTab === 'dashboard') return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-20">
           <header className="flex justify-between items-end">
              <div>
                 <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Campus <span className="text-blue-600">Feed</span></h2>
                 <p className="text-slate-500 font-medium italic mt-3 text-lg">Your academic nodes are synchronized with the university mesh.</p>
              </div>
              <div className="flex gap-6">
                 <div className="px-8 py-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-2xl transition-all"><Flame className="text-orange-500" fill="currentColor" size={32}/><p className="text-3xl font-black leading-none">{user.streak}</p></div>
                 <div className="px-8 py-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-2xl transition-all"><Award className="text-blue-500" fill="currentColor" size={32}/><p className="text-3xl font-black leading-none">{user.xp}</p></div>
              </div>
           </header>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-16">
                 <section className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-end mb-10">
                       <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3"><LayoutDashboard className="text-blue-600" size={24}/> Subsystem Hubs</h3>
                       <button className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:underline" onClick={() => setActiveTab('edustone')}>Edustone Repository</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {courses.slice(0, 2).map((c: any) => (
                         <div key={c.id} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 group hover:bg-white hover:border-blue-200 transition-all cursor-pointer shadow-sm hover:shadow-2xl">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-2xl mb-8 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">{c.code[0]}</div>
                            <p className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight line-clamp-1">{c.name}</p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mt-3 tracking-widest italic">{c.instructor}</p>
                         </div>
                       ))}
                    </div>
                 </section>
                 <section className="space-y-8">
                    <div className="flex justify-between items-end">
                       <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3"><PlaySquare className="text-red-500" size={24}/> Synchronized Shorts</h3>
                       <button className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:underline" onClick={() => setActiveTab('videohub')}>View Repository</button>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x">
                       {mediaList.filter((m: any) => m.type === 'short').map((v: any) => (
                         <div key={v.id} className="w-48 h-80 bg-slate-200 rounded-[2.8rem] overflow-hidden shrink-0 relative group shadow-xl snap-start border-4 border-white">
                            <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt=""/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex flex-col justify-end p-6">
                               <p className="text-white text-[11px] font-black line-clamp-2 uppercase tracking-tight leading-relaxed">{v.title}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>
              </div>
              <div className="space-y-10">
                 <section className="bg-slate-900 p-12 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full translate-x-[-20%] translate-y-[20%]" />
                    <h3 className="text-2xl font-black uppercase mb-10 flex items-center gap-3 tracking-tighter"><Calendar className="text-blue-400" size={24}/> Master Calendar</h3>
                    <div className="space-y-10">
                       {events.slice(0, 3).map((e: any) => (
                         <div key={e.id} className="flex gap-6 group cursor-pointer">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300">
                               <p className="text-[10px] font-black uppercase leading-none opacity-60">{e.date.split(' ')[0]}</p>
                               <p className="text-2xl font-black leading-none mt-1.5">{e.date.split(' ')[1].replace(',', '')}</p>
                            </div>
                            <div className="overflow-hidden flex flex-col justify-center">
                               <p className="text-base font-black truncate uppercase tracking-tight leading-none group-hover:text-blue-400 transition-colors">{e.title}</p>
                               <p className="text-[11px] text-slate-500 truncate mt-2 tracking-widest uppercase font-bold">{e.location}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    <button className="w-full mt-12 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95" onClick={() => setActiveTab('events')}>Synchronize Hub</button>
                 </section>
                 
                 <section className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
                    <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3"><Award className="text-yellow-500" size={24}/> Hall of Fame</h3>
                    <div className="space-y-8">
                       {studentList.slice(0, 3).map((s: any, idx: number) => (
                         <div key={s.id} className="flex items-center gap-6">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-inner ${idx === 0 ? 'bg-yellow-50 text-yellow-600' : idx === 1 ? 'bg-slate-50 text-slate-400' : 'bg-orange-50 text-orange-600'}`}>#{idx + 1}</div>
                            <div className="flex-1 overflow-hidden">
                               <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tight leading-none">{s.name}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Node Optimized • {15000 - (idx * 1200)} XP</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    <button className="w-full py-5 bg-slate-50 text-slate-400 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-all">Full Ranking</button>
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
          <h2 className="text-5xl font-black uppercase leading-none tracking-tighter">Campus <span className="text-blue-600">Event Hub</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((e: any) => (
              <div key={e.id} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all hover:shadow-2xl hover:translate-y-[-4px]">
                <div className="flex-1">
                   <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-2 leading-none">{e.date}</p>
                   <h4 className="text-3xl font-black leading-tight uppercase tracking-tighter mb-4 pr-4">{e.title}</h4>
                   <div className="flex items-center gap-3 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                      <MapPin size={16} className="text-blue-400"/> {e.location}
                   </div>
                   <div className="mt-8 flex items-center gap-4">
                      <span className="px-5 py-2.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-[1.2rem] border border-emerald-100">{e.registeredCount || 0} Registered Nodes</span>
                   </div>
                </div>
                <button className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all active:scale-95">Verify Node</button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="p-24 text-center bg-white rounded-[4rem] border border-dashed border-slate-200 animate-in zoom-in-95 duration-700">
         <Bot size={64} className="mx-auto text-blue-100 mb-8 animate-pulse" />
         <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">System Synchronization</h3>
         <p className="text-slate-400 font-bold italic mt-3 uppercase tracking-widest text-[11px]">Node optimization pending for subsystem: <span className="text-blue-600">"{activeTab}"</span></p>
         <button onClick={() => setActiveTab('dashboard')} className="mt-12 px-12 py-5 bg-blue-600 text-white rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-blue-500/30 hover:scale-105 transition-all active:scale-95">Return to Command Feed</button>
      </div>
    );
  };

  return (
    <div className="min-h-screen gradient-bg">
      {session && <AttendancePopup session={session} onMark={() => setSession(null)} />}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser(null)} logo={logo} />
      <main className="md:ml-64 p-4 md:p-12 h-screen flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 custom-scrollbar no-scrollbar scroll-smooth">{renderContent()}</div>
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
    <div className="fixed bottom-10 right-10 z-[200]">
      {open ? (
        <div className="w-80 md:w-[420px] h-[600px] bg-white rounded-[3.5rem] shadow-3xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-700">
          <div className="p-10 bg-blue-600 text-white flex items-center justify-between shadow-2xl">
             <div className="flex items-center gap-5">
                <div className="p-4 bg-white/20 rounded-[1.5rem] backdrop-blur-md border border-white/20 shadow-xl"><Bot size={32} className="animate-bounce-slow"/></div>
                <div><p className="font-black uppercase text-sm leading-none tracking-tight">Unistone AI</p><p className="text-[10px] font-black uppercase opacity-60 mt-2 tracking-widest">Master Concierge Node</p></div>
             </div>
             <button onClick={() => setOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-90"><X size={24}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50 custom-scrollbar">
            {messages.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-6 py-10">
                  <Bot size={56} className="mb-6" />
                  <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">Hub synchronized. Awaiting academic query or system navigation request.</p>
               </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                 <div className={`max-w-[88%] p-6 rounded-[2.5rem] text-sm font-bold leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="flex gap-2.5 p-3"><div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"/><div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"/><div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"/></div>}
          </div>
          <div className="p-8 bg-white border-t border-slate-100 flex gap-4 shadow-[0_-15px_40px_rgba(0,0,0,0.02)]">
             <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="System query node..." className="flex-1 px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-black outline-none focus:border-blue-500 transition-all uppercase tracking-widest text-slate-700" />
             <button onClick={send} className="p-5 bg-blue-600 text-white rounded-[1.8rem] shadow-2xl hover:scale-110 active:scale-90 transition-all shadow-blue-500/30 flex items-center justify-center"><Send size={24}/></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="w-24 h-24 bg-blue-600 text-white rounded-[2.5rem] shadow-3xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all group border-8 border-white relative">
           <div className="absolute inset-[-4px] rounded-[2.5rem] border-2 border-blue-600/20 animate-ping opacity-20" />
           <Bot size={44} className="group-hover:rotate-12 transition-transform duration-500"/>
        </button>
      )}
    </div>
  );
};

// --- Sub-Module: Map Controller ---
const MapView = ({ buildings }: any) => {
  const [selected, setSelected] = useState<any>(null);
  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-[4rem] border border-slate-100 relative overflow-hidden shadow-sm animate-in fade-in duration-1000">
      <div className="absolute inset-0 bg-slate-50 overflow-hidden">
         <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563eb_1.5px,transparent_1.5px)] bg-[length:50px:50px]" />
            {buildings.map((b: any) => (
              <div key={b.id} className="absolute transition-all duration-500 z-10" style={{ top: b.mapCoords.top, left: b.mapCoords.left }}>
                <div onClick={() => setSelected(b)} className="group relative">
                   <div className={`w-12 h-12 ${b.color} rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white transition-all group-hover:scale-150 hover:z-50 cursor-pointer`}>
                      <MapPin size={22} fill="currentColor"/>
                   </div>
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white px-5 py-2.5 rounded-2xl shadow-3xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-[60] translate-y-2 group-hover:translate-y-0">
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-900">{b.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">Authorized Block</p>
                   </div>
                </div>
              </div>
            ))}
         </div>
      </div>
      
      {selected && (
        <div className="absolute bottom-12 right-12 w-[420px] bg-white rounded-[4rem] border border-slate-100 shadow-3xl overflow-hidden animate-in slide-in-from-right-12 duration-700 z-[100]">
           <div className="h-56 relative group">
              <img src={selected.image} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" alt=""/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <button onClick={() => setSelected(null)} className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/40 transition-all active:scale-90"><X size={20}/></button>
           </div>
           <div className="p-12 space-y-8">
              <div className="flex justify-between items-start">
                 <div>
                    <h4 className="text-3xl font-black leading-none uppercase tracking-tighter text-slate-900">{selected.name}</h4>
                    <p className="text-[11px] text-blue-600 font-black uppercase mt-3 tracking-widest">{selected.departments.length} Synced Departments</p>
                 </div>
              </div>
              <p className="text-slate-500 text-sm font-medium leading-relaxed italic border-l-4 border-blue-500 pl-6">{selected.description}</p>
              <div className="flex flex-wrap gap-2.5">
                 {selected.departments.map((d: string) => (
                    <span key={d} className="px-4 py-2 bg-slate-50 text-slate-700 text-[9px] font-black uppercase rounded-xl border border-slate-100">{d}</span>
                 ))}
              </div>
              <button className="w-full py-6 bg-blue-600 text-white rounded-[2.2rem] font-black uppercase text-[11px] shadow-2xl shadow-blue-500/30 hover:scale-[1.03] transition-all tracking-widest active:scale-95">Synchronize Route to Node</button>
           </div>
        </div>
      )}
      
      <div className="absolute top-12 left-12 w-96 z-50">
         <div className="bg-white/80 backdrop-blur-2xl p-7 rounded-[3rem] border border-white shadow-3xl flex items-center gap-5">
            <Search className="text-blue-600" size={24} />
            <input placeholder="Locate campus hub..." className="bg-transparent outline-none text-sm font-black flex-1 uppercase tracking-widest text-slate-900 placeholder-slate-400" />
         </div>
      </div>
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
    <div className="max-w-2xl mx-auto py-12 space-y-16 animate-in fade-in duration-1000">
      <div className="text-center space-y-4">
         <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">AI Smart <span className="text-blue-600">Roster Node</span></h2>
         <p className="text-slate-400 font-bold italic text-sm uppercase tracking-widest">Synchronizing student mesh presence with central ledger.</p>
      </div>
      <div className="bg-white p-20 rounded-[5rem] border border-slate-100 shadow-3xl flex flex-col items-center gap-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full translate-x-1/2 translate-y-[-1/2]" />
         <div className={`w-40 h-40 rounded-[3rem] flex items-center justify-center shadow-inner relative z-10 transition-all duration-700 ${active ? 'bg-emerald-50 text-emerald-600 animate-pulse' : 'bg-blue-50 text-blue-600 shadow-xl'}`}>
            <ScanFace size={80} className={active ? 'scale-110' : ''}/>
         </div>
         {active ? ( 
            <div className="w-full space-y-10 relative z-10 animate-in slide-in-from-bottom-8 duration-700">
               <div className="flex justify-between items-end">
                  <p className="text-[12px] font-black uppercase text-slate-400 tracking-widest">Nodes Identified</p>
                  <p className="text-8xl font-black text-emerald-600 leading-none tracking-tighter">{count}/45</p>
               </div>
               <div className="h-8 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner p-1">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_25px_rgba(16,185,129,0.5)]" style={{width: `${(count/45)*100}%`}}/>
               </div>
               <div className="flex gap-5 pt-6">
                  <button onClick={() => setActive(false)} className="flex-1 py-7 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95">Secure Session & Sync</button>
                  <button className="px-10 py-7 bg-slate-50 text-slate-400 rounded-[2.5rem] font-black uppercase text-[11px] hover:text-blue-600 transition-all active:scale-90"><RefreshCw size={24}/></button>
               </div>
            </div> 
         ) : ( 
            <button onClick={startHub} className="w-full py-8 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase text-xs shadow-3xl shadow-blue-500/30 hover:scale-[1.05] transition-all tracking-widest relative z-10 flex items-center justify-center gap-4 active:scale-95">
               <Compass size={28} className="animate-spin-slow" /> Initialize Master Broadcast Hub
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
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-3rem)] max-w-xl animate-in slide-in-from-top-24 duration-700">
      <div className="bg-white rounded-[4rem] shadow-4xl border-[6px] border-blue-50 p-12 flex flex-col items-center text-center space-y-10">
        <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center animate-bounce duration-1000 ${marked ? 'bg-emerald-50 text-emerald-600 shadow-2xl shadow-emerald-500/20' : 'bg-blue-50 text-blue-600 shadow-2xl shadow-blue-500/20'}`}>
          {marked ? <CheckCircle size={64} /> : <AlertCircle size={64} />}
        </div>
        <div className="space-y-4">
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{marked ? 'Hub Synchronized!' : 'Master Hub Detected!'}</h3>
          <p className="text-slate-500 font-medium text-lg mt-4 tracking-tight leading-relaxed">{marked ? 'Your academic presence is now globally synchronized with the university central ledger.' : `Authorized broadcast hub detected: Prof. ${session.instructor}. Do you wish to synchronize your identity?`}</p>
        </div>
        {!marked && (
           <button onClick={mark} className="w-full py-7 bg-blue-600 text-white font-black rounded-[2.5rem] shadow-3xl shadow-blue-500/30 flex items-center justify-center gap-4 hover:scale-105 transition-all uppercase tracking-widest text-[12px] active:scale-95">
              <ScanFace size={28} /> Confirm Synchronization
           </button>
        )}
      </div>
    </div>
  );
};
