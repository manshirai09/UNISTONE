
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Search, Play, Heart, Flame, Bot, MapPin, Send, User as UserIcon, Lock, 
  Mail, GraduationCap, Briefcase as BriefcaseIcon, LogOut, Plus, Users, 
  Calendar, FileText, Edit3, BookOpen, LayoutDashboard, MessageSquare, 
  Clock, ScanFace, CheckCircle, AlertCircle, PlaySquare, Image as ImageIcon, 
  Film, Save, Eye, Github, Linkedin, Network, Building, Zap, ArrowRight,
  TrendingUp, Globe, Smartphone, Laptop, Filter, Check, Camera, Upload,
  ExternalLink, ChevronRight, Book, Award, MoreVertical, FileUp, FileStack, Link as LinkIcon, FolderPlus, PlusCircle, ShieldAlert, Settings, PieChart, Trash2, Sliders, Palette, Target, BarChart3, Globe2, ShieldCheck, UserCheck, Activity, RefreshCw, Radio, Database, Menu, Bell, Info
} from 'lucide-react';
import { User, UserRole, Video as VideoType, CampusBuilding, Course, CampusEvent, Job, NewsArticle, Applicant, Lecture, Module } from './types';
import { NAV_ITEMS, MOCK_BUILDINGS, MOCK_COURSES, MOCK_VIDEOS, MOCK_EVENTS, MOCK_NEWS, MOCK_JOBS } from './constants';
import { askUnistoneAI } from './services/gemini';

// --- Shared State Hook with Real-time Simulation ---
const useMeshSync = <T,>(key: string, initialValue: T): [T, (val: T) => void, SyncStatus] => {
  const [data, setData] = useState<T>(() => {
    const saved = localStorage.getItem(`unistone_${key}`);
    return saved ? JSON.parse(saved) : initialValue;
  });
  const [status, setStatus] = useState<SyncStatus>('synced');

  const updateData = (newVal: T) => {
    setStatus('syncing');
    setTimeout(() => {
      setData(newVal);
      localStorage.setItem(`unistone_${key}`, JSON.stringify(newVal));
      setStatus('synced');
      window.dispatchEvent(new CustomEvent('mesh-update', { detail: { key, newVal } }));
    }, 400);
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `unistone_${key}` && e.newValue) {
        setData(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  return [data, updateData, status];
};

type SyncStatus = 'synced' | 'syncing' | 'failed' | 'conflict';

// --- Dynamic Theme Injector ---
const ThemeProvider = ({ primaryColor }: { primaryColor: string }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'dynamic-theme';
    style.innerHTML = `
      :root {
        --brand-primary: ${primaryColor};
        --brand-soft: ${primaryColor}1A;
        --brand-mid: ${primaryColor}80;
      }
      .academic-gradient {
        background: linear-gradient(135deg, var(--brand-primary) 0%, #000 150%) !important;
      }
      .text-brand { color: var(--brand-primary) !important; }
      .bg-brand { background-color: var(--brand-primary) !important; }
      .border-brand { border-color: var(--brand-primary) !important; }
      .shadow-brand { box-shadow: 0 20px 40px -15px ${primaryColor}4D !important; }
    `;
    const existing = document.getElementById('dynamic-theme');
    if (existing) existing.remove();
    document.head.appendChild(style);
  }, [primaryColor]);
  return null;
};

const SyncIndicator = ({ statuses }: { statuses: Record<string, SyncStatus> }) => {
  const isSyncing = Object.values(statuses).some(s => s === 'syncing');
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm">
      <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-brand animate-pulse' : 'bg-emerald-500'}`} />
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 hidden sm:inline">
        {isSyncing ? 'Syncing Mesh' : 'Mesh Online'}
      </span>
    </div>
  );
};

// --- Sub-Components ---

const AdminHub = ({ buildings, setBuildings, events, setEvents, jobs, setJobs, news, setNews }: any) => {
  const [activeSubTab, setActiveSubTab] = useState('overview');

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-6xl font-black uppercase tracking-tighter text-slate-900 leading-none">Command <span className="text-brand">Hub</span></h2>
          <p className="text-slate-400 font-bold mt-4 uppercase tracking-[0.2em] text-xs italic">Central Authority Mesh Interface</p>
        </div>
        <div className="flex gap-2">
          {['overview', 'campus', 'events', 'careers'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveSubTab(tab)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
            <PieChart className="text-brand" size={32} />
            <h4 className="text-4xl font-black text-slate-900">{buildings.length}</h4>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Campus Nodes</p>
          </div>
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
            <Calendar className="text-blue-500" size={32} />
            <h4 className="text-4xl font-black text-slate-900">{events.length}</h4>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Upcoming Pulse Events</p>
          </div>
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
            <BriefcaseIcon className="text-emerald-500" size={32} />
            <h4 className="text-4xl font-black text-slate-900">{jobs.length}</h4>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Open Career Slots</p>
          </div>
        </div>
      )}

      {activeSubTab === 'campus' && (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
           <div className="flex justify-between items-center">
             <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Building Nodes</h3>
             <button className="p-4 bg-brand text-white rounded-2xl shadow-brand hover:scale-105 transition-all"><Plus size={20}/></button>
           </div>
           <div className="space-y-4">
             {buildings.map((b: CampusBuilding) => (
               <div key={b.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                 <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 ${b.color} rounded-2xl shadow-lg border-4 border-white flex items-center justify-center text-white`}>
                      <Building size={24} />
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-slate-900">{b.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.departments.join(', ')}</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-3 bg-white text-slate-400 rounded-xl hover:text-brand transition-colors"><Edit3 size={18}/></button>
                    <button className="p-3 bg-white text-slate-400 rounded-xl hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

const VideoHub = ({ videos }: { videos: VideoType[] }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-6xl font-black uppercase tracking-tighter text-slate-900 leading-none">Video <span className="text-brand">Mesh</span></h2>
          <p className="text-slate-400 font-bold mt-4 uppercase tracking-[0.2em] text-xs">Knowledge Streams & Projects</p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-2xl hover:bg-brand transition-all">
          <Upload size={18} /> Upload Stream
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {videos.map(video => (
          <div key={video.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:-translate-y-2 transition-all">
             <div className="aspect-[9/16] relative overflow-hidden bg-slate-100">
                <img src={video.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 space-y-4">
                   <div className="flex items-center gap-3">
                      <img src={video.uploaderImage} className="w-10 h-10 rounded-xl border-2 border-white/20 object-cover" alt="" />
                      <div>
                        <p className="text-white text-[11px] font-black uppercase tracking-wider">{video.uploadedBy}</p>
                        <p className="text-white/60 text-[9px] font-bold uppercase">{video.uploaderRole}</p>
                      </div>
                   </div>
                   <h4 className="text-white font-black text-lg leading-tight line-clamp-2">{video.title}</h4>
                </div>
                <div className="absolute top-6 right-6 p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                   <Play size={20} fill="currentColor" />
                </div>
             </div>
             <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-red-500 transition-colors">
                      <Heart size={16} /> <span className="text-[10px] font-black">{video.likes}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-slate-400">
                      <Eye size={16} /> <span className="text-[10px] font-black">{video.views}</span>
                   </div>
                </div>
                <span className="text-[9px] font-black uppercase text-slate-300 tracking-tighter">{video.createdAt}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EdustoneHub = ({ courses, user }: { courses: Course[]; user: User }) => {
  return (
    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
       <header>
          <h2 className="text-6xl font-black uppercase tracking-tighter text-slate-900 leading-none">Edustone <span className="text-brand">Hub</span></h2>
          <p className="text-slate-400 font-bold mt-4 uppercase tracking-[0.2em] text-xs">Synchronized Learning Matrix</p>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {courses.map(course => (
            <div key={course.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8 group hover:border-brand transition-all cursor-pointer">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <span className="px-3 py-1 bg-brand text-white text-[9px] font-black uppercase rounded-lg tracking-widest">{course.code}</span>
                       <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Core Module</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-brand transition-colors uppercase tracking-tight">{course.name}</h3>
                  </div>
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-brand group-hover:scale-110 transition-all">
                    <BookOpen size={28} />
                  </div>
               </div>
               
               <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6">
                 "{course.description}"
               </p>

               <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                     <img src={course.instructorImage} className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                     <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Instructor</p>
                        <p className="text-xs font-black text-slate-900">{course.instructor}</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-slate-400">Resources</p>
                        <p className="text-xs font-black text-slate-900">{course.notesCount} Files</p>
                     </div>
                     <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-brand transition-colors">
                        <ArrowRight size={18} />
                     </div>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

const CareerMesh = ({ jobs }: { jobs: Job[] }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
       <header>
          <h2 className="text-6xl font-black uppercase tracking-tighter text-slate-900 leading-none">Career <span className="text-brand">Mesh</span></h2>
          <p className="text-slate-400 font-bold mt-4 uppercase tracking-[0.2em] text-xs">Node Placement Synchronization</p>
       </header>

       <div className="space-y-6">
         {jobs.map(job => (
           <div key={job.id} className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 group hover:shadow-2xl transition-all hover:border-brand/20">
              <div className="flex items-center gap-8 w-full md:w-auto">
                 <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 group-hover:text-brand transition-colors">
                   <BriefcaseIcon size={32} />
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{job.company}</span>
                       <span className={`px-3 py-1 text-[8px] font-black uppercase rounded-lg tracking-widest ${job.type === 'internship' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'}`}>
                         {job.type}
                       </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-brand transition-colors">{job.title}</h3>
                    <div className="flex gap-2">
                       {job.tags.map(tag => (
                         <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-400 text-[8px] font-black uppercase rounded-md tracking-widest">#{tag}</span>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase text-slate-400">Package Sync</p>
                    <p className="text-lg font-black text-slate-900 tracking-tighter">{job.salary || 'N/A'}</p>
                 </div>
                 <button className="px-10 py-5 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl group-hover:bg-brand transition-all shadow-xl">
                   Connect Node
                 </button>
              </div>
           </div>
         ))}
       </div>
    </div>
  );
};

const CampusMesh = ({ buildings }: { buildings: CampusBuilding[] }) => {
  return (
    <div className="space-y-12 animate-in zoom-in-95 duration-700">
       <header>
          <h2 className="text-6xl font-black uppercase tracking-tighter text-slate-900 leading-none">Campus <span className="text-brand">Mesh</span></h2>
          <p className="text-slate-400 font-bold mt-4 uppercase tracking-[0.2em] text-xs">Spatial Node Topology</p>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 relative aspect-video bg-slate-50 rounded-[4rem] border-4 border-white shadow-2xl overflow-hidden group">
             {/* Simple interactive map representation */}
             <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Network size={1000} className="text-brand -translate-x-1/4 -translate-y-1/4" />
             </div>
             {buildings.map(b => (
               <div key={b.id} 
                    style={{ top: b.mapCoords.top, left: b.mapCoords.left }} 
                    className={`absolute w-12 h-12 ${b.color} rounded-2xl border-4 border-white shadow-xl cursor-pointer hover:scale-150 hover:z-50 transition-all flex items-center justify-center text-white group/pin`}>
                 <MapPin size={16} />
                 <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-3 rounded-xl text-[9px] font-black uppercase whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity">
                   {b.name}
                 </div>
               </div>
             ))}
          </div>
          <div className="space-y-6">
             <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 flex items-center gap-3"><Info size={20}/> Mesh Directory</h3>
             <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {buildings.map(b => (
                  <div key={b.id} className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-brand transition-all group cursor-pointer shadow-sm">
                     <div className="flex items-center gap-4 mb-3">
                        <div className={`w-10 h-10 ${b.color} rounded-xl flex items-center justify-center text-white`}><Building size={18}/></div>
                        <h4 className="font-black uppercase text-slate-900 leading-none">{b.name}</h4>
                     </div>
                     <p className="text-[10px] text-slate-400 font-medium line-clamp-2 italic">"{b.description}"</p>
                     <div className="mt-4 flex flex-wrap gap-2">
                        {b.facilities.map(f => (
                          <span key={f} className="px-3 py-1 bg-slate-50 text-[8px] font-black uppercase rounded-lg text-slate-400">{f}</span>
                        ))}
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

// --- Main App with Mesh Synchronization ---

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('unistone-user');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Central Mesh Synchronization States
  const [logo, setLogo, logoSync] = useMeshSync('logo', 'https://colleges18.s3.ap-south-1.amazonaws.com/Sage_univ_indore_b02eee0e17.jpg');
  const [primaryColor, setPrimaryColor, colorSync] = useMeshSync('brand-color', '#8B0000');
  const [buildings, setBuildings, campusSync] = useMeshSync('campus-nodes', MOCK_BUILDINGS);
  const [events, setEvents, eventSync] = useMeshSync('events-timeline', MOCK_EVENTS);
  const [jobs, setJobs, jobSync] = useMeshSync('career-slots', MOCK_JOBS);
  const [news, setNews, newsSync] = useMeshSync('news-mesh', MOCK_NEWS);
  const [courses, setCourses, courseSync] = useMeshSync('course-matrix', MOCK_COURSES);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Identity verified. I am UNISTONE AI. How can I assist your session in the campus grid?' }
  ]);
  const [aiInput, setAiInput] = useState('');

  const meshStatuses: Record<string, SyncStatus> = {
    Campus: campusSync,
    Timeline: eventSync,
    Careers: jobSync,
    News: newsSync,
    Courses: courseSync,
    Visual: colorSync
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('unistone-user', JSON.stringify(user));
      if (user.role === UserRole.ADMIN && activeTab === 'dashboard') setActiveTab('admin');
    } else {
      localStorage.removeItem('unistone-user');
    }
  }, [user]);

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const userText = aiInput;
    setAiMessages(prev => [...prev, { role: 'user', text: userText }]);
    setAiInput('');
    setAiLoading(true);
    const response = await askUnistoneAI(userText);
    setAiMessages(prev => [...prev, { role: 'bot', text: response }]);
    setAiLoading(false);
  };

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center gradient-bg p-6 overflow-hidden">
        <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl text-center space-y-10 max-w-xl w-full border border-white animate-in zoom-in-95 duration-500">
            <div className="w-28 h-28 bg-brand rounded-[2.5rem] mx-auto flex items-center justify-center text-white shadow-brand animate-pulse">
                <ShieldCheck size={56}/>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">UNISTONE MESH</h1>
              <p className="text-slate-400 font-medium text-lg">Identity gateway to the synchronized campus grid.</p>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <button onClick={() => setUser({ id: 'ADM-01', name: 'Admin Master', email: 'admin@unistone.edu', role: UserRole.ADMIN, department: 'System Architecture', attendance: 100, xp: 99999, streak: 365, profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', enrolledCourseIds: [], projects: [], skills: ['Root', 'Mesh'] })} className="flex-1 py-6 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-3xl hover:scale-105 transition-all">Admin Link</button>
                <button onClick={() => setUser({ id: 'STU-01', name: 'Alex Node', email: 'alex@unistone.edu', role: UserRole.STUDENT, department: 'CS', attendance: 88, xp: 2400, streak: 12, bio: 'Student at UNISTONE Engineering.', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', enrolledCourseIds: ['c1'], projects: [], skills: ['React', 'Sync'] })} className="flex-1 py-6 bg-brand text-white font-black uppercase text-[10px] tracking-widest rounded-3xl shadow-brand hover:scale-105 transition-all">Student Link</button>
              </div>
              <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.2em]">Build 3.0.0 Stable // Encrypted Node Access</p>
            </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return (
        <div className="space-y-12 animate-in fade-in duration-700">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-slate-900">System <span className="text-brand">Node</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] mt-4 text-xs italic">Identity: {user.name}</p>
            </div>
            <div className="flex gap-4">
              <div className="px-10 py-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                <p className="text-4xl font-black text-slate-900">{user.streak}</p>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Daily Pulse</p>
              </div>
              <div className="px-10 py-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                <p className="text-4xl font-black text-brand">{user.attendance}%</p>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Integrity Score</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl animate-pulse" />
               <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4 text-[#F0E68C]"><Radio size={24}/> Network Pulse</h3>
               <div className="space-y-6">
                 {news.slice(0, 3).map(n => (
                   <div key={n.id} className="flex gap-6 group/news cursor-pointer">
                      <img src={n.image} className="w-20 h-20 rounded-2xl object-cover grayscale group-hover/news:grayscale-0 transition-all" alt="" />
                      <div className="flex flex-col justify-center">
                         <h4 className="font-black uppercase text-sm leading-tight group-hover/news:text-brand transition-colors">{n.title}</h4>
                         <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-widest">{n.source} • {n.readTime}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-8">
               <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4 text-slate-900"><Calendar className="text-brand"/> Timeline Mesh</h3>
               <div className="space-y-8">
                 {events.slice(0, 3).map(e => (
                   <div key={e.id} className="flex items-center justify-between group cursor-pointer border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                      <div className="flex gap-6 items-center">
                        <div className="w-16 h-16 bg-brand/5 text-brand rounded-2xl flex flex-col items-center justify-center font-black">
                           <span className="text-[9px] uppercase leading-none">{e.date.split(' ')[0]}</span>
                           <span className="text-xl leading-none mt-1">{e.date.split(' ')[1]}</span>
                        </div>
                        <div>
                           <p className="font-black uppercase text-lg text-slate-900 group-hover:text-brand transition-colors leading-tight">{e.title}</p>
                           <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{e.location}</p>
                        </div>
                      </div>
                      <ChevronRight className="text-slate-200 group-hover:text-brand transition-all" />
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      );
      case 'profile': return <div className="animate-in slide-in-from-bottom-10 duration-700"><ProfileHub user={user} setUser={setUser} /></div>;
      case 'admin': return <AdminHub buildings={buildings} setBuildings={setBuildings} events={events} setEvents={setEvents} jobs={jobs} setJobs={setJobs} news={news} setNews={setNews} />;
      case 'videohub': return <VideoHub videos={MOCK_VIDEOS} />;
      case 'edustone': return <EdustoneHub courses={courses} user={user} />;
      case 'careers': return <CareerMesh jobs={jobs} />;
      case 'navigation': return <CampusMesh buildings={buildings} />;
      default: return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
          <Bot size={120} className="text-slate-100 animate-bounce" />
          <h2 className="text-4xl font-black uppercase text-slate-200 tracking-tighter">Module Synchronizing...</h2>
        </div>
      );
    }
  };

  return (
    <div className="flex w-full h-screen gradient-bg overflow-hidden relative">
      <ThemeProvider primaryColor={primaryColor} />
      
      {/* Sidebar - Enhanced for Admin Access */}
      <aside className={`fixed top-0 left-0 h-full w-80 bg-white border-r border-slate-100 z-[900] flex flex-col p-8 transition-transform duration-500 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} shadow-2xl md:shadow-none`}>
        <div className="flex items-center gap-5 mb-14 px-2">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-50 overflow-hidden p-3">
            <img src={logo} className="w-full h-full object-contain" alt="Logo" />
          </div>
          <span className="text-2xl font-black uppercase tracking-tighter text-slate-900">UNISTONE</span>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map((item) => (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} 
              className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all group ${activeTab === item.id ? 'bg-brand text-white shadow-brand scale-[1.03]' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <div className={`${activeTab === item.id ? 'text-white' : 'text-slate-300 group-hover:text-brand'}`}>{item.icon}</div>
              <span>{item.label}</span>
            </button>
          ))}
          {user.role === UserRole.ADMIN && (
            <button 
              onClick={() => { setActiveTab('admin'); setSidebarOpen(false); }} 
              className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all group ${activeTab === 'admin' ? 'bg-slate-900 text-white shadow-2xl scale-[1.03]' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <ShieldAlert className={`${activeTab === 'admin' ? 'text-white' : 'text-slate-300'}`} />
              <span>Command Hub</span>
            </button>
          )}
        </nav>
        
        <div className="mt-8 pt-8 border-t border-slate-50">
          <button onClick={() => setUser(null)} className="w-full flex items-center gap-5 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} /> Disconnect Mesh
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 md:ml-80 relative overflow-hidden">
        <header className="h-24 flex items-center justify-between px-6 md:px-14 bg-white/60 backdrop-blur-xl sticky top-0 z-[100] border-b border-slate-50/50">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-3 bg-slate-100 text-slate-900 rounded-2xl"><Menu size={24} /></button>
          <div className="hidden lg:flex items-center gap-5 px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl w-full max-w-lg transition-all focus-within:ring-4 ring-brand/5">
            <Search size={16} className="text-slate-300" />
            <input type="text" placeholder="Query the campus grid..." className="bg-transparent border-none outline-none font-bold text-[10px] uppercase tracking-widest w-full text-slate-900 placeholder:text-slate-300" />
          </div>
          <div className="flex items-center gap-6">
             <SyncIndicator statuses={meshStatuses} />
             <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveTab('profile')}>
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-black uppercase text-brand tracking-widest leading-none mb-1">{user.role}</p>
                  <p className="text-xs font-black text-slate-900 truncate max-w-[120px]">{user.name}</p>
                </div>
                <img src={user.profileImage} className="w-12 h-12 rounded-2xl border-4 border-white shadow-xl group-hover:scale-110 transition-transform" alt="" />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-14">
          <div className="max-w-7xl mx-auto w-full pb-20">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Persistent AI Assistant Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-[2000] transition-transform duration-700 border-l border-slate-100 ${aiModalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="h-full flex flex-col p-10">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Sentient <span className="text-brand">Core</span></h3>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1 italic">UNISTONE AI v4.0.2</p>
               </div>
               <button onClick={() => setAiModalOpen(false)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-red-500 transition-all"><X size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-6 mb-8">
               {aiMessages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-brand text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'}`}>
                       {msg.text}
                    </div>
                 </div>
               ))}
               {aiLoading && (
                 <div className="flex justify-start">
                    <div className="bg-slate-50 p-6 rounded-[2rem] rounded-tl-none border border-slate-100 flex gap-2">
                       <div className="w-2 h-2 bg-brand/40 rounded-full animate-bounce" />
                       <div className="w-2 h-2 bg-brand/60 rounded-full animate-bounce delay-100" />
                       <div className="w-2 h-2 bg-brand rounded-full animate-bounce delay-200" />
                    </div>
                 </div>
               )}
            </div>

            <div className="relative">
               <input 
                 type="text" 
                 value={aiInput}
                 onChange={e => setAiInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleAiSend()}
                 placeholder="Enter mesh protocol query..." 
                 className="w-full py-6 px-8 bg-slate-50 border border-slate-100 rounded-3xl font-black text-[11px] uppercase tracking-widest outline-none focus:border-brand transition-all pr-20" 
               />
               <button onClick={handleAiSend} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-brand text-white rounded-2xl shadow-brand hover:scale-105 transition-all">
                 <Send size={18} />
               </button>
            </div>
         </div>
      </div>

      {/* AI Floating Toggle */}
      <button 
        onClick={() => setAiModalOpen(true)}
        className="fixed bottom-10 right-10 w-24 h-24 bg-brand text-white rounded-[2.5rem] shadow-brand flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-[1500] group overflow-hidden"
      >
        <Bot size={44} className="group-hover:rotate-12 transition-transform duration-500" />
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
}

// --- Corrected Profile Hub with No Overlap ---
const ProfileHub = ({ user, setUser }: { user: User; setUser: (u: User) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio || '');

  return (
    <div className="space-y-12 pb-12">
      <div className="relative group">
        <div className="h-64 md:h-80 academic-gradient rounded-[4rem] relative overflow-hidden flex items-center justify-center shadow-2xl">
           <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none"><Network size={500} /></div>
           <h2 className="text-[12rem] font-black text-white/5 uppercase tracking-tighter absolute select-none pointer-events-none">NODE {user.id.split('-')[1] || 'MASTER'}</h2>
        </div>
        
        <div className="px-16 -mt-24 relative z-20">
          <div className="flex flex-col md:flex-row items-end gap-12">
            <div className="relative shrink-0 shadow-2xl rounded-[4.5rem] border-[15px] border-white overflow-hidden bg-white">
              <img src={user.profileImage} className="w-56 h-56 object-cover" alt="Profile" />
            </div>
            <div className="pb-10 flex-1">
               <div className="flex items-center gap-4 mb-2">
                 <h3 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">{user.name}</h3>
                 <span className="px-4 py-1.5 bg-brand text-white text-[10px] font-black uppercase rounded-lg tracking-widest">{user.role}</span>
               </div>
               <p className="text-slate-400 font-bold uppercase text-sm tracking-[0.3em] italic">{user.department} Department • {user.email}</p>
            </div>
            <div className="flex items-center gap-4 pb-10">
               <button className="px-10 py-5 bg-brand text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-brand hover:scale-105 transition-all">Export Node Logs</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-4"><Edit3 className="text-brand" /> Neural Summary</h4>
              <button onClick={() => setIsEditing(!isEditing)} className="p-3 text-slate-300 hover:text-brand transition-colors"><PlusCircle size={24}/></button>
            </div>
            <p className="text-2xl text-slate-600 font-medium leading-relaxed italic border-l-8 border-brand/10 pl-8">
              "{user.bio || 'Core node active. Identity mesh established. My digital footprint at UNISTONE is synced and secured.'}"
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Sync XP', value: user.xp, icon: <Zap />, color: 'text-brand' },
              { label: 'Active Streak', value: user.streak, icon: <Flame />, color: 'text-orange-500' },
              { label: 'Integrity', value: `${user.attendance}%`, icon: <ShieldCheck />, color: 'text-emerald-500' },
              { label: 'Projects', value: user.projects?.length || 0, icon: <FileStack />, color: 'text-blue-500' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center space-y-3 hover:border-brand transition-all">
                <div className={`mx-auto w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
                <div>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-10">
           <div className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-8">
              <h4 className="text-xl font-black uppercase tracking-widest text-[#F0E68C] flex items-center gap-4"><Sliders size={20}/> Mesh Matrix</h4>
              <div className="flex flex-wrap gap-3">
                 {['Neural Sync', 'Logic Nodes', 'Mesh Protocol', 'Core Architecture'].map(skill => (
                   <span key={skill} className="px-4 py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5">{skill}</span>
                 ))}
              </div>
           </div>
           <div className="bg-brand/5 border-2 border-dashed border-brand/20 p-10 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-brand"><Database size={32}/></div>
              <p className="text-sm font-black uppercase tracking-tighter text-slate-900">Module Synced</p>
              <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">Build 3.0.0 Stable</p>
           </div>
        </div>
      </div>
    </div>
  );
};
