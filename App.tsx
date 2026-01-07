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

// --- Custom Branding Hook ---
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
              {logo.length > 5 ? <img src={logo} alt="Logo" className="w-full h-full object-cover" /> : <span className={`font-black italic text-2xl ${isAdminPortal ? 'text-slate-900' : 'text-blue-600'}`}>{logo}</span>}
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase text-white">UNISTONE</h1>
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
    { id: 'f1', name: 'Dr. Alan Turing', role: 'Dean of CS', load: 'CS301', block: 'Engineering Block', status: 'Active', bio: 'AI Visionary', skills: 'Python, Neural Networks' },
    { id: 'f2', name: 'Prof. Richard Feynman', role: 'Head of Physics', load: 'PH405', block: 'Science Block', status: 'Active', bio: 'Quantum Pioneer', skills: 'Physics, Nano-tech' },
    { id: 'f3', name: 'Ar. Zaha Hadid', role: 'Architecture Lead', load: 'AR101', block: 'Arts Annex', status: 'Active', bio: 'Structural Innovator', skills: 'Design, Cad' }
  ]);

  // Expanded Student Mock Data
  const [studentList, setStudentList] = useState([
    { name: 'Sarah Connor', id: 'UN-2024-001', dept: 'CS - AI/ML', status: 'Active' },
    { name: 'Marcus Wright', id: 'UN-2024-042', dept: 'Mechanical Eng.', status: 'Probation' },
    { name: 'Kyle Reese', id: 'UN-2024-102', dept: 'Pharmacy', status: 'Active' },
    { name: 'John Doe', id: 'UN-2024-115', dept: 'Computer Science', status: 'Active' },
    { name: 'Jane Smith', id: 'UN-2024-116', dept: 'Electrical Eng.', status: 'Active' },
    { name: 'Emily Blunt', id: 'UN-2024-204', dept: 'Pharmacy', status: 'Active' },
    { name: 'Michael Scott', id: 'UN-2024-301', dept: 'Business Mgmt', status: 'Active' },
    { name: 'Pam Beesly', id: 'UN-2024-302', dept: 'Arts & Design', status: 'Active' },
    { name: 'Jim Halpert', id: 'UN-2024-303', dept: 'Marketing', status: 'Probation' },
    { name: 'Dwight Schrute', id: 'UN-2024-304', dept: 'Agriculture', status: 'Active' },
    { name: 'Angela Martin', id: 'UN-2024-305', dept: 'Accounting', status: 'Active' },
    { name: 'Bruce Wayne', id: 'UN-2024-007', dept: 'Criminal Justice', status: 'Active' },
    { name: 'Peter Parker', id: 'UN-2024-008', dept: 'Journalism', status: 'Active' },
    { name: 'Tony Stark', id: 'UN-2024-009', dept: 'Applied Physics', status: 'Active' },
    { name: 'Natasha Romanoff', id: 'UN-2024-010', dept: 'Psychology', status: 'Active' }
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
      setMediaList(prev => prev.map(m => m.id === editingMedia.id ? editingMedia : m));
      setEditingMedia(null);
      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
    }, 800);
  };

  const saveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    setCourses(prev => prev.map(c => c.id === editingCourse.id ? editingCourse : c));
    setEditingCourse(null);
  };

  const saveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    setFacultyList(prev => prev.map(f => f.id === editingFaculty.id ? editingFaculty : f));
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
      case 'students':
        return (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
              <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student directory..." className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-100 text-sm outline-none" />
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"><UserPlus size={16} /> Batch Enroll</button>
            </div>
            <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
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
                  {studentList.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())).map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
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
                        <button className="p-2 text-slate-300 hover:text-blue-600 transition-all"><Edit3 size={16} /></button>
                        <button className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'media':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <ImageIcon className="text-blue-600" /> {editingMedia ? 'Edit Hub Content' : 'Library Explorer'}
                </h4>
                {editingMedia ? (
                  <form onSubmit={saveMedia} className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Display Title</label>
                       <input value={editingMedia.title} onChange={e => setEditingMedia({...editingMedia, title: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-2xl text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Thumbnail Link (Course Image)</label>
                       <input value={editingMedia.thumbnailUrl} onChange={e => setEditingMedia({...editingMedia, thumbnailUrl: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-2xl text-sm font-bold" />
                    </div>
                    <div className="flex gap-2">
                       <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-500/20">Apply Edits</button>
                       <button type="button" onClick={() => setEditingMedia(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase">Discard</button>
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
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
                 <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl relative z-10"><Film size={32} /></div>
                 <h4 className="text-2xl font-black relative z-10">Platform Media Hub</h4>
                 <p className="text-slate-400 text-sm max-w-xs relative z-10">Manage course lectures, shorts, and marketing banners. All changes reflect in student feeds instantly.</p>
              </div>
            </div>
          </div>
        );
      case 'blocks':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Building2 className="text-emerald-600" /> Digital Twin Map</h3>
                <button onClick={() => setIsAddingBlock(true)} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"><Plus size={16} /> Construct New Block</button>
             </div>
             {isAddingBlock && (
               <div className="bg-white p-8 rounded-[2.5rem] border-2 border-emerald-100 shadow-xl animate-in slide-in-from-top-4">
                  <form onSubmit={addBlock} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Block Identifier</label>
                        <input name="name" required placeholder="e.g. Science Complex" className="w-full px-5 py-3 bg-slate-50 border rounded-2xl text-sm font-bold" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Visual Asset URL</label>
                        <input name="image" placeholder="Photo link" className="w-full px-5 py-3 bg-slate-50 border rounded-2xl text-sm font-bold" />
                     </div>
                     <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Public Description</label>
                        <textarea name="desc" placeholder="What happens here?" className="w-full px-5 py-3 bg-slate-50 border rounded-2xl text-sm font-bold h-20" />
                     </div>
                     <div className="flex gap-2 md:col-span-2">
                        <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs">Deploy Block</button>
                        <button type="button" onClick={() => setIsAddingBlock(false)} className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs">Abort</button>
                     </div>
                  </form>
               </div>
             )}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buildings.map(b => (
                  <div key={b.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden group hover:shadow-xl transition-all">
                     <div className="h-32 bg-slate-200 relative"><img src={b.image} alt={b.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" /></div>
                     <div className="p-6">
                        <h4 className="text-lg font-black">{b.name}</h4>
                        <p className="text-xs text-slate-400 truncate mb-4">{b.description}</p>
                        <button className="w-full py-3 bg-slate-50 text-[10px] font-black uppercase text-slate-500 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors">Assign Faculty & Manage</button>
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
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><BookOpen className="text-blue-600" /> Academic Curriculum</h3>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                   {courses.map(c => (
                     <div key={c.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4 group hover:border-blue-200 transition-all">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all">{c.code}</div>
                        <div className="flex-1 overflow-hidden">
                           <h4 className="font-black text-slate-900 truncate">{c.name}</h4>
                           <p className="text-xs font-bold text-slate-400">Primary: {c.instructor}</p>
                        </div>
                        <button onClick={() => setEditingCourse(c)} className="p-3 text-slate-300 hover:text-blue-600 transition-all"><Edit3 size={18} /></button>
                     </div>
                   ))}
                </div>
                {editingCourse && (
                  <div className="bg-white p-8 rounded-[3rem] border border-blue-100 shadow-xl animate-in slide-in-from-right-4">
                     <h4 className="text-xl font-black mb-6 flex items-center gap-2 text-blue-600"><Edit3 size={20} /> Curriculum Editor</h4>
                     <form onSubmit={saveCourse} className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Official Name</label>
                           <input value={editingCourse.name} onChange={e => setEditingCourse({...editingCourse, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-2xl font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Assign Lead Faculty</label>
                           <select value={editingCourse.instructor} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-2xl font-bold appearance-none">
                              {facultyList.map(f => <option key={f.id}>{f.name}</option>)}
                           </select>
                        </div>
                        <div className="flex gap-2 pt-4">
                           <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-500/20">Sync Data</button>
                           <button type="button" onClick={() => setEditingCourse(null)} className="px-6 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase">Abort</button>
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
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Briefcase className="text-slate-700" /> Faculty Ledger</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facultyList.map(f => (
                  <div key={f.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-xl transition-all">
                     <button onClick={() => setEditingFaculty(f)} className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-300 rounded-xl hover:text-blue-600 transition-all"><Edit3 size={16} /></button>
                     <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] mb-4 flex items-center justify-center font-black text-xl">{f.name[0]}</div>
                     <h4 className="text-lg font-black leading-tight">{f.name}</h4>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 mb-4">{f.role}</p>
                     <div className="space-y-2 border-t pt-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500"><Building2 size={12} className="text-emerald-500"/> {f.block}</div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600"><BookOpen size={12} className="text-blue-500"/> Lecture: {f.load}</div>
                     </div>
                  </div>
                ))}
             </div>
             {editingFaculty && (
               <div className="fixed inset-0 z-[500] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
                  <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 space-y-8 animate-in zoom-in-95 shadow-2xl border border-slate-100">
                     <div>
                        <h3 className="text-2xl font-black leading-none mb-2">Edit Faculty Master</h3>
                        <p className="text-slate-400 text-sm font-medium italic">Administrative override for professional profile.</p>
                     </div>
                     <form onSubmit={saveFaculty} className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Name</label>
                           <input value={editingFaculty.name} onChange={e => setEditingFaculty({...editingFaculty, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-2xl font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Official Title</label>
                           <input value={editingFaculty.role} onChange={e => setEditingFaculty({...editingFaculty, role: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-2xl font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Location Assignment</label>
                           <select value={editingFaculty.block} onChange={e => setEditingFaculty({...editingFaculty, block: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-2xl font-bold appearance-none">
                              {buildings.map(b => <option key={b.id}>{b.name}</option>)}
                           </select>
                        </div>
                        <div className="flex gap-2 pt-6">
                           <button type="submit" className="flex-1 py-5 bg-slate-900 text-white rounded-[1.8rem] font-black uppercase shadow-lg shadow-slate-900/20">Authorize Sync</button>
                           <button type="button" onClick={() => setEditingFaculty(null)} className="px-8 py-5 bg-slate-100 text-slate-400 rounded-[1.8rem] font-black uppercase">Dismiss</button>
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
            <h4 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Palette className="text-blue-600" /> Platform Identity Master</h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Global Logo (Link or Single Letter)</label>
                <div className="flex gap-2">
                  <input value={logoInput} onChange={e => setLogoInput(e.target.value)} placeholder="https://... or 'S'" className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-700 outline-none focus:border-blue-500 transition-all shadow-inner" />
                  <button onClick={handleUpdateLogo} className="px-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-900/20">Push Branding</button>
                </div>
              </div>
            </div>
            {uploadSuccess && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black text-center animate-bounce">Branding synchronized across all platform nodes!</div>}
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
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Global <span className="text-blue-600">CRM</span></h2>
          </div>
          <p className="text-slate-500 font-medium italic">Administrative console for university infrastructure and identity.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
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
    bio: user.bio || 'Distinguished academic leader focusing on digital transformation and collaborative learning systems.',
    department: user.department,
    skills: user.skills?.join(', ') || 'AI, Architecture, Pedagogy'
  });

  const handleProfileSave = () => {
    setEditingProfile(false);
    alert('Your professional profile is now locally synchronized!');
  };

  const renderContent = () => {
    switch(activeSubTab) {
      case 'profile':
        return (
          <div className="max-w-4xl animate-in fade-in duration-500">
             <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-44 bg-blue-600 relative overflow-hidden">
                   <div className="absolute inset-0 opacity-10"><div className="w-full h-full bg-[radial-gradient(circle,white_1.5px,transparent_1.5px)] bg-[length:30px_30px]" /></div>
                </div>
                <div className="px-12 pb-12">
                   <div className="flex justify-between items-end -translate-y-20 relative z-10">
                      <div className="w-40 h-40 rounded-[2.8rem] bg-white border-8 border-white shadow-2xl flex items-center justify-center text-4xl font-black text-blue-600">{profileData.name[0]}</div>
                      <button onClick={() => setEditingProfile(!editingProfile)} className="mb-6 px-7 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
                        {editingProfile ? <><X size={16} /> Discard</> : <><Edit3 size={16} /> Edit Profile</>}
                      </button>
                   </div>
                   {editingProfile ? (
                     <div className="space-y-6 animate-in slide-in-from-top-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Name</label>
                              <input value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-bold shadow-inner" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Department</label>
                              <input value={profileData.department} onChange={e => setProfileData({...profileData, department: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-bold shadow-inner" />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Bio</label>
                           <textarea value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} className="w-full h-32 px-6 py-4 bg-slate-50 border rounded-2xl font-medium resize-none shadow-inner" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Skills</label>
                           <input value={profileData.skills} onChange={e => setProfileData({...profileData, skills: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-bold shadow-inner" />
                        </div>
                        <button onClick={handleProfileSave} className="w-full py-5 bg-blue-600 text-white rounded-[1.8rem] font-black uppercase shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">Commit Profile Sync</button>
                     </div>
                   ) : (
                     <div className="space-y-8 -mt-12">
                        <div>
                           <h3 className="text-4xl font-black text-slate-900">{profileData.name}</h3>
                           <div className="flex items-center gap-3 mt-2">
                              <p className="text-blue-600 font-black uppercase tracking-widest text-[11px]">{profileData.department}</p>
                              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Senior Faculty</p>
                           </div>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed max-w-2xl">{profileData.bio}</p>
                        <div className="flex flex-wrap gap-2">
                           {profileData.skills.split(',').map(s => <span key={s} className="px-5 py-2.5 bg-slate-50 text-slate-500 text-xs font-bold rounded-2xl border border-slate-100">{s.trim()}</span>)}
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
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-200 hover:shadow-xl transition-all">
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900">Broadcast Content</h3>
                    <p className="text-slate-500 font-medium italic">Publish lectures, assignments, or campus shorts.</p>
                 </div>
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md"><Plus size={32} /></div>
              </div>
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                 <h4 className="text-xl font-black mb-6">Recent Academic Streams</h4>
                 <div className="space-y-4">
                    {MOCK_VIDEOS.slice(0, 3).map(v => (
                      <div key={v.id} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[2.2rem] border border-slate-100/50 group hover:bg-white hover:border-blue-100 transition-all">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-sm"><img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" /></div>
                        <div className="flex-1 overflow-hidden">
                           <p className="text-xs font-black text-slate-900 truncate">{v.title}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Stream Active • {v.views} Views</p>
                        </div>
                        <button className="p-3 bg-white text-slate-300 rounded-xl hover:text-blue-600 transition-all shadow-sm"><Edit3 size={18} /></button>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 h-fit relative overflow-hidden">
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
               <div className="space-y-2 relative z-10">
                  <h3 className="text-2xl font-black">Platform Pulse</h3>
                  <p className="text-slate-400 text-sm font-medium italic">Engagement metrics for your hub.</p>
               </div>
               <div className="grid gap-4 relative z-10">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center hover:bg-white/10 transition-colors"><p className="text-4xl font-black text-blue-400 leading-none">428</p><p className="text-[10px] font-black uppercase text-slate-500 mt-2">Active Learners</p></div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center hover:bg-white/10 transition-colors"><p className="text-4xl font-black text-emerald-400 leading-none">92%</p><p className="text-[10px] font-black uppercase text-slate-500 mt-2">Retention Rate</p></div>
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
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Instructor <span className="text-blue-600">Hub</span></h2>
          <p className="text-slate-500 font-medium italic">Welcome to the classroom of tomorrow, Professor.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
           {[
             { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
             { id: 'lectures', label: 'My Media', icon: <PlaySquare size={18} /> },
             { id: 'profile', label: 'Professional', icon: <UserIcon size={18} /> },
           ].map(tab => (
             <button key={tab.id} onClick={() => setActiveSubTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${activeSubTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>
      </header>
      <div className="pt-4">{renderContent()}</div>
    </div>
  );
};

// --- Smart Attendance Component ---

const FacultyAttendance = ({ user }: { user: User }) => {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);

  const startSession = () => {
    setActive(true);
    globalAttendanceSession = { active: true, course: 'Cloud Architectures (CS402)', instructor: user.name };
    if (onAttendanceStarted) onAttendanceStarted(globalAttendanceSession);
  };

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => setCount(v => Math.min(v + 1, 45)), 1200);
      return () => clearInterval(interval);
    } else {
      setCount(0);
    }
  }, [active]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto text-center py-10">
      <div className="space-y-4 mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">AI Smart <span className="text-blue-600">Roster</span></h2>
        <p className="text-slate-500 font-medium italic">Real-time presence detection across the campus mesh network.</p>
      </div>
      <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-2xl flex flex-col items-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
        {!active ? (
          <>
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-inner relative z-10"><Camera size={48} /></div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-black text-slate-900 uppercase">Initialize Broadcaster</h3>
              <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">This will broadcast your session ID to all student devices in proximity.</p>
            </div>
            <button onClick={startSession} className="w-full py-6 bg-blue-600 text-white font-black rounded-[2rem] shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 relative z-10"><ScanFace size={24} /> Start Global Scan</button>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-inner animate-pulse relative z-10"><Users size={48} /></div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-black text-slate-900 uppercase">Mesh Synchronization Active</h3>
              <p className="text-blue-600 text-sm font-bold uppercase tracking-widest">CS402 - Cloud Architectures Hub</p>
            </div>
            <div className="w-full space-y-4 relative z-10">
               <div className="flex justify-between items-end"><span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Identity Synced</span><span className="text-4xl font-black text-emerald-600">{count}/45</span></div>
               <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden border border-slate-50"><div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(count/45)*100}%` }} /></div>
            </div>
            <button onClick={() => setActive(false)} className="w-full py-6 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-black transition-all flex items-center justify-center gap-2 relative z-10"><CheckCircle size={24} /> Secure & Finalize Roster</button>
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
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-top-20 duration-500">
      <div className="bg-white rounded-[2.8rem] shadow-2xl border-4 border-blue-50 p-8 flex flex-col items-center text-center space-y-6">
        <div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center animate-bounce ${marked ? 'bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-blue-50 text-blue-600 shadow-lg shadow-blue-500/20'}`}>
          {marked ? <CheckCircle size={40} /> : <AlertCircle size={40} />}
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900">{marked ? 'Session Synched!' : 'Active Hub Found!'}</h3>
          <p className="text-slate-500 font-medium text-sm">{marked ? 'Your academic presence is now on the ledger.' : `Authorize your node for Prof. ${session.instructor}'s lecture.`}</p>
        </div>
        {!marked && <button onClick={mark} className="w-full py-5 bg-blue-600 text-white font-black rounded-[1.8rem] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 hover:scale-105 transition-all"><ScanFace size={24} /> Sync My Hub Identity</button>}
      </div>
    </div>
  );
};

// --- Sidebar Navigation ---

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }: { activeTab: string, setActiveTab: (t: string) => void, user: User, onLogout: () => void }) => {
  const { logo } = useGlobalBranding();
  
  const items = user.role === UserRole.ADMIN 
    ? [
        { id: 'admin-dashboard', label: 'Command Center', icon: <Shield size={20} /> },
        { id: 'admin-crm', label: 'Platform CRM', icon: <Database size={20} /> },
        { id: 'navigation', label: 'Digital Twin Map', icon: <MapIcon size={20} /> },
      ]
    : user.role === UserRole.FACULTY
    ? [
        { id: 'faculty-dashboard', label: 'Instructor Hub', icon: <LayoutDashboard size={20} /> },
        { id: 'lectures', label: 'Media Streams', icon: <Video size={20} /> },
        { id: 'attendance', label: 'Smart Roster', icon: <ScanFace size={20} /> },
      ]
    : NAV_ITEMS;

  return (
    <aside className="w-64 bg-white shadow-xl h-screen hidden md:flex flex-col p-4 fixed left-0 top-0 z-50 border-r border-slate-100">
      <div className="flex items-center gap-3 mb-10 px-2 overflow-hidden">
        <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black italic shadow-xl shadow-blue-500/30 overflow-hidden shrink-0 border-2 border-white">
          {logo.length > 5 ? <img src={logo} alt="UNISTONE" className="w-full h-full object-cover" /> : <span>{logo}</span>}
        </div>
        <h1 className="text-2xl font-black text-blue-900 tracking-tighter truncate uppercase leading-none">UNISTONE</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {items.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all group ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}>
             <div className="group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
             <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 rounded-[2.2rem] bg-slate-50 border border-slate-100 space-y-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg border border-white"><UserIcon size={20} /></div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-slate-900 truncate leading-none">{user.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{user.role}</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full py-3 bg-white text-red-500 border border-red-50 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2 shadow-sm"><LogOut size={14} /> System Exit</button>
      </div>
    </aside>
  );
};

// --- Main Hub Component ---

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
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3 uppercase">Master <span className="text-blue-600">Console</span></h2>
            <p className="text-slate-500 font-medium italic">Global system oversight, academic infrastructure, and mesh network health.</p>
          </div>
          <button onClick={() => setActiveTab('admin-crm')} className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl hover:bg-black transition-all flex items-center gap-3 group">
             <Database size={24} className="group-hover:rotate-12 transition-transform" /> Platform CRM Terminal
          </button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Active User Nodes', val: '12,402', icon: <Users /> },
            { label: 'Network Integrity', val: '99.99%', icon: <RefreshCw /> },
            { label: 'Digital Assets', val: '4.2 TB', icon: <HardDrive /> },
            { label: 'Synchronized Hubs', val: '18', icon: <Activity /> }
          ].map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.8rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group cursor-default">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">{s.icon}</div>
              <p className="text-4xl font-black text-slate-900 leading-none">{s.val}</p>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
    if (activeTab === 'faculty-dashboard' && user.role === UserRole.FACULTY) return <FacultyDashboard user={user} />;
    if (activeTab === 'attendance' && user.role === UserRole.FACULTY) return <FacultyAttendance user={user} />;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-10 text-center animate-in zoom-in-95 duration-500">
         <div className="w-28 h-28 bg-blue-50 text-blue-600 rounded-[3rem] flex items-center justify-center shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(37,99,235,0.1)_1px,transparent_1px)] bg-[length:10px:10px]" />
            <Sliders size={56} className="relative z-10" />
         </div>
         <div className="space-y-3">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Module Sync Optimized</h2>
            <p className="text-slate-400 font-medium max-w-lg mx-auto italic text-lg leading-relaxed">This subsystem is currently under administrative synchronization for the latest UNISTONE digital standards.</p>
         </div>
         <button onClick={() => setActiveTab(user.role === UserRole.ADMIN ? 'admin-dashboard' : user.role === UserRole.FACULTY ? 'faculty-dashboard' : 'dashboard')} className="px-12 py-5 bg-blue-600 text-white rounded-[1.8rem] font-black shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all uppercase tracking-widest text-xs">Return to Main Hub</button>
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

// --- AI Concierge System ---

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
        <div className="w-80 md:w-96 h-[550px] bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
          <div className="p-6 bg-blue-600 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center border border-white/20"><Bot size={24} /></div>
              <div><p className="text-base font-black leading-none uppercase">UNISTONE AI</p><p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">Smart Concierge</p></div>
            </div>
            <button onClick={() => setOpen(false)} className="p-2.5 hover:bg-white/10 rounded-2xl transition-all"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50 custom-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-3 py-10">
                 <Bot size={48} />
                 <p className="text-sm font-bold italic max-w-[200px]">How can your intelligent campus assistant help streamline your day?</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[88%] p-4.5 rounded-[1.8rem] text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/10' : 'bg-white text-slate-700 shadow-sm rounded-tl-none border border-slate-100'}`}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="flex gap-1.5 p-3"><div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" /><div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" /></div>}
          </div>
          <div className="p-5 bg-white border-t border-slate-100 flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type your query..." className="flex-1 px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-[1.8rem] text-sm outline-none focus:border-blue-500 transition-all font-medium" />
            <button onClick={send} className="p-4.5 bg-blue-600 text-white rounded-[1.5rem] shadow-xl hover:scale-105 transition-all shadow-blue-500/20 active:scale-95"><Send size={20} /></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="w-18 h-18 bg-blue-600 text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 transition-all group border-4 border-white active:scale-95"><Bot size={34} /></button>
      )}
    </div>
  );
};
