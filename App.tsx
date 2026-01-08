
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Search, Play, Heart, Flame, Bot, MapPin, Send, User as UserIcon, Lock, 
  Mail, GraduationCap, Briefcase as BriefcaseIcon, LogOut, Plus, Users, 
  Calendar, FileText, Edit3, BookOpen, LayoutDashboard, MessageSquare, 
  Clock, ScanFace, CheckCircle, AlertCircle, PlaySquare, Image as ImageIcon, 
  Film, Save, Eye, Github, Linkedin, Network, Building, Zap, ArrowRight,
  TrendingUp, Globe, Smartphone, Laptop, Filter, Check, Camera, Upload,
  ExternalLink, ChevronRight, Book, Award, MoreVertical, FileUp, FileStack, Link as LinkIcon, FolderPlus, PlusCircle, ShieldAlert, Settings, PieChart, Trash2, Sliders, Palette
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

// --- Admin Hub ---
const AdminHub = ({ 
  buildings, setBuildings, 
  users, setUsers, 
  logo, setLogo, 
  primaryColor, setPrimaryColor 
}: any) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'campus' | 'registry' | 'analytics' | 'os'>('campus');
  
  const handleAddBuilding = () => {
    const name = prompt("Enter Building Name:");
    if (!name) return;
    const newB: CampusBuilding = {
      id: Math.random().toString(36).substr(2, 4).toUpperCase(),
      name,
      description: "New active node establishment.",
      color: "bg-indigo-500",
      image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=600&h=400&fit=crop",
      floors: 3,
      departments: ["General"],
      facilities: ["WIFI"],
      mapCoords: { top: "50%", left: "50%" }
    };
    setBuildings([...buildings, newB]);
  };

  const handleToggleSuspend = (userId: string) => {
    setUsers(users.map((u: User) => u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u));
  };

  const handleAddUser = () => {
    const name = prompt("Name:");
    const roleStr = prompt("Role (student/faculty):");
    if (!name || !roleStr) return;
    const role = roleStr.toLowerCase() === 'faculty' ? UserRole.FACULTY : UserRole.STUDENT;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@unistone.edu`,
      role,
      department: "CS",
      attendance: 100,
      xp: 0,
      streak: 0,
      enrolledCourseIds: [],
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    };
    setUsers([...users, newUser]);
  };

  return (
    <div className="space-y-12 animate-in fade-in pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-7xl font-black uppercase tracking-tighter leading-none text-slate-900">Command <span className="text-brand">Center</span></h2>
          <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed">Full system governance enabled.</p>
        </div>
        <div className="flex bg-white rounded-3xl p-2 border border-slate-100 shadow-sm">
          {['campus', 'registry', 'analytics', 'os'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveAdminTab(tab as any)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAdminTab === tab ? 'bg-brand text-white shadow-brand' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeAdminTab === 'campus' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buildings.map((b: CampusBuilding) => (
            <div key={b.id} className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm space-y-6 group">
              <div className="h-48 rounded-[2.5rem] overflow-hidden relative">
                <img src={b.image} className="w-full h-full object-cover" />
                <button 
                  onClick={() => {
                    const url = prompt("New Image URL:", b.image);
                    if (url) setBuildings(buildings.map((x: any) => x.id === b.id ? { ...x, image: url } : x));
                  }}
                  className="absolute bottom-4 right-4 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera size={18} />
                </button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{b.name}</h4>
                  <p className="text-[10px] font-black uppercase text-slate-400 mt-2">Floors: {b.floors} • ID: {b.id}</p>
                </div>
                <button 
                  onClick={() => setBuildings(buildings.filter((x: any) => x.id !== b.id))}
                  className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <input 
                  type="text" 
                  value={b.mapCoords.top} 
                  onChange={(e) => setBuildings(buildings.map((x: any) => x.id === b.id ? { ...x, mapCoords: { ...x.mapCoords, top: e.target.value } } : x))}
                  className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold border border-transparent focus:border-brand" 
                  placeholder="Top %"
                />
                <input 
                  type="text" 
                  value={b.mapCoords.left} 
                  onChange={(e) => setBuildings(buildings.map((x: any) => x.id === b.id ? { ...x, mapCoords: { ...x.mapCoords, left: e.target.value } } : x))}
                  className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold border border-transparent focus:border-brand" 
                  placeholder="Left %"
                />
              </div>
            </div>
          ))}
          <button 
            onClick={handleAddBuilding}
            className="border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center p-12 text-slate-300 hover:text-brand hover:border-brand/40 transition-all gap-4"
          >
            <div className="p-6 bg-slate-50 rounded-full"><Plus size={40} /></div>
            <p className="text-[12px] font-black uppercase tracking-[0.2em]">Deploy Node</p>
          </button>
        </div>
      )}

      {activeAdminTab === 'registry' && (
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">User Repository</h3>
            <button onClick={handleAddUser} className="px-8 py-4 bg-brand text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-brand">
              <PlusCircle size={18} /> Establish New Link
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50">
                  <th className="px-10 py-6">Identity</th>
                  <th className="px-10 py-6">Role</th>
                  <th className="px-10 py-6">Department</th>
                  <th className="px-10 py-6">Pulse (Attendance/XP)</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u: User) => (
                  <tr key={u.id} className={`group hover:bg-slate-50/50 transition-colors ${u.isSuspended ? 'opacity-50 grayscale' : ''}`}>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <img src={u.profileImage} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase">{u.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.role === UserRole.FACULTY ? 'bg-indigo-50 text-indigo-600' : 'bg-brand/10 text-brand'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-xs font-bold text-slate-500 uppercase">{u.department}</p>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <div><p className="text-sm font-black text-slate-900">{u.attendance}%</p><p className="text-[9px] font-black uppercase text-slate-400">Integrity</p></div>
                        <div><p className="text-sm font-black text-slate-900">{u.xp}</p><p className="text-[9px] font-black uppercase text-slate-400">XP</p></div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button 
                        onClick={() => handleToggleSuspend(u.id)}
                        className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${u.isSuspended ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'}`}
                      >
                        {u.isSuspended ? 'Resume Node' : 'Suspend Node'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAdminTab === 'analytics' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm text-center space-y-4">
              <div className="w-20 h-20 bg-brand/10 text-brand rounded-[2rem] flex items-center justify-center mx-auto"><Users size={32} /></div>
              <div><p className="text-4xl font-black text-slate-900">{users.length}</p><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Nodes</p></div>
            </div>
            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm text-center space-y-4">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-[2rem] flex items-center justify-center mx-auto"><PieChart size={32} /></div>
              <div><p className="text-4xl font-black text-slate-900">84%</p><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Avg Pulse Rate</p></div>
            </div>
            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto"><CheckCircle size={32} /></div>
              <div><p className="text-4xl font-black text-slate-900">22</p><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sync Reports OK</p></div>
            </div>
          </div>
          <div className="bg-slate-900 p-16 rounded-[5rem] text-white">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-12">Performance Topology</h3>
            <div className="space-y-10">
              {['Computer Science', 'Pharmacy', 'Engineering'].map((dept, i) => (
                <div key={dept} className="space-y-4">
                  <div className="flex justify-between items-end"><p className="text-lg font-black uppercase tracking-tight">{dept}</p><p className="text-xs font-black text-brand">{80 + (i * 5)}% Sync</p></div>
                  <div className="h-6 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-brand" style={{ width: `${80 + (i * 5)}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'os' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
            <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4 text-slate-900"><Palette className="text-brand" /> Interface Config</h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Brand Node</label>
                <div className="flex gap-4">
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={e => setPrimaryColor(e.target.value)}
                    className="w-20 h-20 rounded-2xl cursor-pointer border-4 border-slate-50 overflow-hidden" 
                  />
                  <input 
                    type="text" 
                    value={primaryColor} 
                    onChange={e => setPrimaryColor(e.target.value)}
                    className="flex-1 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black uppercase text-sm outline-none focus:border-brand" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">System Logo Protocol (URL)</label>
                <input 
                  type="text" 
                  value={logo} 
                  onChange={e => setLogo(e.target.value)}
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-brand" 
                  placeholder="https://..." 
                />
              </div>
            </div>
          </div>
          <div className="bg-brand/5 border-2 border-dashed border-brand/20 p-12 rounded-[4rem] flex flex-col justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl">
              <img src={logo} className="w-full h-full object-contain p-3" />
            </div>
            <h4 className="text-2xl font-black text-slate-900 uppercase">Real-time Preview</h4>
            <div className="flex gap-4 justify-center">
              <div className="w-12 h-12 bg-brand rounded-xl shadow-brand" />
              <div className="w-12 h-12 bg-brand/50 rounded-xl" />
              <div className="w-12 h-12 bg-brand/10 rounded-xl" />
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
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Initialize user registry if empty
  // Fix typos in property names (enrolleCourseIds -> enrolledCourseIds)
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
      if (user.role === UserRole.ADMIN) setActiveTab('admin');
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
      case 'admin': return <AdminHub buildings={buildings} setBuildings={setBuildings} users={users} setUsers={setUsers} logo={logo} setLogo={setLogo} primaryColor={primaryColor} setPrimaryColor={setPrimaryColor} />;
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
          {/* Dashboard Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-slate-900 p-14 rounded-[5rem] text-white space-y-8">
              <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4"><TrendingUp className="text-[#F0E68C]" /> Neural Pulse</h3>
              <div className="space-y-6">
                {MOCK_NEWS.slice(0, 2).map(n => (
                  <div key={n.id} className="flex gap-6 group cursor-pointer">
                    <img src={n.image} className="w-24 h-24 rounded-2xl object-cover" />
                    <div><h4 className="font-black uppercase text-sm line-clamp-2">{n.title}</h4><p className="text-[9px] font-black text-slate-400 mt-2">{n.source}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-14 rounded-[5rem] border border-slate-100 shadow-sm">
               <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4 text-slate-900"><Calendar className="text-brand" /> Hub Events</h3>
               <div className="space-y-6 mt-6">
                 {MOCK_EVENTS.map(e => (
                   <div key={e.id} className="flex items-center justify-between">
                     <div className="flex gap-4">
                       <div className="w-12 h-12 bg-brand/10 text-brand rounded-xl flex flex-col items-center justify-center font-black text-[10px]"><span>OCT</span><span>24</span></div>
                       <div><p className="font-black uppercase text-sm">{e.title}</p><p className="text-[9px] font-bold text-slate-400">{e.location}</p></div>
                     </div>
                     <ChevronRight className="text-slate-200" />
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
    <div className="min-h-screen gradient-bg">
      <ThemeProvider primaryColor={primaryColor} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser(null)} logo={logo} />
      <main className="md:ml-72 p-6 md:p-14 h-screen overflow-y-auto custom-scrollbar no-scrollbar scroll-smooth">
        {renderContent()}
      </main>
      <UnistoneAI />
    </div>
  );
}
