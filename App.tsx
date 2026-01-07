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

const useGlobalBranding = () => {
  const [logo, setLogo] = useState('U');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  
  useEffect(() => {
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
              {logo.length > 2 ? <img src={logo} alt="Logo" className="w-full h-full object-cover" /> : <span className={`font-black italic text-2xl ${isAdminPortal ? 'text-slate-900' : 'text-blue-600'}`}>{logo}</span>}
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase">UNISTONE</h1>
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
                <ChevronRight className="rotate-180" size={14}/> Student Login
             </button>
          ) : (
            <button onClick={() => setIsAdminPortal(true)} className="absolute top-8 right-8 text-slate-400 font-bold text-[10px] flex items-center gap-1 hover:text-blue-600 transition-all uppercase tracking-widest">
                <Shield size={12}/> Admin Portal
             </button>
          )}
          
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
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
              <input name="email" type="email" required placeholder={isAdminPortal ? "Admin Identifier" : "University Email / ID"} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="password" type="password" required placeholder="Security Password" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" />
            </div>

            <button disabled={loading} className={`w-full py-4 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-4 ${isAdminPortal ? 'bg-slate-900 hover:bg-black shadow-slate-900/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isAdminPortal ? 'Authorize & Enter' : 'Login Now'} <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Admin CRM View ---

const AdminCRMView = () => {
  const [crmTab, setCrmTab] = useState<'students' | 'faculty' | 'blocks' | 'courses' | 'media' | 'customize'>('students');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [logoInput, setLogoInput] = useState('');

  // States for management
  const [mediaList, setMediaList] = useState([...MOCK_VIDEOS]);
  const [buildings, setBuildings] = useState([...MOCK_BUILDINGS]);
  const [courses, setCourses] = useState([...MOCK_COURSES]);
  const [facultyList, setFacultyList] = useState([
    { id: 'f1', name: 'Dr. Alan Turing', role: 'Dean of CS', load: 'CS301', block: 'Engineering Block', status: 'Active' },
    { id: 'f2', name: 'Prof. Richard Feynman', role: 'Head of Physics', load: 'PH405', block: 'Science Block', status: 'Active' },
    { id: 'f3', name: 'Ar. Zaha Hadid', role: 'Architecture Lead', load: 'AR101', block: 'Arts Annex', status: 'Active' }
  ]);

  // Edit states
  const [editingMedia, setEditingMedia] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editingFaculty, setEditingFaculty] = useState<any>(null);
  const [isAddingBlock, setIsAddingBlock] = useState(false);

  const handleUpdateLogo = () => {
    window.dispatchEvent(new CustomEvent('unistone-branding-update', { detail: { logo: logoInput } }));
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2000);
  };

  const saveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setTimeout(() => {
      const updated = mediaList.map(m => m.id === editingMedia.id ? editingMedia : m);
      setMediaList(updated);
      setEditingMedia(null);
      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
    }, 800);
  };

  const saveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = courses.map(c => c.id === editingCourse.id ? editingCourse : c);
    setCourses(updated);
    setEditingCourse(null);
  };

  const saveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = facultyList.map(f => f.id === editingFaculty.id ? editingFaculty : f);
    setFacultyList(updated);
    setEditingFaculty(null);
  };

  const addBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const newB = {
      id: (buildings.length + 1).toString(),
      name: fd.get('name') as string,
      image: fd.get('image') as string || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
      description: fd.get('desc') as string,
      color: 'bg-indigo-600',
      floors: 4,
      departments: ['General'],
      facilities: ['WiFi', 'Cafeteria'],
      mapCoords: { top: '50%', left: '50%' },
      authorities: []
    };
    setBuildings([...buildings, newB]);
    setIsAddingBlock(false);
  };

  const renderTab = () => {
    switch (crmTab) {
      case 'media':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <ImageIcon className="text-blue-600" /> {editingMedia ? 'Edit Asset' : 'Managed Content'}
                </h4>
                {editingMedia ? (
                  <form onSubmit={saveMedia} className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Title</label>
                       <input value={editingMedia.title} onChange={e => setEditingMedia({...editingMedia, title: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-2xl text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Thumbnail URL (Course Image)</label>
                       <input value={editingMedia.thumbnailUrl} onChange={e => setEditingMedia({...editingMedia, thumbnailUrl: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-2xl text-sm font-bold" />
                    </div>
                    <div className="flex gap-2">
                       <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase">Save Changes</button>
                       <button type="button" onClick={() => setEditingMedia(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {mediaList.map((m: any) => (
                      <div key={m.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100 group">
                         <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0"><img src={m.thumbnailUrl} alt={m.title} className="w-full h-full object-cover" /></div>
                         <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black truncate">{m.title}</p>
                            <p className="text-[9px] font-black text-blue-500 uppercase">{m.type}</p>
                         </div>
                         <button onClick={() => setEditingMedia(m)} className="p-2 text-slate-300 hover:text-blue-600 transition-all"><Edit3 size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl"><Film size={32} /></div>
                 <h4 className="text-2xl font-black">Platform Media Hub</h4>
                 <p className="text-slate-400 text-sm max-w-xs">Global repository for all course lectures, campus reels, and event flyers. Keep assets up-to-date with current academic guidelines.</p>
              </div>
            </div>
          </div>
        );
      case 'blocks':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Building2 className="text-emerald-600" /> Campus Blocks</h3>
                <button onClick={() => setIsAddingBlock(true)} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs flex items-center gap-2"><Plus size={16} /> Construct New Block</button>
             </div>
             {isAddingBlock && (
               <div className="bg-white p-8 rounded-[2.5rem] border-2 border-emerald-100 shadow-xl animate-in slide-in-from-top-4">
                  <form onSubmit={addBlock} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input name="name" required placeholder="Block Name (e.g. Science Complex)" className="px-5 py-3 bg-slate-50 border rounded-2xl text-sm font-bold" />
                     <input name="image" placeholder="Image URL" className="px-5 py-3 bg-slate-50 border rounded-2xl text-sm font-bold" />
                     <textarea name="desc" placeholder="Block Description" className="md:col-span-2 px-5 py-3 bg-slate-50 border rounded-2xl text-sm font-bold h-20" />
                     <div className="flex gap-2 md:col-span-2">
                        <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs">Authorize Construction</button>
                        <button type="button" onClick={() => setIsAddingBlock(false)} className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs">Cancel</button>
                     </div>
                  </form>
               </div>
             )}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buildings.map(b => (
                  <div key={b.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden group">
                     <div className="h-32 bg-slate-200 relative"><img src={b.image} alt={b.name} className="w-full h-full object-cover" /></div>
                     <div className="p-6">
                        <h4 className="text-lg font-black">{b.name}</h4>
                        <p className="text-xs text-slate-400 truncate mb-4">{b.description}</p>
                        <button className="w-full py-3 bg-slate-50 text-[10px] font-black uppercase text-slate-500 rounded-xl hover:bg-emerald-50 hover:text-emerald-600">Assign Faculty & Layout</button>
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
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><BookOpen className="text-blue-600" /> Academic Courses</h3>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                   {courses.map(c => (
                     <div key={c.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4 group">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center font-black">{c.code}</div>
                        <div className="flex-1 overflow-hidden">
                           <h4 className="font-black text-slate-900 truncate">{c.name}</h4>
                           <p className="text-xs font-bold text-slate-400">Prof: {c.instructor}</p>
                        </div>
                        <button onClick={() => setEditingCourse(c)} className="p-3 text-slate-300 hover:text-blue-600"><Edit3 size={18} /></button>
                     </div>
                   ))}
                </div>
                {editingCourse && (
                  <div className="bg-white p-8 rounded-[3rem] border border-blue-100 shadow-xl animate-in slide-in-from-right-4">
                     <h4 className="text-xl font-black mb-6 flex items-center gap-2"><Edit3 className="text-blue-600" /> Course Editor</h4>
                     <form onSubmit={saveCourse} className="space-y-4">
                        <input value={editingCourse.name} onChange={e => setEditingCourse({...editingCourse, name: e.target.value})} placeholder="Course Name" className="w-full px-5 py-3 bg-slate-50 border rounded-2xl font-bold" />
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Assigned Faculty</label>
                           <select value={editingCourse.instructor} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-2xl font-bold">
                              {facultyList.map(f => <option key={f.id}>{f.name}</option>)}
                           </select>
                        </div>
                        <div className="flex gap-2">
                           <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase">Save Curriculum</button>
                           <button type="button" onClick={() => setEditingCourse(null)} className="px-6 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase">Close</button>
                        </div>
                     </form>
                  </div>
                )}
             </div>
          </div>
        );
      case 'faculty':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Briefcase className="text-slate-700" /> Faculty Management</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facultyList.map(f => (
                  <div key={f.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group">
                     <button onClick={() => setEditingFaculty(f)} className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-300 rounded-xl hover:text-blue-600"><Edit3 size={16} /></button>
                     <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] mb-4 flex items-center justify-center font-black text-xl">{f.name[0]}</div>
                     <h4 className="text-lg font-black leading-tight">{f.name}</h4>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 mb-4">{f.role}</p>
                     <div className="space-y-2 border-t pt-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500"><Building2 size={12} /> {f.block}</div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600"><BookOpen size={12} /> Course: {f.load}</div>
                     </div>
                  </div>
                ))}
             </div>
             {editingFaculty && (
               <div className="fixed inset-0 z-[500] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
                  <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 space-y-8 animate-in zoom-in-95">
                     <h3 className="text-2xl font-black">Edit Faculty Profile</h3>
                     <form onSubmit={saveFaculty} className="space-y-4">
                        <input value={editingFaculty.name} onChange={e => setEditingFaculty({...editingFaculty, name: e.target.value})} placeholder="Full Name" className="w-full px-5 py-3 bg-slate-50 border rounded-2xl font-bold" />
                        <input value={editingFaculty.role} onChange={e => setEditingFaculty({...editingFaculty, role: e.target.value})} placeholder="Designation" className="w-full px-5 py-3 bg-slate-50 border rounded-2xl font-bold" />
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Assign Block</label>
                           <select value={editingFaculty.block} onChange={e => setEditingFaculty({...editingFaculty, block: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-2xl font-bold">
                              {buildings.map(b => <option key={b.id}>{b.name}</option>)}
                           </select>
                        </div>
                        <div className="flex gap-2 pt-4">
                           <button type="submit" className="flex-1 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase">Finalize Edits</button>
                           <button type="button" onClick={() => setEditingFaculty(null)} className="px-8 py-5 bg-slate-100 text-slate-400 rounded-3xl font-black uppercase">Dismiss</button>
                        </div>
                     </form>
                  </div>
               </div>
             )}
          </div>
        );
      case 'customize':
        return (
          <div className="max-w-3xl mx-auto bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500 space-y-8">
            <h4 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Palette className="text-blue-600" /> Platform Identity</h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Platform Logo (URL or Text)</label>
                <div className="flex gap-2">
                  <input value={logoInput} onChange={e => setLogoInput(e.target.value)} placeholder="Logo URL or 'U'" className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-700 outline-none focus:border-blue-500" />
                  <button onClick={handleUpdateLogo} className="px-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">Update Logo</button>
                </div>
              </div>
            </div>
            {uploadSuccess && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold text-center">Platform branding synchronized successfully!</div>}
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
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl"><Database size={32} /></div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">System <span className="text-blue-600">CRM</span></h2>
          </div>
          <p className="text-slate-500 font-medium">Global university oversight and infrastructure management portal.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
           {[
             { id: 'students', label: 'Students', icon: <Users size={18} /> },
             { id: 'faculty', label: 'Faculty', icon: <Briefcase size={18} /> },
             { id: 'blocks', label: 'Blocks', icon: <Building2 size={18} /> },
             { id: 'courses', label: 'Courses', icon: <BookOpen size={18} /> },
             { id: 'media', label: 'Media Hub', icon: <Upload size={18} /> },
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

// --- Faculty Module ---

const FacultyDashboard = ({ user }: { user: User }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'profile' | 'lectures'>('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    bio: user.bio || 'Experienced professor specializing in computer science and innovative learning systems.',
    department: user.department,
    skills: user.skills?.join(', ') || 'AI, Algorithms, Distributed Systems'
  });

  const handleProfileSave = () => {
    setEditingProfile(false);
    alert('Academic profile has been locally synchronized!');
  };

  const renderContent = () => {
    switch(activeSubTab) {
      case 'profile':
        return (
          <div className="max-w-4xl animate-in fade-in duration-500">
             <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-40 bg-blue-600 relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20"><div className="w-full h-full bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:20px_20px]" /></div>
                </div>
                <div className="px-12 pb-12">
                   <div className="flex justify-between items-end -translate-y-16">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-white border-8 border-white shadow-xl flex items-center justify-center text-3xl font-black text-blue-600">{profileData.name[0]}</div>
                      <button onClick={() => setEditingProfile(!editingProfile)} className="mb-4 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg">
                        {editingProfile ? <><X size={16} /> Cancel</> : <><Edit3 size={16} /> Edit My Identity</>}
                      </button>
                   </div>
                   {editingProfile ? (
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <input value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="px-6 py-4 bg-slate-50 border rounded-2xl font-bold" placeholder="Full Name" />
                           <input value={profileData.department} onChange={e => setProfileData({...profileData, department: e.target.value})} className="px-6 py-4 bg-slate-50 border rounded-2xl font-bold" placeholder="Department" />
                        </div>
                        <textarea value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} className="w-full h-32 px-6 py-4 bg-slate-50 border rounded-2xl font-medium" placeholder="Academic Biography" />
                        <input value={profileData.skills} onChange={e => setProfileData({...profileData, skills: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-bold" placeholder="Specializations (Comma separated)" />
                        <button onClick={handleProfileSave} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase shadow-xl shadow-blue-500/20">Save Profile Metadata</button>
                     </div>
                   ) : (
                     <div className="space-y-8 -mt-8">
                        <div>
                           <h3 className="text-3xl font-black text-slate-900">{profileData.name}</h3>
                           <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mt-1">{profileData.department}</p>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">{profileData.bio}</p>
                        <div className="flex flex-wrap gap-2">
                           {profileData.skills.split(',').map(s => <span key={s} className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl border">{s.trim()}</span>)}
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
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all">
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900">Publish New Lecture</h3>
                    <p className="text-slate-500 font-medium italic">Share Reels or Full Sessions with your department.</p>
                 </div>
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><Plus size={32} /></div>
              </div>
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                 <h4 className="text-xl font-black mb-6">Recent Activity Hub</h4>
                 <div className="space-y-4">
                    {MOCK_VIDEOS.slice(0, 3).map(v => (
                      <div key={v.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-[2rem] border border-slate-100/50">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0"><img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" /></div>
                        <div className="flex-1">
                           <p className="text-xs font-black text-slate-900">{v.title}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modified 2h ago</p>
                        </div>
                        <button className="p-3 bg-white text-slate-300 rounded-xl hover:text-blue-600 transition-all shadow-sm"><Edit3 size={18} /></button>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 h-fit">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black">Quick Stats</h3>
                  <p className="text-slate-400 text-sm">Real-time impact tracking</p>
               </div>
               <div className="grid gap-4">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center"><p className="text-4xl font-black text-blue-400">428</p><p className="text-[10px] font-black uppercase text-slate-500 mt-1">Students Reached</p></div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center"><p className="text-4xl font-black text-emerald-400">92%</p><p className="text-[10px] font-black uppercase text-slate-500 mt-1">Attendance Rate</p></div>
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
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Instructor <span className="text-blue-600">Portal</span></h2>
          <p className="text-slate-500 font-medium italic">Welcome back, Professor. Empowering students through digital learning.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
           {[
             { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
             { id: 'lectures', label: 'Lectures', icon: <PlaySquare size={18} /> },
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
      const interval = setInterval(() => setCount(v => Math.min(v + 1, 45)), 1500);
      return () => clearInterval(interval);
    } else {
      setCount(0);
    }
  }, [active]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto text-center py-10">
      <div className="space-y-4 mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">AI Smart <span className="text-blue-600">Attendance</span></h2>
        <p className="text-slate-500 font-medium italic">Verified identity through platform-wide node recognition.</p>
      </div>
      <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl flex flex-col items-center space-y-8">
        {!active ? (
          <>
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-inner"><Camera size={48} /></div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 uppercase">Initiate Scan</h3>
              <p className="text-sm text-slate-400 font-medium">Verify your session to start capturing student presence.</p>
            </div>
            <button onClick={startSession} className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"><ScanFace size={24} /> Launch AI Scanner</button>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-inner animate-pulse"><Users size={48} /></div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 uppercase">Scanner Active</h3>
              <p className="text-blue-600 text-sm font-bold uppercase tracking-widest">CS301 - Data Structures</p>
            </div>
            <div className="w-full space-y-4">
              <div className="flex justify-between items-end"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marked Present</span><span className="text-3xl font-black text-emerald-600">{count}/45</span></div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50"><div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(count/45)*100}%` }} /></div>
            </div>
            <button onClick={() => setActive(false)} className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all flex items-center justify-center gap-2"><CheckCircle size={24} /> Finalize Roster</button>
          </>
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
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-top-10 duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-blue-50 p-8 flex flex-col items-center text-center space-y-6">
        <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center animate-bounce ${marked ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
          {marked ? <CheckCircle size={40} /> : <AlertCircle size={40} />}
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">{marked ? 'Attendance Synched!' : 'Class Active!'}</h3>
          <p className="text-slate-500 font-medium mt-2">{marked ? 'Your presence has been recorded.' : `Sync your identity for Prof. ${session.instructor}'s lecture.`}</p>
        </div>
        {!marked && <button onClick={mark} className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 hover:scale-105 transition-all"><ScanFace size={24} /> Mark Me Present</button>}
      </div>
    </div>
  );
};

// --- Sidebar Navigation ---

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }: { activeTab: string, setActiveTab: (t: string) => void, user: User, onLogout: () => void }) => {
  const { logo } = useGlobalBranding();
  
  const items = user.role === UserRole.ADMIN 
    ? [
        { id: 'admin-dashboard', label: 'Admin Terminal', icon: <Shield size={20} /> },
        { id: 'admin-crm', label: 'Platform CRM', icon: <Database size={20} /> },
        { id: 'navigation', label: 'Campus Map', icon: <MapIcon size={20} /> },
      ]
    : user.role === UserRole.FACULTY
    ? [
        { id: 'faculty-dashboard', label: 'Instructor Hub', icon: <LayoutDashboard size={20} /> },
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
        <h1 className="text-2xl font-black text-blue-900 tracking-tighter truncate uppercase">UNISTONE</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {items.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}>
            {item.icon}<span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4">
        <div className="flex items-center gap-3 overflow-hidden">
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

// --- Main App Component ---

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
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase">Admin <span className="text-blue-600">Portal</span></h2>
            <p className="text-slate-500 font-medium italic">Global infrastructure control and academic oversight hub.</p>
          </div>
          <button onClick={() => setActiveTab('admin-crm')} className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl hover:bg-black transition-all flex items-center gap-3"><Database size={24} /> System CRM Center</button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Platform Users', val: '12,402', icon: <Users /> },
            { label: 'System Uptime', val: '99.99%', icon: <RefreshCw /> },
            { label: 'Academic Assets', val: '4.2 TB', icon: <HardDrive /> },
            { label: 'Live Sessions', val: '18', icon: <Activity /> }
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
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center animate-in zoom-in-95 duration-500">
         <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-inner"><Sliders size={48} /></div>
         <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Smart Hub Optimized</h2>
            <p className="text-slate-400 font-medium max-w-md mx-auto italic">Module optimization in progress for the current university standard.</p>
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

// --- AI Concierge ---

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
              <div><p className="text-sm font-black">UNISTONE AI</p><p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Digital Assistant</p></div>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.length === 0 && <p className="text-center text-slate-400 text-xs font-medium py-10 italic">How can your intelligent campus concierge help today?</p>}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 shadow-sm rounded-tl-none border border-slate-100'}`}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="flex gap-1 p-2"><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" /></div>}
          </div>
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type your query..." className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all" />
            <button onClick={send} className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-all"><Send size={18} /></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="w-16 h-16 bg-blue-600 text-white rounded-[1.8rem] shadow-2xl flex items-center justify-center hover:scale-110 transition-all group border-4 border-white"><Bot size={32} /></button>
      )}
    </div>
  );
};
