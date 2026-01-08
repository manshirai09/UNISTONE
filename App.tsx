import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Search, Play, Heart, Flame, Bot, MapPin, Send, User as UserIcon, Lock, 
  Mail, GraduationCap, Briefcase as BriefcaseIcon, LogOut, Plus, Users, 
  Calendar, FileText, Edit3, BookOpen, LayoutDashboard, MessageSquare, 
  Clock, ScanFace, CheckCircle, AlertCircle, PlaySquare, Image as ImageIcon, 
  Film, Save, Eye, Github, Linkedin, Network, Building, Zap, ArrowRight,
  TrendingUp, Globe, Smartphone, Laptop, Filter, Check, Camera, Upload,
  ExternalLink, ChevronRight, Book, Award, MoreVertical, FileUp, FileStack, Link as LinkIcon, FolderPlus, PlusCircle, ShieldAlert, Settings, PieChart, Trash2, Sliders, Palette, Target, BarChart3, Globe2
} from 'lucide-react';
import { User, UserRole, Video as VideoType, CampusBuilding, Course, CampusEvent, Job, NewsArticle, Applicant, Lecture, Module } from './types';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const email = (e.target as any).email.value;
    
    setTimeout(() => {
      const emailLower = email.toLowerCase();
      const isFaculty = emailLower.includes('faculty');
      const isAdmin = emailLower.includes('admin');
      
      onLogin({
        id: isAdmin ? 'ADMIN-CORE' : (isFaculty ? 'FAC-301-A' : 'STU-2024-X'), 
        name: isAdmin ? 'System Admin' : (isFaculty ? 'Dr. Alan Turing' : 'Sarah Connor'), 
        email: email, 
        role: isAdmin ? UserRole.ADMIN : (isFaculty ? UserRole.FACULTY : UserRole.STUDENT),
        department: isAdmin ? 'Administration' : 'CS', 
        attendance: isAdmin ? 100 : 88, 
        xp: isAdmin ? 99999 : 12400, 
        streak: 12, 
        bio: isAdmin ? 'Core System Overseer' : 'Synchronizing intelligence nodes.',
        skills: isAdmin ? ['Security', 'Logistics'] : ['React', 'Python', 'AI'], 
        profileImage: isAdmin ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop' : (isFaculty ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop'),
        enrolledCourseIds: isFaculty ? ['c1', 'c2'] : []
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
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="email" type="email" required placeholder="Email (use 'admin' or 'faculty' for roles)" className="w-full pl-14 pr-6 py-4 bg-slate-50 border rounded-2xl outline-none focus:border-brand" />
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="password" type="password" required placeholder="Credential" className="w-full pl-14 pr-6 py-4 bg-slate-50 border rounded-2xl outline-none focus:border-brand" />
            </div>
            <button disabled={loading} className="w-full py-5 bg-brand text-white font-black rounded-2xl shadow-xl uppercase text-[11px] tracking-widest hover:opacity-90 transition-all">
              {loading ? 'Synchronizing...' : 'Establish Connection'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Admin Hub Components ---

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

  const selectedBuilding = buildings.find((b: any) => b.id === editingId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-8">
        <div className="bg-white p-8 rounded-[4rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Live Node Mesh</h3>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Click on map to position selected building</p>
          </div>
          <div 
            ref={mapContainerRef}
            onClick={handleMapClick}
            className="h-[500px] bg-slate-50 rounded-[3rem] border border-slate-100 relative overflow-hidden cursor-crosshair"
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40 L40 0 M0 0 L40 40' stroke='%23000' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")` }} />
            {buildings.map((b: any) => (
              <div 
                key={b.id} 
                className={`absolute w-12 h-12 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-xl transition-all -translate-x-1/2 -translate-y-1/2 ${editingId === b.id ? 'scale-125 z-50 ring-4 ring-brand animate-pulse' : 'z-10'} ${b.color}`}
                style={{ top: b.mapCoords.top, left: b.mapCoords.left }}
                onClick={(e) => { e.stopPropagation(); setEditingId(b.id); }}
              >
                <Building size={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-4 space-y-8 h-[600px] overflow-y-auto custom-scrollbar pr-2">
        {buildings.map((b: any) => (
          <div 
            key={b.id} 
            onClick={() => setEditingId(b.id)}
            className={`bg-white p-8 rounded-[3rem] border transition-all cursor-pointer group ${editingId === b.id ? 'border-brand shadow-brand ring-1 ring-brand' : 'border-slate-100 hover:border-slate-200 shadow-sm'}`}
          >
            <div className="flex gap-6 items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 ${b.color}`}><Building size={28} /></div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-black uppercase truncate">{b.name}</h4>
                <div className="flex gap-4 mt-1">
                  <span className="text-[9px] font-black uppercase text-slate-400">T: {b.mapCoords.top}</span>
                  <span className="text-[9px] font-black uppercase text-slate-400">L: {b.mapCoords.left}</span>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setBuildings(buildings.filter((x: any) => x.id !== b.id)); }}
                className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
            {editingId === b.id && (
              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 animate-in slide-in-from-top-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400">Building Image</label>
                  <input 
                    type="text" 
                    value={b.image} 
                    onChange={(e) => setBuildings(buildings.map((x: any) => x.id === b.id ? { ...x, image: e.target.value } : x))}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-brand"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400">Floors</label>
                    <input 
                      type="number" 
                      value={b.floors} 
                      onChange={(e) => setBuildings(buildings.map((x: any) => x.id === b.id ? { ...x, floors: parseInt(e.target.value) } : x))}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400">Theme Class</label>
                    <input 
                      type="text" 
                      value={b.color} 
                      onChange={(e) => setBuildings(buildings.map((x: any) => x.id === b.id ? { ...x, color: e.target.value } : x))}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-brand"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <button 
          onClick={() => {
            const name = prompt("Node Identifier:");
            if (name) setBuildings([...buildings, { 
              id: Math.random().toString(36).substr(2, 4).toUpperCase(),
              name,
              color: 'bg-brand',
              mapCoords: { top: '50%', left: '50%' },
              floors: 1,
              departments: [],
              facilities: [],
              image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=600&h=400&fit=crop'
            }]);
          }}
          className="w-full py-8 border-4 border-dashed border-slate-100 rounded-[3rem] text-slate-300 hover:text-brand hover:border-brand/40 flex flex-col items-center justify-center gap-4 transition-all"
        >
          <Plus size={32} />
          <p className="text-[10px] font-black uppercase tracking-widest">Establish Node</p>
        </button>
      </div>
    </div>
  );
};

// --- Admin Hub Main ---
const AdminHub = ({ 
  buildings, setBuildings, 
  users, setUsers, 
  logo, setLogo, 
  primaryColor, setPrimaryColor,
  courses, setCourses,
  events, setEvents
}: any) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'campus' | 'registry' | 'repository' | 'analytics' | 'os'>('campus');
  const [selectedUserReport, setSelectedUserReport] = useState<User | null>(null);
  
  const handleToggleSuspend = (userId: string) => {
    setUsers(users.map((u: User) => u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u));
  };

  const handleAddUser = () => {
    const name = prompt("Full Name Identity:");
    const roleStr = prompt("Protocol Role (student/faculty):");
    if (!name || !roleStr) return;
    const role = roleStr.toLowerCase() === 'faculty' ? UserRole.FACULTY : UserRole.STUDENT;
    const newUser: User = {
      id: `${role === UserRole.FACULTY ? 'FAC' : 'STU'}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      name,
      email: `${name.toLowerCase().replace(/\s/g, '.')}@unistone.edu`,
      role,
      department: "General",
      attendance: 100,
      xp: 0,
      streak: 0,
      enrolledCourseIds: [],
      profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
    };
    setUsers([...users, newUser]);
  };

  return (
    <div className="space-y-12 animate-in fade-in pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-7xl font-black uppercase tracking-tighter leading-none text-slate-900">Command <span className="text-brand">Center</span></h2>
          <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Unified Campus OS Management Suite.</p>
        </div>
        <div className="flex bg-white rounded-[2rem] p-2 border border-slate-100 shadow-sm overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'campus', label: 'Mesh', icon: <MapPin size={16}/> },
            { id: 'registry', label: 'Registry', icon: <Users size={16}/> },
            { id: 'repository', label: 'Repository', icon: <FileStack size={16}/> },
            { id: 'analytics', label: 'Pulse', icon: <BarChart3 size={16}/> },
            { id: 'os', label: 'OS Settings', icon: <Settings size={16}/> }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shrink-0 ${activeAdminTab === tab.id ? 'bg-brand text-white shadow-brand' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Campus Management Tab */}
      {activeAdminTab === 'campus' && <AdminCampusManager buildings={buildings} setBuildings={setBuildings} />}

      {/* Registry Tab */}
      {activeAdminTab === 'registry' && (
        <div className="space-y-8">
          <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Global Personnel Registry</h3>
              <button onClick={handleAddUser} className="px-10 py-5 bg-brand text-white rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center gap-3 shadow-brand hover:scale-105 transition-all">
                <PlusCircle size={20} /> Deploy New Identity
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50">
                    <th className="px-12 py-8">Identity</th>
                    <th className="px-12 py-8">Status Pulse</th>
                    <th className="px-12 py-8">Sync Levels</th>
                    <th className="px-12 py-8 text-right">Access Protocols</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((u: User) => (
                    <tr key={u.id} className={`group hover:bg-brand/[0.02] transition-colors ${u.isSuspended ? 'opacity-40 grayscale' : ''}`}>
                      <td className="px-12 py-8">
                        <div className="flex items-center gap-6">
                          <img src={u.profileImage} className="w-16 h-16 rounded-[1.5rem] object-cover shadow-md group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-lg font-black text-slate-900 uppercase leading-none">{u.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-2">{u.id} • {u.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-8">
                        <div className="flex flex-col gap-2">
                           <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit ${u.role === UserRole.FACULTY ? 'bg-indigo-50 text-indigo-600' : 'bg-brand/10 text-brand'}`}>
                            {u.role}
                          </span>
                          {u.isSuspended && <span className="px-3 py-1 bg-red-50 text-red-600 text-[8px] font-black uppercase rounded-md w-fit">Suspended</span>}
                        </div>
                      </td>
                      <td className="px-12 py-8">
                        <div className="flex items-center gap-8">
                          <div><p className="text-xl font-black text-slate-900">{u.attendance}%</p><p className="text-[9px] font-black uppercase text-slate-400">Integrity</p></div>
                          <div className="w-1 h-8 bg-slate-100 rounded-full" />
                          <div><p className="text-xl font-black text-slate-900">{u.xp}</p><p className="text-[9px] font-black uppercase text-slate-400">Power Level</p></div>
                        </div>
                      </td>
                      <td className="px-12 py-8 text-right space-x-3">
                        <button 
                          onClick={() => setSelectedUserReport(u)}
                          className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-brand hover:text-white transition-all shadow-sm"
                          title="Generate Pulse Report"
                        ><PieChart size={20}/></button>
                        <button 
                          onClick={() => handleToggleSuspend(u.id)}
                          className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${u.isSuspended ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 shadow-emerald-100 shadow-xl' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100 shadow-red-100 shadow-xl'}`}
                        >
                          {u.isSuspended ? 'Restore' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Repository Management */}
      {activeAdminTab === 'repository' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Curriculum Nodes</h3>
              <button 
                onClick={() => {
                  const name = prompt("Course Protocol Name:");
                  if (name) setCourses([...courses, { id: `c${courses.length + 1}`, name, code: 'NEW101', instructor: 'Assigning...', notesCount: 0, lecturesCount: 0, modules: [], description: 'Awaiting sync.' }]);
                }}
                className="p-4 bg-brand text-white rounded-2xl shadow-brand hover:rotate-90 transition-all"
              ><Plus size={24}/></button>
            </div>
            <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {courses.map((c: any) => (
                <div key={c.id} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-between group">
                  <div className="flex gap-6 items-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-2xl text-brand shadow-sm">{c.code[0]}</div>
                    <div><h4 className="text-lg font-black uppercase truncate max-w-[150px]">{c.name}</h4><p className="text-[9px] font-black uppercase text-slate-400">{c.code} • {c.instructor}</p></div>
                  </div>
                  <button onClick={() => setCourses(courses.filter((x: any) => x.id !== c.id))} className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Event Pulse</h3>
              <button 
                onClick={() => {
                  const title = prompt("Event Title:");
                  if (title) setEvents([...events, { id: `e${events.length + 1}`, title, date: 'TBD', time: '12:00', location: 'Campus Hub', registeredCount: 0, type: 'workshop', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop' }]);
                }}
                className="p-4 bg-brand text-white rounded-2xl shadow-brand hover:rotate-90 transition-all"
              ><Plus size={24}/></button>
            </div>
             <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {events.map((e: any) => (
                <div key={e.id} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-between">
                  <div className="flex gap-6 items-center">
                    <img src={e.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                    <div><h4 className="text-lg font-black uppercase truncate max-w-[150px]">{e.title}</h4><p className="text-[9px] font-black uppercase text-slate-400">{e.date} • {e.location}</p></div>
                  </div>
                  <button onClick={() => setEvents(events.filter((x: any) => x.id !== e.id))} className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Total Synchronized', val: users.length, icon: <Users/>, col: 'text-brand bg-brand/10' },
              { label: 'System Integrity', val: '98.2%', icon: <ShieldAlert/>, col: 'text-indigo-600 bg-indigo-50' },
              { label: 'Resource Load', val: '42%', icon: <Zap/>, col: 'text-orange-500 bg-orange-50' },
              { label: 'Active Sessions', val: '1.2k', icon: <Globe2/>, col: 'text-emerald-600 bg-emerald-50' }
            ].map(card => (
              <div key={card.label} className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm space-y-4 group hover:scale-105 transition-all">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${card.col}`}>{card.icon}</div>
                <div><p className="text-4xl font-black text-slate-900 leading-none">{card.val}</p><p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">{card.label}</p></div>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 p-16 rounded-[5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4"><PieChart className="text-brand"/> Infrastructure Performance Pulse</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div className="space-y-10">
                {['Computational Units', 'Logistical Mesh', 'Personnel Pulse', 'Curriculum Load'].map((metric, i) => (
                  <div key={metric} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-lg font-black uppercase tracking-tight">{metric}</p>
                      <p className="text-xs font-black text-brand tracking-widest">{85 + i * 3}% OK</p>
                    </div>
                    <div className="h-6 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-brand animate-pulse-slow" style={{ width: `${85 + i * 3}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-md flex flex-col justify-center text-center">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4">Neural Health Score</p>
                 <p className="text-8xl font-black text-brand leading-none">A+</p>
                 <p className="text-sm font-medium italic text-slate-500 mt-6 opacity-60">"The campus mesh is operating at peak efficiency levels."</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OS Settings Tab */}
      {activeAdminTab === 'os' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-sm space-y-12">
            <h3 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4 text-slate-900"><Palette className="text-brand" /> Visual Identity Protocol</h3>
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Brand Core Color</label>
                <div className="flex gap-6 items-center">
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={e => setPrimaryColor(e.target.value)}
                    className="w-24 h-24 rounded-3xl cursor-pointer border-8 border-slate-50 overflow-hidden shadow-xl shrink-0" 
                  />
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={primaryColor} 
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-black uppercase text-sm outline-none focus:border-brand shadow-inner" 
                    />
                    <p className="text-[9px] font-bold text-slate-400 mt-2">Enter HEX code or use the pulse picker</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Master Identity Logo Node (URL)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    value={logo} 
                    onChange={e => setLogo(e.target.value)}
                    className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold outline-none focus:border-brand shadow-inner" 
                    placeholder="https://..." 
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-brand/5 border-4 border-dashed border-brand/20 p-16 rounded-[5rem] flex flex-col justify-center items-center text-center space-y-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl relative z-10 p-6">
              <img src={logo} className="w-full h-full object-contain" />
            </div>
            <div className="relative z-10">
              <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Identity Preview</h4>
              <p className="text-sm font-medium italic text-slate-500 mt-2 opacity-60">Synchronizing system-wide...</p>
            </div>
            <div className="flex gap-6 justify-center relative z-10">
              <div className="w-16 h-16 bg-brand rounded-2xl shadow-brand ring-4 ring-white" />
              <div className="w-16 h-16 bg-brand/50 rounded-2xl ring-4 ring-white" />
              <div className="w-16 h-16 bg-brand/10 rounded-2xl ring-4 ring-white" />
            </div>
            <button 
              onClick={() => alert('Interface configurations finalized and synced.')}
              className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl relative z-10 hover:bg-black transition-all"
            >Commit Protocols</button>
          </div>
        </div>
      )}

      {/* Detailed User Pulse Report Modal */}
      {selectedUserReport && (
        <div className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-[5rem] overflow-hidden shadow-5xl border-[15px] border-brand/10 p-16 relative">
            <button onClick={() => setSelectedUserReport(null)} className="absolute top-10 right-10 p-4 bg-slate-50 rounded-full hover:bg-slate-100 transition-all"><X size={24}/></button>
            <div className="flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
              <img src={selectedUserReport.profileImage} className="w-48 h-48 rounded-[4rem] object-cover shadow-2xl border-8 border-white ring-1 ring-slate-100" />
              <div className="flex-1 space-y-4">
                <span className="px-5 py-2 bg-brand text-white text-[10px] font-black uppercase rounded-xl tracking-[0.2em]">{selectedUserReport.role} Profile</span>
                <h3 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedUserReport.name}</h3>
                <p className="text-xl font-medium italic text-slate-500">{selectedUserReport.department} Department • {selectedUserReport.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {[
                { label: 'Integrity', val: `${selectedUserReport.attendance}%`, icon: <CheckCircle/>, sub: 'Protocol Adherence' },
                { label: 'Sync Energy', val: selectedUserReport.xp, icon: <Zap/>, sub: 'Interaction Index' },
                { label: 'Pulse Streak', val: selectedUserReport.streak, icon: <Flame/>, sub: 'Daily Engagement' }
              ].map(stat => (
                <div key={stat.label} className="bg-slate-50 p-10 rounded-[3rem] text-center space-y-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto text-brand shadow-sm">{stat.icon}</div>
                  <div><p className="text-3xl font-black text-slate-900">{stat.val}</p><p className="text-[10px] font-black uppercase text-slate-400 mt-1 tracking-widest">{stat.label}</p></div>
                  <p className="text-[9px] font-bold text-slate-300 uppercase italic mt-4">{stat.sub}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 p-8 bg-brand/5 rounded-[3rem] border border-brand/10">
              <h4 className="text-lg font-black uppercase tracking-tight text-slate-900 mb-6 flex items-center gap-3"><Target className="text-brand"/> Performance Analysis</h4>
              <p className="text-sm font-medium leading-relaxed text-slate-600">This node is exhibiting <strong>optimal synchronization behavior</strong>. With a {selectedUserReport.attendance}% integrity score and {selectedUserReport.xp} XP nodes collected, {selectedUserReport.name.split(' ')[0]} is currently ranked in the top 15% of the {selectedUserReport.department} mesh.</p>
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
          <h2 className="text-7xl font-black uppercase tracking-tighter leading-none">Campus <span className="text-brand">Mesh</span></h2>
          <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Interactive geographic synchronization of building nodes.</p>
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
        <div className="space-y-12">
          <div className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-8 relative overflow-hidden">
            <h3 className="text-xl font-black uppercase tracking-widest text-[#F0E68C]">Skill Nodes</h3>
            <div className="flex flex-wrap gap-3">
              {(user.skills || []).length > 0 ? user.skills?.map(skill => (
                <span key={skill} className="px-5 py-3 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all cursor-default">{skill}</span>
              )) : (
                <p className="text-[10px] uppercase font-black text-slate-500">No skill nodes active.</p>
              )}
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="New Skill Node..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-[#F0E68C] transition-colors" />
                <button type="submit" className="p-2 bg-[#F0E68C] text-[#8B0000] rounded-xl hover:scale-110 transition-transform shadow-xl"><Plus size={20} /></button>
              </form>
            </div>
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
  
  const [logo, setLogo] = useSyncedState('unistone-logo', 'https://colleges18.s3.ap-south-1.amazonaws.com/Sage_univ_indore_b02eee0e17.jpg');
  const [primaryColor, setPrimaryColor] = useSyncedState('unistone-brand-color', '#8B0000');
  const [buildings, setBuildings] = useSyncedState<CampusBuilding[]>('unistone-campus-nodes', MOCK_BUILDINGS);
  const [users, setUsers] = useSyncedState<User[]>('unistone-user-registry', []);
  const [courses, setCourses] = useSyncedState<Course[]>('unistone-courses-dynamic', MOCK_COURSES);
  const [events, setEvents] = useSyncedState<CampusEvent[]>('unistone-events-dynamic', MOCK_EVENTS);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    if (users.length === 0) {
      const initialUsers: User[] = [
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
        <p className="text-xl font-medium italic opacity-80">Your synchronization privileges have been revoked by the core authority. Please contact the Command Center for reactivation.</p>
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
          courses={courses} setCourses={setCourses}
          events={events} setEvents={setEvents}
        />
      );
      case 'dashboard': return (
        <div className="space-y-16 pb-20 animate-in fade-in">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="text-7xl font-black uppercase tracking-tighter leading-none text-slate-900">System <span className="text-brand">Feed</span></h2>
              <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Identity synchronized as <span className="text-brand font-black">{user.role.toUpperCase()}</span>.</p>
            </div>
            <div className="flex gap-4">
              <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center"><p className="text-3xl font-black text-slate-900">{user.streak}</p><p className="text-[10px] font-black uppercase text-slate-400 mt-1">Streak</p></div>
              <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center"><p className="text-3xl font-black text-brand">{user.attendance}%</p><p className="text-[10px] font-black uppercase text-slate-400 mt-1">Integrity</p></div>
            </div>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-slate-900 p-14 rounded-[5rem] text-white space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-brand/10 transition-colors" />
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
