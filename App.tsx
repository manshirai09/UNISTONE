import React, { useState, useRef, useEffect } from 'react';
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
  Sliders, UserPlus, Filter, Shield, Settings2, Power, Globe, Palette, RefreshCw, Image as ImageIcon, Film, FilePlus, Key, Save
} from 'lucide-react';
import { User, UserRole, Video as VideoType, CampusBuilding, Course, MapCoords, CampusEvent, Authority, Project } from './types';
import { NAV_ITEMS, MOCK_BUILDINGS, MOCK_COURSES, MOCK_VIDEOS, MOCK_EVENTS, MOCK_JOBS, MOCK_POSTS, MOCK_SCHEDULE } from './constants';
import { askUnistoneAI } from './services/gemini';

// --- Global State Simulation ---
let globalAttendanceSession: { active: boolean; course: string; instructor: string } | null = null;
let onAttendanceStarted: ((session: { course: string; instructor: string }) => void) | null = null;

// --- Global Theme & Logo State (Managed via window for simple cross-component reactivity) ---
const useGlobalBranding = () => {
  const [logo, setLogo] = useState('U');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  
  useEffect(() => {
    // Listen for custom branding updates
    const handleBranding = (e: any) => {
      if (e.detail.logo) setLogo(e.detail.logo);
      if (e.detail.color) setPrimaryColor(e.detail.color);
    };
    window.addEventListener('unistone-branding-update', handleBranding);
    return () => window.removeEventListener('unistone-branding-update', handleBranding);
  }, []);

  return { logo, primaryColor };
};

// --- Authentication View ---

const AuthView = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logo } = useGlobalBranding();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('portal') === 'admin') {
      setIsAdminPortal(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;

    const finalRole = isAdminPortal ? UserRole.ADMIN : role;

    setTimeout(() => {
      onLogin({
        id: Math.random().toString(36).substr(2, 9),
        name: finalRole === UserRole.ADMIN ? 'Head Administrator' : (finalRole === UserRole.FACULTY ? 'Prof. Alan Turing' : 'Sarah Connor'),
        email: email,
        role: finalRole,
        department: finalRole === UserRole.ADMIN ? 'System Management' : 'Computer Science',
        xp: finalRole === UserRole.STUDENT ? 1200 : 0,
        streak: finalRole === UserRole.STUDENT ? 5 : 0,
        bio: finalRole === UserRole.ADMIN ? 'Primary Administrator for the UNISTONE Ecosystem.' : 'Exploring the future of smart education.',
        skills: finalRole === UserRole.ADMIN ? ['SysAdmin', 'Security'] : ['React', 'Node.js'],
        projects: [],
        githubUrl: 'https://github.com/unistone',
        linkedinUrl: 'https://linkedin.com/in/unistone'
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white min-h-[600px] animate-in fade-in zoom-in-95 duration-700">
        <div className={`md:w-1/2 p-12 text-white flex flex-col justify-between relative transition-all duration-500 ${isAdminPortal ? 'bg-slate-900' : 'academic-gradient'}`}>
          <div>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl overflow-hidden">
              {logo.length > 2 ? <img src={logo} alt="University Logo" className="w-full h-full object-cover" /> : <span className={`font-black italic text-2xl ${isAdminPortal ? 'text-slate-900' : 'text-blue-600'}`}>{logo}</span>}
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-4">UNISTONE</h1>
            <p className="text-blue-100 text-lg font-medium leading-relaxed opacity-90">
              {isAdminPortal 
                ? 'Central Operating Hub. Accessing Restricted Management Terminal.' 
                : 'Your Smart University Companion. Learning, Navigation, and Careers in one unified hub.'}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              {isAdminPortal ? <Terminal size={24} /> : <ShieldCheck size={24} />}
            </div>
            <p className="text-xs font-bold text-blue-100 uppercase tracking-widest">{isAdminPortal ? 'Admin Node Alpha' : 'Verified Student Portal'}</p>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          {isAdminPortal ? (
             <button onClick={() => setIsAdminPortal(false)} className="absolute top-8 right-8 text-blue-600 font-bold text-xs flex items-center gap-1 hover:underline">
                <ChevronRight className="rotate-180" size={14}/> Back to Student Login
             </button>
          ) : (
            <button onClick={() => setIsAdminPortal(true)} className="absolute top-8 right-8 text-slate-400 font-bold text-[10px] flex items-center gap-1 hover:text-blue-600 transition-all uppercase tracking-widest">
                <Shield size={12}/> Admin Portal
             </button>
          )}
          
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
               {isAdminPortal ? 'Admin Access' : 'Sign In'}
            </h2>
            <p className="text-slate-500 font-medium">Enter your university credentials</p>
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
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="email" type="email" required placeholder={isAdminPortal ? "Administrator ID" : "University ID / Email"} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="password" type="password" required placeholder="Security Password" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" />
            </div>

            <button disabled={loading} className={`w-full py-4 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-4 ${isAdminPortal ? 'bg-slate-900 hover:bg-black shadow-slate-900/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isAdminPortal ? 'Authorize & Enter' : 'Login Now'} <ArrowRight size={18} /></>}
            </button>
          </form>

          {!isAdminPortal && (
            <div className="mt-8 text-center">
              <button onClick={() => setIsAdminPortal(true)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all flex items-center justify-center gap-2 mx-auto">
                <Key size={12} /> System Administrator? Login Here
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Admin CRM Sub-View ---

const AdminCRMView = () => {
  const [crmTab, setCrmTab] = useState<'students' | 'faculty' | 'blocks' | 'courses' | 'media' | 'system' | 'customize'>('students');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [logoInput, setLogoInput] = useState('');
  
  // States for dynamic data management
  const [buildings, setBuildings] = useState(MOCK_BUILDINGS);
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [faculty, setFaculty] = useState([
    { name: 'Dr. Alan Turing', role: 'Dean of CS', load: 'CS301', status: 'Active', block: 'Engineering Block' },
    { name: 'Prof. Richard Feynman', role: 'Head of Physics', load: 'PH405', status: 'Active', block: 'Science Block' },
    { name: 'Ar. Zaha Hadid', role: 'Architecture Lead', load: 'AR101', status: 'Active', block: 'Arts Annex' }
  ]);

  const handleUpdateLogo = () => {
    window.dispatchEvent(new CustomEvent('unistone-branding-update', { detail: { logo: logoInput } }));
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2000);
  };

  // Fix: Implemented handleSimulatedUpload to handle media form submission
  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    // Simulate a network request for media processing
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1500);
  };

  const renderTab = () => {
    switch (crmTab) {
      case 'students':
        return (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
              <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student directory..." className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-100 text-sm outline-none" />
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg"><UserPlus size={16} /> Batch Enroll</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-8 py-4">Student Profile</th>
                    <th className="px-8 py-4">Enrollment ID</th>
                    <th className="px-8 py-4">Department</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-bold text-sm text-slate-600">
                  {[
                    { name: 'Sarah Connor', id: 'UN-2024-001', dept: 'CS - AI/ML', status: 'Active' },
                    { name: 'Marcus Wright', id: 'UN-2024-042', dept: 'Mechanical Eng.', status: 'Probation' },
                    { name: 'Kyle Reese', id: 'UN-2024-102', dept: 'Pharmacy', status: 'Active' },
                  ].filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50/30">
                      <td className="px-8 py-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">{s.name[0]}</div>
                        <span className="text-slate-900">{s.name}</span>
                      </td>
                      <td className="px-8 py-5 text-xs font-mono">{s.id}</td>
                      <td className="px-8 py-5">{s.dept}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${s.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>{s.status}</span>
                      </td>
                      <td className="px-8 py-5 flex gap-2">
                        <button className="p-2 text-slate-300 hover:text-blue-600"><Edit3 size={16} /></button>
                        <button className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {faculty.map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-black">{f.name[0]}</div>
                  <div className="flex gap-1">
                    <button className="p-2 bg-slate-50 text-slate-300 rounded-xl hover:text-blue-600"><Edit3 size={16} /></button>
                    <button className="p-2 bg-slate-50 text-slate-300 rounded-xl hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-1">{f.name}</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{f.role}</p>
                <div className="space-y-2 mb-6">
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><BookOpen size={14} className="text-blue-600" /> Course: {f.load}</div>
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Building2 size={14} className="text-emerald-600" /> Block: {f.block}</div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-slate-50">
                  <button className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">Assign Block</button>
                  <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase">Assign Course</button>
                </div>
              </div>
            ))}
            <button className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-3 text-slate-300 hover:text-blue-500 hover:border-blue-100 hover:bg-blue-50/20 transition-all">
              <Plus size={40} /><span className="font-black text-sm uppercase">Recruit Faculty</span>
            </button>
          </div>
        );
      case 'blocks':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Building2 className="text-emerald-600" /> Campus Blocks Management</h3>
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"><Plus size={16} /> Construct New Block</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buildings.map(b => (
                  <div key={b.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
                     <div className="h-40 relative">
                        <img src={b.image} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                        <div className={`absolute top-4 left-4 ${b.color} text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase`}>Block {b.id}</div>
                     </div>
                     <div className="p-6">
                        <h4 className="text-lg font-black text-slate-900 mb-2">{b.name}</h4>
                        <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-2">{b.description}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                           {b.departments.slice(0, 3).map(d => <span key={d} className="px-2 py-1 bg-slate-50 text-[9px] font-black text-slate-400 rounded-md uppercase">{d}</span>)}
                        </div>
                        <div className="flex gap-2">
                           <button className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-50 hover:text-emerald-600">Edit Layout</button>
                           <button className="p-3 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'courses':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><BookOpen className="text-purple-600" /> Academic Course Hub</h3>
                <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20"><Plus size={16} /> New Curriculum</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(c => (
                  <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-purple-200 hover:shadow-lg transition-all">
                     <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all"><BookOpen size={32} /></div>
                     <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] font-black text-purple-600 uppercase mb-1">{c.code}</p>
                        <h4 className="text-xl font-black text-slate-900 truncate">{c.name}</h4>
                        <p className="text-xs text-slate-400 font-bold mt-1">Instructor: {c.instructor}</p>
                        <div className="flex gap-4 mt-4">
                           <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400"><FileText size={12} /> {c.notesCount} Modules</div>
                           <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400"><Video size={12} /> {c.lecturesCount} Lectures</div>
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <button className="p-2 text-slate-300 hover:text-blue-600"><Edit3 size={18} /></button>
                        <button className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'media':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                  <h4 className="text-xl font-black text-slate-900 flex items-center gap-3"><Upload className="text-blue-600" /> Media Hub</h4>
                  <form onSubmit={handleSimulatedUpload} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Content Title</label>
                      <input required placeholder="Enter media title..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Content Type</label>
                      <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer">
                        <option>Full Lecture Video</option>
                        <option>Short Reel (Mobile First)</option>
                        <option>Building Gallery Image</option>
                        <option>Event Poster / Banner</option>
                        <option>Faculty Profile Portrait</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Assign to Block/Course</label>
                      <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer">
                        <option>Platform Global Assets</option>
                        {buildings.map(b => <option key={b.id}>{b.name}</option>)}
                        {courses.map(c => <option key={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer">
                      <FilePlus size={32} />
                      <div className="text-center">
                        <p className="text-xs font-black text-slate-900">Drop files or click</p>
                        <p className="text-[9px] font-bold mt-1 uppercase tracking-tight">MP4, JPG, PNG, PDF (Up to 1.5GB)</p>
                      </div>
                    </div>
                    <button type="submit" disabled={uploading} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                      {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Upload size={20} /> Publish Media</>}
                    </button>
                    {uploadSuccess && (
                      <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold text-center animate-in fade-in slide-in-from-top-2">
                        Success! Asset is now assigned and active.
                      </div>
                    )}
                  </form>
                </div>
              </div>
              
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6 h-full flex flex-col">
                  <div className="flex justify-between items-center shrink-0">
                    <h4 className="text-xl font-black text-slate-900 flex items-center gap-3"><ImageIcon className="text-blue-600" /> Managed Library</h4>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-blue-600">All</button>
                      <button className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-blue-600">Reels</button>
                      <button className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-blue-600">Courses</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {[...MOCK_VIDEOS, ...MOCK_EVENTS.map(e => ({ id: e.id, title: e.title, thumbnailUrl: e.flyerUrl, type: 'Event Flyer' }))].map((media, i) => (
                      <div key={i} className="bg-slate-50 rounded-3xl p-4 border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-lg transition-all">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                          <img src={(media as any).thumbnailUrl} alt={(media as any).title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-black text-slate-900 truncate">{(media as any).title}</p>
                          <p className="text-[9px] font-black text-blue-500 uppercase mt-1 tracking-widest">{(media as any).type || 'Course Asset'}</p>
                        </div>
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 text-slate-300 hover:text-blue-600" title="Edit Content"><Edit3 size={14} /></button>
                          <button className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'system':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                <h4 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Globe className="text-blue-600" /> Infrastructure Node</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Gemini 3 Flash Instance', status: 'Optimal', color: 'text-emerald-500' },
                    { label: 'Global Video Streaming CDN', status: 'High Traffic', color: 'text-orange-500' },
                    { label: 'Database Replication', status: 'Synched', color: 'text-emerald-500' }
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl font-bold">
                      <span className="text-sm text-slate-700">{s.label}</span>
                      <span className={`text-[10px] uppercase ${s.color}`}>{s.status}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2"><RefreshCw size={18} /> Rebuild System State</button>
              </div>
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-6">
                <h4 className="text-2xl font-black flex items-center gap-3"><Terminal className="text-emerald-400" /> Global Policies</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Campus Block Lock-down', active: false },
                    { label: 'Force 2FA for Faculty', active: true },
                    { label: 'AI Voice Conversation Mode', active: true },
                    { label: 'Internal Developer Tools', active: false }
                  ].map((o, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-sm font-bold">{o.label}</span>
                      <button className={`w-12 h-6 rounded-full relative transition-all ${o.active ? 'bg-blue-600' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${o.active ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'customize':
        return (
          <div className="max-w-3xl mx-auto bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500 space-y-8">
            <h4 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Palette className="text-blue-600" /> Brand & Logo Control</h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">University Logo (URL or Text)</label>
                <div className="flex gap-2">
                  <input value={logoInput} onChange={e => setLogoInput(e.target.value)} placeholder="Enter logo image URL or 'U'" className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-700 outline-none focus:border-blue-500" />
                  <button onClick={handleUpdateLogo} className="px-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">Update Logo</button>
                </div>
                <p className="text-[9px] text-slate-400 font-bold ml-2">Changes are applied immediately platform-wide.</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Platform Name</label>
                <input placeholder="UNISTONE" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-700 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Identity Color</label>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-xl bg-blue-600 ring-4 ring-blue-100" />
                  <button className="w-10 h-10 rounded-xl bg-emerald-600 hover:scale-110 transition-all" />
                  <button className="w-10 h-10 rounded-xl bg-purple-600 hover:scale-110 transition-all" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Dynamic Broadcast Banner</label>
              <textarea placeholder="Type urgent announcement to all user dashboards..." className="w-full h-32 px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl font-medium resize-none focus:border-blue-500" />
            </div>
            <button className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">Synchronize Branding Assets</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/30"><Database size={32} /></div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Smart <span className="text-blue-600">Admin</span></h2>
          </div>
          <p className="text-slate-500 font-medium">Platform-wide management, student oversight, and media deployment.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
           {[
             { id: 'students', label: 'Students', icon: <Users size={18} /> },
             { id: 'faculty', label: 'Faculty Hub', icon: <Briefcase size={18} /> },
             { id: 'blocks', label: 'Blocks', icon: <Building2 size={18} /> },
             { id: 'courses', label: 'Courses', icon: <BookOpen size={18} /> },
             { id: 'media', label: 'Media Hub', icon: <Upload size={18} /> },
             { id: 'system', label: 'Nodes', icon: <Settings2 size={18} /> },
             { id: 'customize', label: 'Branding', icon: <Sliders size={18} /> },
           ].map(tab => (
             <button key={tab.id} onClick={() => setCrmTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${crmTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}>
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>
      </header>
      <div className="pt-4">{renderTab()}</div>
    </div>
  );
};

// --- Faculty Module: Instructor Hub ---

const FacultyDashboard = ({ user }: { user: User }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'lectures' | 'materials' | 'profile'>('overview');
  const [showUpload, setShowUpload] = useState(false);
  
  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    bio: user.bio,
    department: user.department,
    skills: user.skills?.join(', ') || ''
  });

  const handleProfileSave = () => {
    // In a real app, send to API
    setEditingProfile(false);
    // Simulate UI update
    alert('Profile updated successfully!');
  };

  const renderContent = () => {
    switch(activeSubTab) {
      case 'profile':
        return (
          <div className="max-w-4xl animate-in fade-in duration-500">
             <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-40 academic-gradient relative">
                   <div className="absolute -bottom-16 left-12 w-32 h-32 rounded-[2.5rem] bg-white border-8 border-white shadow-xl flex items-center justify-center overflow-hidden">
                      <UserIcon size={64} className="text-slate-200" />
                   </div>
                </div>
                <div className="pt-20 px-12 pb-12">
                   <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900">{profileData.name}</h3>
                        <p className="text-blue-600 font-bold">{profileData.department}</p>
                      </div>
                      <button onClick={() => setEditingProfile(!editingProfile)} className="px-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-black text-xs uppercase flex items-center gap-2 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                        {editingProfile ? <><X size={16} /> Cancel</> : <><Edit3 size={16} /> Edit My Profile</>}
                      </button>
                   </div>

                   {editingProfile ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Full Name</label>
                           <input value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Department</label>
                           <input value={profileData.department} onChange={e => setProfileData({...profileData, department: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" />
                        </div>
                        <div className="space-y-2 col-span-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Biography</label>
                           <textarea value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} className="w-full h-32 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium resize-none" />
                        </div>
                        <div className="space-y-2 col-span-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Skills (Comma Separated)</label>
                           <input value={profileData.skills} onChange={e => setProfileData({...profileData, skills: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" />
                        </div>
                        <button onClick={handleProfileSave} className="col-span-2 py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3">
                           <Save size={20} /> Save My Profile Changes
                        </button>
                     </div>
                   ) : (
                     <div className="space-y-8">
                        <div>
                           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">About Me</h4>
                           <p className="text-slate-600 font-medium leading-relaxed">{profileData.bio}</p>
                        </div>
                        <div>
                           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Specializations</h4>
                           <div className="flex flex-wrap gap-2">
                              {profileData.skills.split(',').map(s => <span key={s} className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-100">{s.trim()}</span>)}
                           </div>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all" onClick={() => setShowUpload(true)}>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900">Publish Content</h3>
                    <p className="text-slate-500 font-medium italic">Share new videos, assignments or modules with students.</p>
                 </div>
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><Plus size={32} /></div>
              </div>
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                 <h4 className="text-xl font-black mb-6">Course Material Management</h4>
                 <div className="space-y-4">
                    {MOCK_VIDEOS.filter(v => v.uploadedBy === 'Prof. Turing' || true).slice(0, 3).map(v => (
                      <div key={v.id} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100/50 group hover:border-blue-200 transition-all">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0"><img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" /></div>
                        <div className="flex-1">
                           <p className="text-xs font-black text-slate-900">{v.title}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.type === 'short' ? 'REEL' : 'LECTURE'} • {v.views} Views</p>
                        </div>
                        <button className="p-3 bg-white text-slate-300 rounded-xl hover:text-blue-600 transition-all shadow-sm"><Edit3 size={18} /></button>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 h-fit">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black">Digital Impact</h3>
                  <p className="text-slate-400 text-sm italic">Track your academic footprint</p>
               </div>
               <div className="grid gap-6">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl"><p className="text-4xl font-black text-blue-400">428</p><p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Total Students Reach</p></div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl"><p className="text-4xl font-black text-emerald-400">92%</p><p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Engagement Score</p></div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl"><p className="text-4xl font-black text-purple-400">24</p><p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Course Assets Live</p></div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Instructor <span className="text-blue-600">Portal</span></h2>
          <p className="text-slate-500 font-medium italic">Empower students through digital excellence.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
           {[
             { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
             { id: 'lectures', label: 'My Hub', icon: <PlaySquare size={18} /> },
             { id: 'materials', label: 'Materials', icon: <FileStack size={18} /> },
             { id: 'profile', label: 'My Profile', icon: <UserIcon size={18} /> },
           ].map(tab => (
             <button key={tab.id} onClick={() => setActiveSubTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeSubTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>
      </header>
      
      <div className="pt-4">{renderContent()}</div>
    </div>
  );
};

// --- Faculty Module: Smart Attendance ---

const FacultyAttendance = ({ user }: { user: User }) => {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);

  const startSession = () => {
    setActive(true);
    globalAttendanceSession = { active: true, course: 'Data Structures (CS301)', instructor: user.name };
    if (onAttendanceStarted) onAttendanceStarted(globalAttendanceSession);
  };

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => setCount(v => Math.min(v + 1, 45)), 2000);
      return () => clearInterval(interval);
    } else {
      setCount(0);
    }
  }, [active]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto text-center py-10">
      <div className="space-y-4 mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">AI Smart <span className="text-blue-600">Attendance</span></h2>
        <p className="text-slate-500 font-medium">Verified student identity through platform-wide node recognition.</p>
      </div>
      <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl flex flex-col items-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        {!active ? (
          <>
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner relative z-10"><Camera size={48} /></div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-black text-slate-900">Initiate Digital Scan</h3>
              <p className="text-sm text-slate-400 font-medium">Broadcasting session ID to all student nodes in vicinity.</p>
            </div>
            <button onClick={startSession} className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 relative z-10"><ScanFace size={24} /> Launch AI Scanner</button>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center shadow-inner animate-pulse relative z-10"><Users size={48} /></div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-black text-slate-900">Session Broadcaster Active</h3>
              <p className="text-blue-600 text-sm font-bold uppercase tracking-widest">CS301 - Data Structures Hub</p>
            </div>
            <div className="w-full space-y-4 relative z-10">
              <div className="flex justify-between items-end"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marked Present</span><span className="text-3xl font-black text-emerald-600">{count}/45</span></div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50"><div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(count/45)*100}%` }} /></div>
            </div>
            <button onClick={() => setActive(false)} className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all flex items-center justify-center gap-2 relative z-10"><CheckCircle size={24} /> Finalize Session</button>
          </>
        )}
      </div>
    </div>
  );
};

// --- Attendance Popup Component ---

const AttendancePopup = ({ session, onMark }: { session: any, onMark: () => void }) => {
  const [marked, setMarked] = useState(false);
  const mark = () => {
    setMarked(true);
    setTimeout(onMark, 2000);
  };
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-top-10 duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-blue-50 p-8 flex flex-col items-center text-center space-y-6">
        <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center animate-bounce ${marked ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
          {marked ? <CheckCircle size={40} /> : <AlertCircle size={40} />}
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">{marked ? 'Attendance Synched!' : 'Class Session Broadcaster!'}</h3>
          <p className="text-slate-500 font-medium mt-2">{marked ? 'Your presence has been recorded in the platform ledger.' : `Confirm your attendance for Prof. ${session.instructor}'s live lecture.`}</p>
        </div>
        {!marked && <button onClick={mark} className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 hover:scale-105 transition-all"><ScanFace size={24} /> Sync My Node</button>}
      </div>
    </div>
  );
};

// --- Sidebar Navigation ---

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }: { activeTab: string, setActiveTab: (t: string) => void, user: User, onLogout: () => void }) => {
  const { logo } = useGlobalBranding();
  
  const items = user.role === UserRole.ADMIN 
    ? [
        { id: 'admin-dashboard', label: 'Control Center', icon: <Shield size={20} /> },
        { id: 'admin-crm', label: 'Integrated CRM', icon: <Database size={20} /> },
        { id: 'navigation', label: 'Campus Block', icon: <MapIcon size={20} /> },
      ]
    : user.role === UserRole.FACULTY
    ? [
        { id: 'faculty-dashboard', label: 'Instructor Portal', icon: <LayoutDashboard size={20} /> },
        { id: 'lectures', label: 'Video Hub', icon: <Video size={20} /> },
        { id: 'attendance', label: 'AI Attendance', icon: <ScanFace size={20} /> },
      ]
    : NAV_ITEMS;

  return (
    <aside className="w-64 bg-white shadow-xl h-screen hidden md:flex flex-col p-4 fixed left-0 top-0 z-50 border-r border-slate-100">
      <div className="flex items-center gap-3 mb-8 px-2 overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black italic shadow-lg shadow-blue-500/20 overflow-hidden shrink-0">
          {logo.length > 2 ? <img src={logo} alt="UNISTONE" className="w-full h-full object-cover" /> : <span>{logo}</span>}
        </div>
        <h1 className="text-2xl font-black text-blue-900 tracking-tighter truncate">UNISTONE</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {items.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}>
            {item.icon}<span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md"><UserIcon size={20} /></div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full py-2.5 bg-white text-red-500 border border-red-50 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2"><LogOut size={14} /> Sign Out</button>
      </div>
    </aside>
  );
};

// --- Main Application Core ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [session, setSession] = useState<any>(null);

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

  if (!user) return <AuthView onLogin={setUser} />;

  const renderContent = () => {
    if (activeTab === 'admin-crm' && user.role === UserRole.ADMIN) return <AdminCRMView />;
    if (activeTab === 'admin-dashboard' && user.role === UserRole.ADMIN) return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Admin <span className="text-blue-600">Terminal</span></h2>
            <p className="text-slate-500 font-medium italic mt-2">Global infrastructure control and oversight.</p>
          </div>
          <button onClick={() => setActiveTab('admin-crm')} className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl hover:bg-black transition-all flex items-center gap-3"><Database size={24} /> Launch System CRM</button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Active Nodes', val: '12,402', icon: <Users /> },
            { label: 'Platform Load', val: '458 req/s', icon: <Activity /> },
            { label: 'Uptime Global', val: '99.9%', icon: <RefreshCw /> },
            { label: 'Content Ledger', val: '4.2 TB', icon: <HardDrive /> }
          ].map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">{s.icon}</div>
              <p className="text-3xl font-black text-slate-900 leading-none">{s.val}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
    if (activeTab === 'faculty-dashboard' && user.role === UserRole.FACULTY) return <FacultyDashboard user={user} />;
    if (activeTab === 'attendance' && user.role === UserRole.FACULTY) return <FacultyAttendance user={user} />;
    
    // Fallback UI
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center animate-in zoom-in-95 duration-500">
         <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-inner"><Sliders size={48} /></div>
         <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Smart Module Optimized</h2>
            <p className="text-slate-400 font-medium max-w-md mx-auto">This section is currently being updated to the latest UNISTONE standard for seamless academic flow.</p>
         </div>
         <button onClick={() => setActiveTab(user.role === UserRole.ADMIN ? 'admin-dashboard' : user.role === UserRole.FACULTY ? 'faculty-dashboard' : 'dashboard')} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:scale-105 transition-all uppercase tracking-widest text-xs">Return to Platform Hub</button>
      </div>
    );
  };

  return (
    <div className="min-h-screen gradient-bg">
      {session && <AttendancePopup session={session} onMark={() => setSession(null)} />}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser(null)} />
      <main className="md:ml-64 p-4 md:p-10 h-screen flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 custom-scrollbar no-scrollbar">{renderContent()}</div>
      </main>
      <AIAssistant />
    </div>
  );
}

// --- AI Assistant Concierge ---

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
    <div className="fixed bottom-8 right-8 z-[200]">
      {open ? (
        <div className="w-80 md:w-96 h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Bot size={22} /></div>
              <div><p className="text-sm font-black">UNISTONE AI</p><p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Digital Hub</p></div>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.length === 0 && <p className="text-center text-slate-400 text-xs font-medium py-10 italic">Your intelligent campus concierge is ready to assist.</p>}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 shadow-sm rounded-tl-none border border-slate-100'}`}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="flex gap-1 p-2"><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" /></div>}
          </div>
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="How can I help you today?" className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all" />
            <button onClick={send} className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-all"><Send size={18} /></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="w-16 h-16 bg-blue-600 text-white rounded-[1.8rem] shadow-2xl flex items-center justify-center hover:scale-110 transition-all group border-4 border-white"><Bot size={32} /></button>
      )}
    </div>
  );
};