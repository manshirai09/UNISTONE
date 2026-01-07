
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
  Sliders, UserPlus, Filter, Shield, Settings2, Power, Globe, Palette, RefreshCw
} from 'lucide-react';
import { User, UserRole, Video as VideoType, CampusBuilding, Course, MapCoords, CampusEvent, Authority, Project } from './types';
import { NAV_ITEMS, MOCK_BUILDINGS, MOCK_COURSES, MOCK_VIDEOS, MOCK_EVENTS, MOCK_JOBS, MOCK_POSTS, MOCK_SCHEDULE } from './constants';
import { askUnistoneAI } from './services/gemini';

// --- Attendance State Simulation ---
let globalAttendanceSession: { active: boolean; course: string; instructor: string } | null = null;
let onAttendanceStarted: ((session: { course: string; instructor: string }) => void) | null = null;

// --- Authentication Components ---

const AuthView = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [loading, setLoading] = useState(false);

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
        name: finalRole === UserRole.ADMIN ? 'System Administrator' : (finalRole === UserRole.FACULTY ? 'Prof. Alan Turing' : 'Sarah Connor'),
        email: email,
        role: finalRole,
        department: finalRole === UserRole.ADMIN ? 'IT Operations' : 'Computer Science',
        xp: finalRole === UserRole.STUDENT ? 1200 : 0,
        streak: finalRole === UserRole.STUDENT ? 5 : 0,
        bio: finalRole === UserRole.ADMIN ? 'Managing the UNISTONE ecosystem core infrastructure.' : 'Passionate learner exploring the intersection of AI and campus life.',
        skills: ['Cloud Computing', 'Data Science', 'React'],
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
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <span className={`font-black italic text-2xl ${isAdminPortal ? 'text-slate-900' : 'text-blue-600'}`}>U</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-4">UNISTONE</h1>
            <p className="text-blue-100 text-lg font-medium leading-relaxed opacity-90">
              {isAdminPortal 
                ? 'Central Management Terminal. Authorized access only.' 
                : 'The smart university experience. All your academic needs in one intelligent platform.'}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              {isAdminPortal ? <Shield size={24} /> : <ShieldCheck size={24} />}
            </div>
            <p className="text-xs font-bold text-blue-100 uppercase tracking-widest">{isAdminPortal ? 'Admin Node' : 'Verified Student Portal'}</p>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          {isAdminPortal && (
             <button onClick={() => { setIsAdminPortal(false); window.history.replaceState({}, '', window.location.pathname); }} className="absolute top-8 right-8 text-blue-600 font-bold text-xs flex items-center gap-1 hover:underline">
                <ChevronRight className="rotate-180" size={14}/> Switch to Student Login
             </button>
          )}
          
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
               {isAdminPortal ? 'Admin Terminal' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 font-medium">Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isAdminPortal && (
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  { r: UserRole.STUDENT, icon: <GraduationCap size={18} />, label: 'Student' },
                  { r: UserRole.FACULTY, icon: <BriefcaseIcon size={18} />, label: 'Faculty' }
                ].map(item => (
                  <button 
                    key={item.r}
                    type="button" 
                    onClick={() => setRole(item.r)} 
                    className={`py-3 rounded-xl flex flex-col items-center gap-1 border transition-all ${role === item.r ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {item.icon}
                    <span className="text-[9px] font-bold uppercase">{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="email" type="email" required placeholder="University Email" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="password" type="password" required placeholder="Password" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" />
            </div>

            <button disabled={loading} className={`w-full py-4 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-4 ${isAdminPortal ? 'bg-slate-900 shadow-slate-900/20 hover:bg-black' : 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700'}`}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isAdminPortal ? 'Execute Login' : 'Login Now'} <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Admin CRM View ---

const AdminCRMView = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'faculty' | 'system' | 'customization'>('students');
  
  const renderCRMContent = () => {
    switch (activeTab) {
      case 'students':
        return (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input placeholder="Search students..." className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-100 text-sm outline-none focus:border-blue-500" />
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"><UserPlus size={16} /> Register New Student</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-8 py-4">Name</th>
                    <th className="px-8 py-4">Enrollment</th>
                    <th className="px-8 py-4">Course</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Sarah Connor', id: 'UN24001', dept: 'B.Tech CS', status: 'Active' },
                    { name: 'John Doe', id: 'UN24042', dept: 'B.Pharm', status: 'On Leave' },
                    { name: 'Marcus Wright', id: 'UN24102', dept: 'Mechanical', status: 'Active' },
                  ].map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-all font-bold text-sm text-slate-600">
                      <td className="px-8 py-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">{s.name[0]}</div>
                        <span className="text-slate-900">{s.name}</span>
                      </td>
                      <td className="px-8 py-5">{s.id}</td>
                      <td className="px-8 py-5">{s.dept}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${s.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                          {s.status}
                        </span>
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
            {[
              { name: 'Dr. Alan Turing', role: 'Head of CS', status: 'Active', classes: 4 },
              { name: 'Prof. Richard Feynman', role: 'Physics Dean', status: 'Active', classes: 2 },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-black">{f.name[0]}</div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 text-slate-300 rounded-xl hover:text-blue-600 transition-all"><Edit3 size={18} /></button>
                    <button className="p-2 bg-slate-50 text-slate-300 rounded-xl hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-1">{f.name}</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{f.role}</p>
                <div className="flex justify-between items-center border-t border-slate-50 pt-6">
                  <span className="text-[10px] font-black text-emerald-500 uppercase">{f.status}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">{f.classes} Active Classes</span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'system':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                <h4 className="text-2xl font-black text-slate-900 flex items-center gap-2"><Globe className="text-blue-600" /> API & Services</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Gemini AI Integration', status: process.env.API_KEY ? 'Connected' : 'Missing Key', color: process.env.API_KEY ? 'text-emerald-500' : 'text-red-500' },
                    { label: 'Real-time Notifications', status: 'Live', color: 'text-emerald-500' },
                    { label: 'Map Navigation Engine', status: 'Optimized', color: 'text-blue-500' }
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                      <span className="text-sm font-black text-slate-700">{s.label}</span>
                      <span className={`text-[10px] font-black uppercase ${s.color}`}>{s.status}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2"><Settings2 size={18} /> Manage Access Keys</button>
              </div>
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-6">
                <h4 className="text-2xl font-black flex items-center gap-2"><Terminal className="text-emerald-400" /> System Control</h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div>
                      <p className="text-sm font-black">Maintenance Mode</p>
                      <p className="text-[10px] text-slate-400 font-bold">Restrict access for students</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-700 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div>
                      <p className="text-sm font-black">AI Voice Analysis</p>
                      <p className="text-[10px] text-slate-400 font-bold">Enable real-time audio input</p>
                    </div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                  </div>
                </div>
                <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all"><RefreshCw size={18} /> Sync Global State</button>
              </div>
            </div>
          </div>
        );
      case 'customization':
        return (
          <div className="max-w-3xl mx-auto bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500">
            <h4 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2"><Palette className="text-blue-600" /> Branding & Theme</h4>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Platform Name</label>
                  <input placeholder="UNISTONE" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Primary Color</label>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-xl bg-blue-600 ring-4 ring-blue-100" />
                    <button className="w-10 h-10 rounded-xl bg-emerald-600 hover:ring-4 ring-emerald-100 transition-all" />
                    <button className="w-10 h-10 rounded-xl bg-purple-600 hover:ring-4 ring-purple-100 transition-all" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h5 className="font-black text-slate-900 text-sm">Dashboard Announcements</h5>
                <textarea placeholder="Type a global broadcast message..." className="w-full h-32 px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium resize-none outline-none focus:border-blue-500" />
              </div>
              <button className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">Publish Customizations</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/30">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">Master <span className="text-blue-600">CRM</span></h2>
              <p className="text-slate-500 font-medium">Platform-wide control, oversight, and configuration.</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
           {[
             { id: 'students', label: 'Students', icon: <Users size={18} /> },
             { id: 'faculty', label: 'Faculty', icon: <BriefcaseIcon size={18} /> },
             { id: 'system', label: 'System', icon: <Database size={18} /> },
             { id: 'customization', label: 'Customize', icon: <Sliders size={18} /> },
           ].map(tab => (
             <button 
               key={tab.id} 
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}
             >
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>
      </header>

      <div className="pt-4">{renderCRMContent()}</div>
    </div>
  );
};

// --- Faculty Module: Instructor Hub ---

const FacultyDashboard = ({ user }: { user: User }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'lectures' | 'materials' | 'quizzes'>('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'video' | 'material' | 'quiz'>('video');

  const stats = [
    { label: 'Total Students', value: '428', trend: '+12%', icon: <Users className="text-blue-600" /> },
    { label: 'Published Lectures', value: '24', trend: '+2', icon: <PlaySquare className="text-emerald-600" /> },
    { label: 'Pending Assignments', value: '15', trend: '-5', icon: <FileText className="text-orange-600" /> },
    { label: 'Avg. Attendance', value: '92%', trend: '+1%', icon: <CheckCircle2 className="text-indigo-600" /> },
  ];

  const renderTabContent = () => {
    switch (activeSubTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-50 rounded-2xl">{s.icon}</div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${s.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>{s.trend}</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900 mb-1">{s.value}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2"><Clock className="text-blue-600" /> Upcoming Classes</h3>
                <div className="space-y-4">
                  {MOCK_SCHEDULE.slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50 group hover:border-blue-200 transition-all">
                      <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[8px] font-black text-blue-600 uppercase">{s.day}</span>
                        <span className="text-xs font-bold text-slate-900">10a</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-900">{s.subject}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{s.room} • {s.type}</p>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><ChevronRight size={20} /></button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2"><TrendingUp className="text-emerald-400" /> Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Upload Video', icon: <Video />, color: 'bg-blue-600', action: () => { setUploadType('video'); setShowUploadModal(true); } },
                    { label: 'Post Material', icon: <FileUp />, color: 'bg-emerald-600', action: () => { setUploadType('material'); setShowUploadModal(true); } },
                    { label: 'Create Quiz', icon: <QuizIcon />, color: 'bg-orange-600', action: () => { setUploadType('quiz'); setShowUploadModal(true); } },
                    { label: 'New Event', icon: <Calendar />, color: 'bg-purple-600', action: () => {} },
                  ].map((btn, i) => (
                    <button key={i} onClick={btn.action} className={`${btn.color} p-6 rounded-[2rem] flex flex-col items-center gap-3 hover:scale-105 transition-all shadow-lg active:scale-95`}>
                      {btn.icon}
                      <span className="text-xs font-black uppercase tracking-wider">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'lectures':
        return (
          <div className="space-y-6">
            <header className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Video Hub Management</h3>
              <button onClick={() => { setUploadType('video'); setShowUploadModal(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">
                <Plus size={20} /> Upload Video
              </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {MOCK_VIDEOS.map(v => (
                <div key={v.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                  <div className="h-40 relative">
                    <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase">{v.type}</div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                       <Play className="text-white fill-white" size={32} />
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                       <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{v.subject}</p>
                       <div className="flex items-center gap-1 text-slate-400"><Heart size={10} /><span className="text-[10px] font-bold">{v.likes}</span></div>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight line-clamp-2">{v.title}</h4>
                    <div className="flex gap-2 pt-2">
                       <button className="flex-1 py-2 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">Edit</button>
                       <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'materials':
        return (
          <div className="space-y-6">
             <header className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Notes & PYQ Section</h3>
              <button onClick={() => { setUploadType('material'); setShowUploadModal(true); }} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
                <Plus size={20} /> Upload Material
              </button>
            </header>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                        <th className="px-8 py-4">Material Title</th>
                        <th className="px-8 py-4">Type</th>
                        <th className="px-8 py-4">Subject</th>
                        <th className="px-8 py-4">Downloads</th>
                        <th className="px-8 py-4">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {[
                       { title: 'Data Structures Full Syllabus Notes', type: 'Notes', subject: 'CS301', dl: 124 },
                       { title: 'Algorithm 2023 End-Term PYQ', type: 'PYQ', subject: 'CS302', dl: 89 },
                       { title: 'Operating Systems Revision', type: 'Notes', subject: 'CS401', dl: 210 },
                       { title: 'Compiler Design 2022 PYQ', type: 'PYQ', subject: 'CS501', dl: 45 },
                     ].map((item, i) => (
                       <tr key={i} className="hover:bg-slate-50/50 transition-all font-bold text-sm text-slate-600">
                          <td className="px-8 py-4 flex items-center gap-3">
                             <div className={`p-2 rounded-lg ${item.type === 'PYQ' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}><FileStack size={16} /></div>
                             <span className="text-slate-900">{item.title}</span>
                          </td>
                          <td className="px-8 py-4"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.type === 'PYQ' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{item.type}</span></td>
                          <td className="px-8 py-4">{item.subject}</td>
                          <td className="px-8 py-4">{item.dl}</td>
                          <td className="px-8 py-4 flex gap-2">
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
      case 'quizzes':
        return (
          <div className="space-y-6">
            <header className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Quiz Management</h3>
              <button onClick={() => { setUploadType('quiz'); setShowUploadModal(true); }} className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-orange-500/20 hover:scale-105 transition-all">
                <Plus size={20} /> Create New Quiz
              </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { title: 'Data Structures Weekly Quiz 1', subject: 'CS301', questions: 15, duration: '20 min', status: 'Active' },
                 { title: 'Algorithm Complexity Test', subject: 'CS302', questions: 10, duration: '15 min', status: 'Closed' },
                 { title: 'Operating Systems Mid-Term', subject: 'CS401', questions: 30, duration: '45 min', status: 'Scheduled' },
               ].map((quiz, i) => (
                 <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-lg transition-all">
                    <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-[1.5rem] flex items-center justify-center">
                       <HelpCircle size={28} />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between mb-1">
                          <p className="text-[10px] font-black text-blue-600 uppercase">{quiz.subject}</p>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${quiz.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : quiz.status === 'Closed' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>{quiz.status}</span>
                       </div>
                       <h4 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">{quiz.title}</h4>
                       <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400"><FileText size={12} /> {quiz.questions} Qs</span>
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400"><Clock size={12} /> {quiz.duration}</span>
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
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">Instructor <span className="text-blue-600">Hub</span></h2>
          <p className="text-slate-500 font-medium">Manage your lectures, materials, and track student performance.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
           {[
             { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
             { id: 'lectures', label: 'Lectures', icon: <PlaySquare size={18} /> },
             { id: 'materials', label: 'Materials', icon: <Book size={18} /> },
             { id: 'quizzes', label: 'Quizzes', icon: <HelpCircle size={18} /> },
           ].map(tab => (
             <button 
               key={tab.id} 
               onClick={() => setActiveSubTab(tab.id as any)}
               className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${activeSubTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}
             >
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>
      </header>

      <div className="pt-4">{renderTabContent()}</div>

      {showUploadModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900">Upload {uploadType}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Share knowledge with your students</p>
                 </div>
                 <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Title</label>
                    <input placeholder={`Enter ${uploadType} title`} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-medium" />
                 </div>
                 <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center gap-4 text-center group hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-[1.5rem] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                       <Upload size={32} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-900">Drag & Drop or Click to Browse</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">MP4, PDF, or XLSX up to 500MB</p>
                    </div>
                 </div>
                 <button onClick={() => setShowUploadModal(false)} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">Publish {uploadType}</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Faculty Module: Smart Attendance ---

const FacultyAttendance = ({ user }: { user: User }) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [presentCount, setPresentCount] = useState(0);

  const startAttendance = () => {
    setSessionActive(true);
    globalAttendanceSession = { active: true, course: 'Data Structures (CS301)', instructor: user.name };
    if (onAttendanceStarted) onAttendanceStarted(globalAttendanceSession);
  };

  useEffect(() => {
    if (sessionActive) {
      const interval = setInterval(() => {
        setPresentCount(prev => Math.min(prev + 1, 45));
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setPresentCount(0);
    }
  }, [sessionActive]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Smart Attendance</h2>
        <p className="text-slate-500">Trigger attendance using AI Face Recognition.</p>
      </header>
      <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl flex flex-col items-center justify-center space-y-6 text-center">
        {!sessionActive ? (
          <>
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner">
              <Camera size={48} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Ready to Start</h3>
              <p className="text-sm text-slate-400 font-medium">Point your device at the students and capture attendance.</p>
            </div>
            <button onClick={startAttendance} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
              <ScanFace size={20} /> Capture & Notify Students
            </button>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center shadow-inner animate-pulse">
              <Users size={48} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Attendance Live</h3>
            <div className="w-full bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-end">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marked Present</p>
                 <p className="text-2xl font-black text-emerald-600">{presentCount}/45</p>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(presentCount/45)*100}%` }} /></div>
            </div>
            <button onClick={() => setSessionActive(false)} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <CheckCircle size={20} /> Finish Session
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// --- Attendance Popup Component (Student Side) ---

const AttendancePopup = ({ session, onMark }: { session: any, onMark: () => void }) => {
  const [marked, setMarked] = useState(false);
  const handleMark = () => {
    setMarked(true);
    setTimeout(onMark, 2000);
  };
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-top-10 duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-blue-100 p-6 flex flex-col items-center text-center space-y-4 ring-8 ring-blue-50/50">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-[1.5rem] flex items-center justify-center animate-bounce">
          {marked ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">{marked ? 'Marked Present!' : 'Class Attendance Live!'}</h3>
          <p className="text-xs text-slate-500 font-medium">{marked ? 'Presence recorded.' : `Prof. ${session.instructor} is taking attendance.`}</p>
        </div>
        {!marked && <button onClick={handleMark} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"><ScanFace size={20} /> Mark Me Present</button>}
      </div>
    </div>
  );
};

// --- Helper Sidebar ---

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }: { activeTab: string, setActiveTab: (t: string) => void, user: User, onLogout: () => void }) => {
  const getNavItems = () => {
    if (user.role === UserRole.ADMIN) {
      return [
        { id: 'admin-dashboard', label: 'Control Center', icon: <Shield size={20} /> },
        { id: 'admin-crm', label: 'System CRM', icon: <Database size={20} /> },
        { id: 'navigation', label: 'Campus Map', icon: <MapIcon size={20} /> },
      ];
    }
    if (user.role === UserRole.FACULTY) {
      return [
        { id: 'faculty-dashboard', label: 'Hub', icon: <LayoutDashboard size={20} /> },
        { id: 'lectures', label: 'My Lectures', icon: <Video size={20} /> },
        { id: 'attendance', label: 'Attendance', icon: <ScanFace size={20} /> },
      ];
    }
    return NAV_ITEMS;
  };

  return (
    <aside className="w-64 bg-white shadow-xl h-screen hidden md:flex flex-col p-4 fixed left-0 top-0 z-50 border-r border-slate-100">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white italic">U</div>
        <h1 className="text-xl font-bold text-blue-900">UNISTONE</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {getNavItems().map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
            <UserIcon size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full py-2 bg-white text-red-500 border border-red-50 text-xs font-bold rounded-lg hover:bg-red-50 flex items-center justify-center gap-2">
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

// --- Main App Flow ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSession, setActiveSession] = useState<any>(null);

  useEffect(() => {
    onAttendanceStarted = (session) => {
      if (user?.role === UserRole.STUDENT) setActiveSession(session);
    };
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
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">Admin <span className="text-blue-600">Control</span></h2>
            <p className="text-slate-500 font-medium">Manage the system core and oversight.</p>
          </div>
          <button onClick={() => setActiveTab('admin-crm')} className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
            <Database size={20} /> Open Integrated System CRM
          </button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Students', val: '12,402', icon: <Users /> },
            { label: 'Faculty Active', val: '458', icon: <Briefcase /> },
            { label: 'System Uptime', val: '99.9%', icon: <Activity /> },
            { label: 'Storage Used', val: '4.2 TB', icon: <HardDrive /> }
          ].map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">{s.icon}</div>
              <p className="text-3xl font-black text-slate-900">{s.val}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
    if (activeTab === 'faculty-dashboard' && user.role === UserRole.FACULTY) return <FacultyDashboard user={user} />;
    if (activeTab === 'attendance' && user.role === UserRole.FACULTY) return <FacultyAttendance user={user} />;
    
    // Default fallback
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black">Feature "{activeTab}" Coming Soon</h2>
        <p className="text-slate-500">The module is currently under development.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen gradient-bg">
      {activeSession && <AttendancePopup session={activeSession} onMark={() => setActiveSession(null)} />}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser(null)} />
      <main className="md:ml-64 p-4 md:p-8 h-screen flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 custom-scrollbar no-scrollbar">{renderContent()}</div>
      </main>
    </div>
  );
}
