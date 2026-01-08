import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Search, Play, Heart, Flame, Bot, MapPin, Send, User as UserIcon, Lock, 
  Mail, GraduationCap, Briefcase as BriefcaseIcon, LogOut, Plus, Users, 
  Calendar, FileText, Edit3, BookOpen, LayoutDashboard, MessageSquare, 
  Clock, ScanFace, CheckCircle, AlertCircle, PlaySquare, Image as ImageIcon, 
  Film, Save, Eye, Github, Linkedin, Network, Building, Zap, ArrowRight,
  TrendingUp, Globe, Smartphone, Laptop, Filter, Check, Camera, Upload,
  ExternalLink, ChevronRight, Book, Award, MoreVertical, FileUp, FileStack, Link as LinkIcon, FolderPlus, PlusCircle, ShieldAlert, Settings, PieChart, Trash2, Sliders, Palette, Target, BarChart3, Globe2, ShieldCheck, UserCheck, Activity, RefreshCw, Radio, Database
} from 'lucide-react';
import { User, UserRole, Video as VideoType, CampusBuilding, Course, CampusEvent, Job, NewsArticle, Applicant, Lecture, Module } from './types';
import { NAV_ITEMS, MOCK_BUILDINGS, MOCK_COURSES, MOCK_VIDEOS, MOCK_EVENTS, MOCK_NEWS, MOCK_JOBS } from './constants';
import { askUnistoneAI } from './services/gemini';

// --- Global Sync Pulse Tracker ---
// Simulates a backend synchronization pulse
type SyncStatus = 'synced' | 'syncing' | 'failed' | 'conflict';

// --- Global State Persistence with Sync Metadata ---
const useSyncedState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>, SyncStatus] => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  });
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');

  useEffect(() => {
    setSyncStatus('syncing');
    const timer = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(state));
      setSyncStatus('synced');
    }, 400); // Simulate network latency for sync
    return () => clearTimeout(timer);
  }, [key, state]);

  return [state, setState, syncStatus];
};

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
        background: linear-gradient(135deg, var(--brand-primary) 0%, ${primaryColor}CC 100%) !important;
      }
      .text-brand { color: var(--brand-primary) !important; }
      .bg-brand { background-color: var(--brand-primary) !important; }
      .border-brand { border-color: var(--brand-primary) !important; }
      .shadow-brand { box-shadow: 0 20px 40px -15px ${primaryColor}4D !important; }
      .active-nav { background-color: var(--brand-primary) !important; }
      .ring-brand { --tw-ring-color: var(--brand-primary) !important; }
      
      @keyframes pulse-ring {
        0% { transform: scale(0.33); opacity: 0.8; }
        80%, 100% { opacity: 0; }
      }
      .sync-pulse {
        position: relative;
      }
      .sync-pulse::before {
        content: '';
        position: absolute;
        left: -8px; top: -8px; right: -8px; bottom: -8px;
        border: 2px solid var(--brand-primary);
        border-radius: 50%;
        animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
      }
    `;
    const existing = document.getElementById('dynamic-theme');
    if (existing) existing.remove();
    document.head.appendChild(style);
  }, [primaryColor]);
  return null;
};

// --- Auth View ---
const AuthView = ({ onLogin, logo }: { onLogin: (user: User) => void; logo: string }) => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const email = (e.target as any).email.value;
    
    setTimeout(() => {
      const idPrefix = selectedRole === UserRole.ADMIN ? 'ADM' : (selectedRole === UserRole.FACULTY ? 'FAC' : 'STU');
      onLogin({
        id: `${idPrefix}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, 
        name: selectedRole === UserRole.ADMIN ? 'System Administrator' : (selectedRole === UserRole.FACULTY ? 'Faculty Member' : 'University Student'), 
        email: email || `${selectedRole}@unistone.edu`, 
        role: selectedRole,
        department: selectedRole === UserRole.ADMIN ? 'Administration' : 'Academic Core', 
        attendance: selectedRole === UserRole.ADMIN ? 100 : 92, 
        xp: selectedRole === UserRole.ADMIN ? 99999 : 5000, 
        streak: 5, 
        bio: `Authenticated as ${selectedRole.toUpperCase()}`,
        skills: ['Intelligence', 'Collaboration'], 
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRole}`,
        enrolledCourseIds: []
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
      <div className="w-full max-w-5xl bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white">
        <div className="md:w-5/12 p-16 text-white academic-gradient flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-xl overflow-hidden p-4">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase leading-none">UNISTONE</h1>
            <p className="text-[#F0E68C] text-xl font-medium tracking-tight opacity-90">Synchronized Campus OS</p>
          </div>
          <div className="relative z-10 space-y-4">
            <div className="p-6 bg-white/10 rounded-[2rem] backdrop-blur-md border border-white/20 text-[11px] font-black uppercase tracking-widest flex items-center gap-4">
              <ShieldCheck className="text-[#F0E68C]" /> Secured Sync Protocol
            </div>
            <p className="text-[10px] uppercase font-bold opacity-60 tracking-[0.2em]">Build 2.6.0-Reactive</p>
          </div>
        </div>

        <div className="md:w-7/12 p-16 bg-white flex flex-col justify-center">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4 uppercase leading-tight">Identity <span className="text-brand">Gateway</span></h2>
            <p className="text-slate-400 font-medium">Link your module profile to the central mesh.</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-10">
            {[UserRole.STUDENT, UserRole.FACULTY, UserRole.ADMIN].map(role => (
              <button 
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex flex-col items-center gap-2 py-4 rounded-[1.5rem] border-2 transition-all ${selectedRole === role ? 'bg-brand/5 border-brand text-brand shadow-brand' : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200'}`}
              >
                {role === UserRole.ADMIN ? <ShieldAlert size={20}/> : (role === UserRole.FACULTY ? <GraduationCap size={20}/> : <Users size={20}/>)}
                <span className="text-[10px] font-black uppercase tracking-widest">{role}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors" size={20} />
              <input name="email" type="email" required placeholder="University Identity" className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:border-brand focus:ring-4 ring-brand/5 transition-all font-bold" />
            </div>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors" size={20} />
              <input name="password" type="password" required placeholder="Pass Protocol" className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:border-brand focus:ring-4 ring-brand/5 transition-all font-bold" />
            </div>
            
            <button disabled={loading} className="w-full py-6 bg-brand text-white font-black rounded-3xl shadow-brand uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
              {loading ? 'Establishing Link...' : 'Synchronize Identity'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Authority Hub Shortcut</p>
            <button 
              onClick={() => {
                setSelectedRole(UserRole.ADMIN);
                setTimeout(() => {
                  (document.querySelector('form button') as HTMLButtonElement)?.click();
                }, 100);
              }} 
              className="px-8 py-3 bg-slate-50 text-slate-900 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-white transition-all inline-flex items-center gap-2"
            >
              Direct Admin Hub Access <ArrowRight size={14}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Module Sync Monitor ---
const SyncMonitor = ({ statuses }: { statuses: Record<string, SyncStatus> }) => {
  const allSynced = Object.values(statuses).every(s => s === 'synced');
  const syncing = Object.values(statuses).some(s => s === 'syncing');

  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm animate-in fade-in">
      <div className={`w-3 h-3 rounded-full ${syncing ? 'bg-brand animate-pulse' : (allSynced ? 'bg-emerald-500' : 'bg-red-500')}`} />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        {syncing ? 'Mesh Synchronizing...' : (allSynced ? 'Mesh Pulse Optimal' : 'Sync Latency Detected')}
      </span>
      {syncing && <RefreshCw size={14} className="animate-spin text-brand" />}
    </div>
  );
};

// --- Admin Components ---
const AdminSyncDashboard = ({ statuses }: { statuses: Record<string, SyncStatus> }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(statuses).map(([module, status]) => (
        <div key={module} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className={`p-4 rounded-2xl ${status === 'synced' ? 'bg-emerald-50 text-emerald-500' : 'bg-brand/10 text-brand'}`}>
              <Database size={20} />
            </div>
            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${status === 'synced' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand/10 text-brand animate-pulse'}`}>
              {status}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-black uppercase text-slate-900">{module}</h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cross-Module Repository</p>
          </div>
          <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${status === 'synced' ? 'w-full bg-emerald-500' : 'w-1/2 bg-brand animate-pulse'}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminCampusManager = ({ buildings, setBuildings }: any) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (e: React.MouseEvent) => {
    if (!editingId || !mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setBuildings(buildings.map((b: any) => 
      b.id === editingId ? { ...b, mapCoords: { top: `${y.toFixed(1)}%`, left: `${x.toFixed(1)}%` } } : b
    ));
  };

  return (
    <div className="space-y-12">
      <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm relative">
        <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-8 flex items-center gap-4"><MapPin className="text-brand"/> Mesh Topography Editor</h3>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">Reactive positioning updates reflect instantly across student and faculty navigation modules.</p>
        <div 
          ref={mapContainerRef}
          onClick={handleMapClick}
          className="h-[600px] bg-slate-50 rounded-[3rem] border border-slate-200 relative overflow-hidden cursor-crosshair shadow-inner"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 60 L60 0 M0 0 L60 60' stroke='%23000' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")` }} />
          {buildings.map((b: any) => (
            <div 
              key={b.id} 
              className={`absolute w-14 h-14 rounded-3xl flex items-center justify-center text-white border-4 border-white shadow-2xl transition-all -translate-x-1/2 -translate-y-1/2 ${editingId === b.id ? 'scale-125 z-50 ring-8 ring-brand/20 animate-pulse' : 'z-10'} ${b.color}`}
              style={{ top: b.mapCoords.top, left: b.mapCoords.left }}
              onClick={(e) => { e.stopPropagation(); setEditingId(b.id); }}
            >
              <Building size={24} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {buildings.map((b: any) => (
          <div 
            key={b.id} 
            onClick={() => setEditingId(b.id)}
            className={`bg-white p-8 rounded-[3rem] border-2 transition-all cursor-pointer group ${editingId === b.id ? 'border-brand shadow-brand scale-[1.02]' : 'border-slate-100 shadow-sm hover:border-slate-200'}`}
          >
            <div className="flex gap-6 items-center">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shrink-0 shadow-lg ${b.color}`}><Building size={24} /></div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-black uppercase truncate">{b.name}</h4>
                <div className="flex gap-4 mt-2">
                   <div className="flex flex-col"><p className="text-[8px] font-black uppercase text-slate-300">Top</p><p className="text-xs font-bold text-slate-900">{b.mapCoords.top}</p></div>
                   <div className="flex flex-col"><p className="text-[8px] font-black uppercase text-slate-300">Left</p><p className="text-xs font-bold text-slate-900">{b.mapCoords.left}</p></div>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setBuildings(buildings.filter((x: any) => x.id !== b.id)); }}
                className="p-3 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
              ><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
        <button 
          onClick={() => {
            const name = prompt("Enter Building Identity Name:");
            if (name) {
              const newB = { id: Math.random().toString(36).substr(2, 2).toUpperCase(), name, color: 'bg-brand', mapCoords: { top: '50%', left: '50%' }, floors: 1, departments: [], image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=600&h=400&fit=crop' };
              setBuildings([...buildings, newB]);
              setEditingId(newB.id);
            }
          }}
          className="py-10 border-4 border-dashed border-slate-100 rounded-[3.5rem] text-slate-300 hover:text-brand hover:border-brand/40 flex flex-col items-center justify-center gap-4 transition-all hover:bg-slate-50"
        >
          <PlusCircle size={36} />
          <p className="text-[11px] font-black uppercase tracking-[0.2em]">Deploy Building Node</p>
        </button>
      </div>
    </div>
  );
};

const AdminHub = ({ 
  buildings, setBuildings, 
  users, setUsers, 
  logo, setLogo, 
  primaryColor, setPrimaryColor,
  syncStatuses
}: any) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'campus' | 'registry' | 'pulse' | 'os'>('campus');
  const [selectedUserReport, setSelectedUserReport] = useState<User | null>(null);
  
  const handleToggleSuspend = (userId: string) => {
    setUsers(users.map((u: User) => u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u));
  };

  const handleAddUser = () => {
    const name = prompt("Personnel Full Name:");
    const role = prompt("Access Role (student/faculty/admin):") as UserRole;
    if (name && role) {
      setUsers([...users, {
        id: `${role.toUpperCase().substr(0, 3)}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        name,
        email: `${name.toLowerCase().replace(/\s/g, '.')}@unistone.edu`,
        role: role,
        department: "General Nodes",
        attendance: 100,
        xp: 0,
        streak: 0,
        enrolledCourseIds: [],
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      }]);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-7xl font-black uppercase tracking-tighter leading-none text-slate-900">Command <span className="text-brand">Center</span></h2>
          <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Master authority node for module synchronization and system governance.</p>
        </div>
        <div className="flex bg-white rounded-[2.5rem] p-2 border border-slate-100 shadow-xl overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'campus', label: 'Nodes', icon: <MapPin size={16}/> },
            { id: 'registry', label: 'Registry', icon: <Users size={16}/> },
            { id: 'pulse', label: 'Mesh Pulse', icon: <Activity size={16}/> },
            { id: 'os', label: 'OS Config', icon: <Settings size={16}/> }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-10 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shrink-0 ${activeAdminTab === tab.id ? 'bg-brand text-white shadow-brand' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeAdminTab === 'campus' && <AdminCampusManager buildings={buildings} setBuildings={setBuildings} />}

      {activeAdminTab === 'registry' && (
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900">Personnel Mesh</h3>
              <p className="text-xs font-bold text-slate-400 uppercase mt-2">Manage all active students, faculty, and administrators across synchronized modules.</p>
            </div>
            <button onClick={handleAddUser} className="px-10 py-5 bg-brand text-white rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center gap-3 shadow-brand hover:scale-105 transition-all">
              <PlusCircle size={22} /> Register Node
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50">
                  <th className="px-12 py-10">Identity Node</th>
                  <th className="px-12 py-10">Access Role</th>
                  <th className="px-12 py-10">Sync Integrtiy</th>
                  <th className="px-12 py-10 text-right">Mesh Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u: User) => (
                  <tr key={u.id} className={`group hover:bg-brand/[0.02] transition-colors ${u.isSuspended ? 'opacity-40 grayscale bg-red-50/20' : ''}`}>
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                        <img src={u.profileImage} className="w-16 h-16 rounded-[1.8rem] object-cover shadow-lg group-hover:scale-110 transition-transform ring-4 ring-white" />
                        <div>
                          <p className="text-lg font-black text-slate-900 uppercase leading-none">{u.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-2">{u.id} • {u.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${u.role === UserRole.FACULTY ? 'bg-blue-50 text-blue-600' : (u.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-600' : 'bg-brand/10 text-brand')}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-black text-slate-900 leading-none">{u.attendance}%</p>
                        <div className={`w-2 h-2 rounded-full ${u.attendance > 80 ? 'bg-emerald-500' : 'bg-brand animate-pulse'}`} />
                      </div>
                    </td>
                    <td className="px-12 py-10 text-right space-x-3">
                       <button 
                        onClick={() => setSelectedUserReport(u)}
                        className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-brand hover:text-white transition-all shadow-sm"
                      ><Target size={22}/></button>
                      <button 
                        onClick={() => handleToggleSuspend(u.id)}
                        className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${u.isSuspended ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-xl shadow-emerald-500/10' : 'bg-red-50 text-red-600 border-red-100 shadow-xl shadow-red-500/10'}`}
                      >
                        {u.isSuspended ? 'Enable' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAdminTab === 'pulse' && (
        <div className="space-y-12">
          <div className="bg-slate-900 p-16 rounded-[5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10 space-y-12">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4"><Radio className="text-brand animate-pulse"/> Global Mesh Pulse Monitor</h3>
                  <div className="flex gap-4">
                    <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest">Latency: 42ms</div>
                    <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">Bandwidth: 1.2 GB/s</div>
                  </div>
                </div>
                <AdminSyncDashboard statuses={syncStatuses} />
                <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10">
                   <h4 className="text-xl font-black uppercase tracking-tight mb-8">Synchronized Module Integrity</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        {['ERP Protocol', 'LMS Mesh', 'Career Gateway', 'Collaborative Hub'].map((mod, i) => (
                           <div key={mod} className="space-y-3">
                              <div className="flex justify-between items-end"><p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{mod}</p><p className="text-xs font-black text-emerald-400">SYNC OK</p></div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${95 + i}%` }} /></div>
                           </div>
                        ))}
                      </div>
                      <div className="flex flex-col justify-center items-center text-center p-10 bg-white/5 rounded-[3rem] border border-white/5">
                         <Activity size={80} className="text-brand mb-6 animate-pulse" />
                         <p className="text-5xl font-black">99.98%</p>
                         <p className="text-[10px] font-black uppercase text-slate-500 mt-2 tracking-widest">Uptime Probability</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'os' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-sm space-y-12">
            <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-4"><Palette className="text-brand"/> OS Interface Protocol</h3>
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Synchronized Brand HEX</label>
                <div className="flex gap-6 items-center">
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-24 h-24 rounded-[2rem] cursor-pointer border-8 border-slate-50 shadow-2xl overflow-hidden shrink-0" />
                  <div className="flex-1">
                    <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-black uppercase text-sm outline-none focus:border-brand shadow-inner" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Central Identity Logo URL</label>
                <input type="text" value={logo} onChange={e => setLogo(e.target.value)} className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold outline-none focus:border-brand shadow-inner" placeholder="https://..." />
              </div>
            </div>
          </div>
          <div className="bg-brand/5 border-4 border-dashed border-brand/20 p-20 rounded-[5rem] flex flex-col items-center justify-center text-center space-y-10 group relative">
            <div className="w-36 h-36 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl p-6 relative z-10">
              <img src={logo} className="w-full h-full object-contain" />
            </div>
            <div className="relative z-10">
              <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Identity Preview</h4>
              <p className="text-sm font-medium italic text-slate-500 mt-4 opacity-70">Synchronizing system identity across all terminal nodes.</p>
            </div>
            <div className="flex gap-6 relative z-10">
              <div className="w-16 h-16 bg-brand rounded-2xl shadow-brand ring-4 ring-white" />
              <div className="w-16 h-16 bg-brand/50 rounded-2xl ring-4 ring-white" />
              <div className="w-16 h-16 bg-brand/10 rounded-2xl ring-4 ring-white" />
            </div>
          </div>
        </div>
      )}

      {selectedUserReport && (
        <div className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-[5rem] overflow-hidden shadow-5xl border-[15px] border-brand/10 p-16 relative">
            <button onClick={() => setSelectedUserReport(null)} className="absolute top-10 right-10 p-4 bg-slate-50 rounded-full hover:bg-slate-100 transition-all"><X size={24}/></button>
            <div className="flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
              <img src={selectedUserReport.profileImage} className="w-48 h-48 rounded-[3.5rem] object-cover shadow-2xl border-8 border-white ring-1 ring-slate-100" />
              <div className="flex-1 space-y-4">
                <span className="px-5 py-2 bg-brand text-white text-[10px] font-black uppercase rounded-xl tracking-[0.2em]">{selectedUserReport.role} Mesh Identity</span>
                <h3 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedUserReport.name}</h3>
                <p className="text-xl font-medium italic text-slate-500">{selectedUserReport.department} • {selectedUserReport.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 mt-16">
              {[
                { label: 'Integrity', val: `${selectedUserReport.attendance}%`, icon: <CheckCircle/> },
                { label: 'Sync Energy', val: selectedUserReport.xp, icon: <Zap/> },
                { label: 'Node Streak', val: selectedUserReport.streak, icon: <Flame/> }
              ].map(stat => (
                <div key={stat.label} className="bg-slate-50 p-10 rounded-[3rem] text-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto text-brand shadow-sm">{stat.icon}</div>
                  <p className="text-4xl font-black text-slate-900">{stat.val}</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Realistic Map ---
const RealisticMap = ({ buildings }: { buildings: CampusBuilding[] }) => {
  const [selected, setSelected] = useState<CampusBuilding | null>(buildings[0]);
  const mapRef = useRef<HTMLDivElement>(null);
  
  const focusBuilding = (b: CampusBuilding) => {
    setSelected(b);
    if (mapRef.current) {
      const top = (parseFloat(b.mapCoords.top) / 100) * 2000 - mapRef.current.offsetHeight / 2;
      const left = (parseFloat(b.mapCoords.left) / 100) * 2000 - mapRef.current.offsetWidth / 2;
      mapRef.current.scrollTo({ top, left, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (selected) focusBuilding(selected);
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-7xl font-black uppercase tracking-tighter leading-none text-slate-900">Campus <span className="text-brand">Mesh</span></h2>
          <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Synchronized geographic topology of campus nodes.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 h-[70vh]">
        <div className="lg:col-span-3 bg-white rounded-[5rem] border border-slate-100 overflow-hidden shadow-inner relative map-viewport" ref={mapRef}>
          <div className="map-surface">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b0000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
            {buildings.map(b => (
              <div key={b.id} className={`map-pin ${selected?.id === b.id ? 'active' : ''}`} style={{ top: b.mapCoords.top, left: b.mapCoords.left }} onClick={() => setSelected(b)}>
                <div className={`w-16 h-16 ${b.color} rounded-[1.5rem] border-[6px] border-white shadow-2xl flex items-center justify-center text-white transition-all hover:scale-125 ${selected?.id === b.id ? 'selected-pin-pulse' : ''}`}>
                  <Building size={28} />
                </div>
                <div className="hover-card glass p-6 rounded-[2.5rem] shadow-brand">
                  <p className="text-[10px] font-black uppercase text-brand tracking-widest mb-1">Active Node</p>
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">{b.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-[5rem] border border-slate-100 shadow-sm p-10 flex flex-col gap-10 overflow-y-auto custom-scrollbar">
          {buildings.map(b => (
            <div key={b.id} onClick={() => focusBuilding(b)} className={`cursor-pointer group transition-all ${selected?.id === b.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
              <div className="h-40 rounded-[2.5rem] overflow-hidden mb-6 shadow-xl group-hover:shadow-brand transition-all">
                <img src={b.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={b.name} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{b.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{b.floors} Floors • {b.departments.length} Units</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Profile Hub ---
const ProfileHub = ({ user, setUser }: { user: User, setUser: (u: User) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio || '');
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSkill.trim()) return;
    const updatedSkills = [...(user.skills || []), newSkill.trim()];
    setUser({ ...user, skills: updatedSkills });
    setNewSkill('');
  };

  const handleSyncProfile = () => {
    setUser({ ...user, bio });
    setIsEditing(false);
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in">
      <div className="relative">
        <div className="h-64 academic-gradient rounded-[4rem] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none"><Network size={400} /></div>
        </div>
        <div className="absolute -bottom-16 left-16 flex items-end gap-10">
          <div className="relative group">
            <img src={user.profileImage} className="w-48 h-48 rounded-[3.5rem] border-[10px] border-white shadow-2xl object-cover" />
            <div className="absolute inset-0 bg-black/40 rounded-[3.5rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"><Camera className="text-white" size={32} /></div>
          </div>
          <div className="pb-8 space-y-2">
            <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">{user.name}</h2>
            <div className="flex items-center gap-4">
              <span className="px-5 py-2 bg-brand text-white text-[10px] font-black uppercase rounded-xl tracking-widest">{user.role}</span>
              <span className="text-slate-400 font-black uppercase text-xs tracking-widest italic">{user.department} Department</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-16">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-4"><Edit3 className="text-brand" size={24} /> Neural Summary</h3>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors"><Edit3 size={18}/></button>
              ) : (
                <button onClick={handleSyncProfile} className="px-6 py-2 bg-brand text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-brand hover:scale-105 transition-all">Sync Profile</button>
              )}
            </div>
            {isEditing ? (
              <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-3xl font-medium outline-none focus:border-brand transition-colors resize-none" placeholder="Enter your new bio protocol..." />
            ) : (
              <p className="text-xl text-slate-600 font-medium leading-relaxed italic">"{user.bio || 'Node active. Awaiting synchronization.'}"</p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'XP Pulse', value: user.xp, icon: <Zap fill="currentColor"/>, color: 'text-[#F0E68C]' },
              { label: 'Streak', value: user.streak, icon: <Flame fill="currentColor"/>, color: 'text-orange-500' },
              { label: 'Attendance', value: `${user.attendance}%`, icon: <CheckCircle/>, color: 'text-emerald-500' },
              { label: 'Projects', value: user.projects?.length || 0, icon: <FileStack/>, color: 'text-brand' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center space-y-3 group hover:border-[#F0E68C] transition-all">
                <div className={`mx-auto w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                <div><p className="text-2xl font-black text-slate-900">{stat.value}</p><p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sidebar ---
const Sidebar = ({ activeTab, setActiveTab, user, onLogout, logo }: any) => {
  const dynamicNav = useMemo(() => {
    let items = NAV_ITEMS.map(i => {
      if (i.id === 'edustone' && user.role === UserRole.FACULTY) return { ...i, label: 'My Courses' };
      return i;
    });
    if (user.role === UserRole.ADMIN) {
      items = [
        { id: 'admin', label: 'Command Center', icon: <ShieldAlert size={20} /> },
        ...items
      ];
    }
    return items.concat([{ id: 'tech-news', label: 'Tech Pulse', icon: <Globe size={20} /> }]);
  }, [user.role]);

  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-100 z-[900] flex flex-col p-10 hidden md:flex">
      <div className="flex items-center gap-5 mb-16">
        <div className="w-16 h-16 bg-white rounded-[1.2rem] flex items-center justify-center shadow-xl border border-slate-100 overflow-hidden">
          <img src={logo} className="w-full h-full object-contain p-2" />
        </div>
        <span className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">Unistone</span>
      </div>
      <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar no-scrollbar">
        {dynamicNav.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)} 
            className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all group ${activeTab === item.id ? 'active-nav text-white shadow-brand' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <div className={`${activeTab === item.id ? 'text-white' : 'text-slate-300 group-hover:text-brand'}`}>{item.icon}</div>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>
      <button onClick={onLogout} className="w-full flex items-center gap-5 px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-50 transition-all mt-10">
        <LogOut size={22} /> Disconnect Sync
      </button>
    </aside>
  );
};

// --- UNISTONE AI Component ---
const UnistoneAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await askUnistoneAI(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Neural sync interrupted. Please reconnect." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[1000]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 bg-brand text-white rounded-full shadow-brand flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        >
          <Bot size={32} className="group-hover:rotate-12 transition-transform" />
        </button>
      ) : (
        <div className="w-96 h-[32rem] bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10">
          <header className="p-8 bg-brand text-white flex justify-between items-center academic-gradient">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20"><Bot size={20}/></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Unistone AI</p>
                <p className="text-[9px] font-bold opacity-70 uppercase tracking-widest">Active Link</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={20}/></button>
          </header>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar scroll-smooth">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-brand"><Zap size={24}/></div>
                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Link Established. Awaiting Pulse.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[2rem] text-xs font-bold leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-brand text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 p-5 rounded-[2rem] rounded-tl-none border border-slate-100 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-brand/40 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-brand/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-brand/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Query the mesh..."
              className="flex-1 bg-white border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-brand transition-all shadow-inner"
            />
            <button type="submit" disabled={!input.trim() || loading} className="p-4 bg-brand text-white rounded-2xl shadow-brand hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// --- Main App Controller ---
export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('unistone-user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [logo, setLogo, logoSync] = useSyncedState('unistone-logo', 'https://colleges18.s3.ap-south-1.amazonaws.com/Sage_univ_indore_b02eee0e17.jpg');
  const [primaryColor, setPrimaryColor, colorSync] = useSyncedState('unistone-brand-color', '#8B0000');
  const [buildings, setBuildings, campusSync] = useSyncedState<CampusBuilding[]>('unistone-campus-nodes', MOCK_BUILDINGS);
  const [users, setUsers, registrySync] = useSyncedState<User[]>('unistone-user-registry', []);
  const [courses, setCourses, courseSync] = useSyncedState<Course[]>('unistone-courses-dynamic', MOCK_COURSES);
  const [events, setEvents, eventSync] = useSyncedState<CampusEvent[]>('unistone-events-dynamic', MOCK_EVENTS);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const syncStatuses: Record<string, SyncStatus> = {
    Campus: campusSync,
    Personnel: registrySync,
    Curriculum: courseSync,
    Timeline: eventSync,
    OS: colorSync
  };

  useEffect(() => {
    if (users.length === 0) {
      const initialUsers: User[] = [
        { id: 'ADM-1', name: 'System Admin', email: 'admin@unistone.edu', role: UserRole.ADMIN, department: 'Administration', attendance: 100, xp: 99999, streak: 99, enrolledCourseIds: [] },
        { id: 'FAC-301-A', name: 'Dr. Alan Turing', email: 'turing@unistone.edu', role: UserRole.FACULTY, department: 'CS', attendance: 95, xp: 50000, streak: 30, enrolledCourseIds: [] },
        { id: 'STU-2024-X', name: 'Sarah Connor', email: 'sarah@unistone.edu', role: UserRole.STUDENT, department: 'CS', attendance: 88, xp: 12400, streak: 12, enrolledCourseIds: [] }
      ];
      setUsers(initialUsers);
    }
  }, []);

  useEffect(() => { 
    if (user) {
      localStorage.setItem('unistone-user', JSON.stringify(user));
      if (user.role === UserRole.ADMIN && activeTab === 'dashboard') setActiveTab('admin');
    } else {
      localStorage.removeItem('unistone-user');
    }
  }, [user]);

  if (!user) return <AuthView onLogin={setUser} logo={logo} />;
  if (user.isSuspended) return (
    <div className="min-h-screen flex items-center justify-center academic-gradient p-12 text-white">
      <div className="max-w-xl text-center space-y-8 animate-in zoom-in-95">
        <ShieldAlert size={100} className="mx-auto text-[#F0E68C] animate-pulse" />
        <h2 className="text-6xl font-black uppercase tracking-tighter">Node Suspended</h2>
        <p className="text-xl font-medium italic opacity-80">Your synchronization privileges have been revoked by the core authority.</p>
        <button onClick={() => setUser(null)} className="px-12 py-5 bg-white text-brand rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-110 transition-all">Disconnect</button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'admin': return (
        <AdminHub 
          buildings={buildings} setBuildings={setBuildings} 
          users={users} setUsers={setUsers} 
          logo={logo} setLogo={setLogo} 
          primaryColor={primaryColor} setPrimaryColor={setPrimaryColor}
          syncStatuses={syncStatuses}
        />
      );
      case 'dashboard': return (
        <div className="space-y-16 pb-20 animate-in fade-in">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <h2 className="text-7xl font-black uppercase tracking-tighter leading-none text-slate-900">System <span className="text-brand">Feed</span></h2>
              <div className="flex gap-4">
                 <SyncMonitor statuses={syncStatuses} />
                 <p className="text-slate-500 font-medium italic text-sm tracking-tight leading-relaxed">Identity synchronized as <span className="text-brand font-black">{user.role.toUpperCase()}</span>.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center"><p className="text-3xl font-black text-slate-900">{user.streak}</p><p className="text-[10px] font-black uppercase text-slate-400 mt-1">Streak</p></div>
              <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center"><p className="text-3xl font-black text-brand">{user.attendance}%</p><p className="text-[10px] font-black uppercase text-slate-400 mt-1">Integrity</p></div>
            </div>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-slate-900 p-14 rounded-[5rem] text-white space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4 relative z-10"><TrendingUp className="text-[#F0E68C]" /> Neural Pulse</h3>
              <div className="space-y-6 relative z-10">
                {MOCK_NEWS.slice(0, 3).map(n => (
                  <div key={n.id} className="flex gap-6 group/item cursor-pointer">
                    <img src={n.image} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
                    <div className="flex flex-col justify-center">
                      <h4 className="font-black uppercase text-sm line-clamp-2 group-hover/item:text-brand transition-colors">{n.title}</h4>
                      <p className="text-[9px] font-black text-slate-400 mt-2">{n.source} • {n.readTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-14 rounded-[5rem] border border-slate-100 shadow-sm space-y-8">
               <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4 text-slate-900"><Calendar className="text-brand" /> Hub Events</h3>
               <div className="space-y-8 mt-6">
                 {events.slice(0, 4).map(e => (
                   <div key={e.id} className="flex items-center justify-between group cursor-pointer">
                     <div className="flex gap-6 items-center">
                       <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex flex-col items-center justify-center font-black">
                         <span className="text-[9px] uppercase leading-none">{e.date.split(' ')[0]}</span>
                         <span className="text-xl leading-none mt-1">{e.date.split(' ')[1]}</span>
                       </div>
                       <div>
                        <p className="font-black uppercase text-lg text-slate-900 group-hover:text-brand transition-colors leading-tight">{e.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{e.location} • {e.time}</p>
                       </div>
                     </div>
                     <ChevronRight className="text-slate-200 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      );
      case 'navigation': return <RealisticMap buildings={buildings} />;
      case 'profile': return <ProfileHub user={user} setUser={setUser} />;
      default: return <div className="p-20 text-center"><h2 className="text-5xl font-black uppercase text-slate-900">Module Synchronizing...</h2></div>;
    }
  };

  return (
    <div className="min-h-screen gradient-bg overflow-hidden flex">
      <ThemeProvider primaryColor={primaryColor} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser(null)} logo={logo} />
      <main className="flex-1 p-6 md:p-14 h-screen overflow-y-auto custom-scrollbar no-scrollbar scroll-smooth">
        {renderContent()}
      </main>
      <UnistoneAI />
    </div>
  );
}
