
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
  Sliders, UserPlus, Filter
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

  // Check URL for hidden admin access: index.html?portal=admin
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
        department: finalRole === UserRole.ADMIN ? 'General Admin' : 'Computer Science',
        xp: finalRole === UserRole.STUDENT ? 1200 : 0,
        streak: finalRole === UserRole.STUDENT ? 5 : 0,
        bio: finalRole === UserRole.ADMIN ? 'System Administrator managing the UNISTONE ecosystem.' : 'Aspiring Full Stack Developer passionate about building innovative campus solutions.',
        skills: ['Infrastructure', 'Security', 'Data Management'],
        projects: [],
        githubUrl: 'https://github.com/admin',
        linkedinUrl: 'https://linkedin.com/in/admin'
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white min-h-[600px] animate-in fade-in zoom-in-95 duration-700">
        <div className={`md:w-1/2 p-12 text-white flex flex-col justify-between relative transition-all duration-500 ${isAdminPortal ? 'bg-slate-900' : 'academic-gradient'}`}>
          <div>
            <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>
              <span className={`font-black italic text-2xl ${isAdminPortal ? 'text-slate-900' : 'text-blue-600'}`}>U</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-4">UNISTONE</h1>
            <p className="text-blue-100 text-lg font-medium leading-relaxed opacity-90">
              {isAdminPortal 
                ? 'Central Management Authority. Authorized Personnel Only.' 
                : 'Unified ecosystem for Students and Faculty. Manage your campus life with intelligence.'}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              {isAdminPortal ? <Terminal size={24} /> : <ShieldCheck size={24} />}
            </div>
            <p className="text-xs font-bold text-blue-100">{isAdminPortal ? 'Internal Admin Network' : 'Verified Academic Portal'}</p>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          {isAdminPortal && (
             <button onClick={() => { setIsAdminPortal(false); window.history.replaceState({}, '', window.location.pathname); }} className="absolute top-8 right-8 text-blue-600 font-bold text-xs flex items-center gap-1 hover:underline">
                <ChevronRight className="rotate-180" size={14}/> Back to Student Login
             </button>
          )}
          
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
               {isAdminPortal ? 'Admin Login' : 'Portal Login'}
            </h2>
            <p className="text-slate-500 font-medium">
               {isAdminPortal ? 'Secure authentication for administrators' : 'Select your role and enter credentials'}
            </p>
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
              <input name="email" type="email" required placeholder={isAdminPortal ? "Admin ID / Email" : "University Email"} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="password" type="password" required placeholder="Password" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" />
            </div>

            <button disabled={loading} className={`w-full py-4 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-4 ${isAdminPortal ? 'bg-slate-900 shadow-slate-900/20 hover:bg-black' : 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700'}`}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isAdminPortal ? 'Enter Terminal' : 'Login'} <ArrowRight size={18} /></>}
            </button>
          </form>

          {isAdminPortal && (
            <div className="mt-12 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                Authorized Personnel Access Only. Unauthorized attempts are logged.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }: { activeTab: string, setActiveTab: (t: string) => void, user: User, onLogout: () => void }) => {
  const getNavItems = () => {
    if (user.role === UserRole.ADMIN) {
      return [
        { id: 'admin-dashboard', label: 'Control Center', icon: <ShieldCheck size={20} /> },
        { id: 'admin-crm', label: 'System CRM', icon: <Database size={20} /> },
        { id: 'navigation', label: 'Blocks Mgmt', icon: <MapIcon size={20} /> },
        { id: 'users', label: 'Admin Directory', icon: <Users size={20} /> },
      ];
    }
    if (user.role === UserRole.FACULTY) {
      return [
        { id: 'faculty-dashboard', label: 'Instructor Hub', icon: <LayoutDashboard size={20} /> },
        { id: 'lectures', label: 'My Lectures', icon: <Video size={20} /> },
        { id: 'attendance', label: 'Smart Attendance', icon: <ScanFace size={20} /> },
        { id: 'events', label: 'Campus Events', icon: <Calendar size={20} /> },
      ];
    }
    return NAV_ITEMS;
  };

  const handleNavClick = (id: string) => {
    setActiveTab(id);
  };

  return (
    <aside className="w-64 bg-white shadow-xl h-screen hidden md:flex flex-col p-4 fixed left-0 top-0 z-50 border-r border-slate-100">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white italic">U</div>
        <h1 className="text-xl font-bold tracking-tight text-blue-900">UNISTONE</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {getNavItems().map((item) => (
          <button key={item.id} onClick={() => handleNavClick(item.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
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

// --- AI Assistant Component ---

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await askUnistoneAI(userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: response || "I'm sorry, I couldn't process that request." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Something went wrong. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-5 bg-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-sm font-black tracking-tight">UNISTONE AI</p>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Bot size={32} />
                </div>
                <div>
                  <p className="font-black text-slate-900 tracking-tight">Campus Concierge</p>
                  <p className="text-xs text-slate-500 font-medium">How can I assist your campus life today?</p>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10' : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-white border-t border-slate-100">
            <div className="relative">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..." 
                className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-500/20 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] shadow-2xl shadow-blue-500/40 flex items-center justify-center hover:scale-110 hover:rotate-3 transition-all group relative border-4 border-white"
        >
          <Bot size={32} />
          <div className="absolute right-full mr-6 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-xl">
            Ask UNISTONE AI
          </div>
        </button>
      )}
    </div>
  );
};

// --- Admin Module: Control Center ---

const AdminDashboard = ({ onOpenCRM }: { onOpenCRM: () => void }) => {
  const stats = [
    { label: 'Active Students', value: '12,402', icon: <Users className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'System Uptime', value: '99.9%', icon: <Activity className="text-emerald-600" />, color: 'bg-emerald-50' },
    { label: 'Data Storage', value: '4.2 TB', icon: <HardDrive className="text-purple-600" />, color: 'bg-purple-50' },
    { label: 'Pending Approvals', value: '24', icon: <ShieldAlert className="text-orange-600" />, color: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">Admin <span className="text-blue-600">Control Center</span></h2>
          <p className="text-slate-500 font-medium">Global campus management, user directory, and security oversight.</p>
        </div>
        <div className="flex gap-4">
           <button onClick={onOpenCRM} className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
              <Database size={20} /> Launch Integrated CRM
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
             <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {s.icon}
             </div>
             <p className="text-4xl font-black text-slate-900 mb-1">{s.value}</p>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10">
            <h3 className="text-2xl font-black text-slate-900 mb-8">System Health & Traffic</h3>
            <div className="h-64 bg-slate-50 rounded-3xl border border-slate-100 flex items-end justify-between p-8 gap-2">
               {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                 <div key={i} className="flex-1 bg-blue-600 rounded-t-xl opacity-80 hover:opacity-100 transition-all" style={{ height: `${h}%` }} />
               ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
               <div className="text-center p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-black text-blue-600">92ms</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Avg Latency</p>
               </div>
               <div className="text-center p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-black text-emerald-600">0.02%</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Error Rate</p>
               </div>
               <div className="text-center p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-black text-purple-600">12.4k</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Requests/s</p>
               </div>
               <div className="text-center p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-black text-orange-600">42</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Active Bans</p>
               </div>
            </div>
         </div>
         <div className="bg-slate-900 rounded-[3rem] p-10 text-white">
            <h3 className="text-2xl font-black mb-8">Recent Notifications</h3>
            <div className="space-y-6">
               {[
                 { title: 'Server Upgrade', time: '12m ago', level: 'Normal' },
                 { title: 'Security Patch Applied', time: '1h ago', level: 'Critical' },
                 { title: 'New Faculty Registered', time: '4h ago', level: 'Audit' },
               ].map((n, i) => (
                 <div key={i} className="flex gap-4 items-start pb-6 border-b border-white/10 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <div>
                       <p className="text-sm font-black">{n.title}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{n.time} • {n.level}</p>
                    </div>
                 </div>
               ))}
            </div>
            <button onClick={onOpenCRM} className="w-full py-4 mt-8 bg-white/10 border border-white/20 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
               Open Internal CRM <ArrowRight size={14} />
            </button>
         </div>
      </div>
    </div>
  );
};

// --- Admin CRM Module: System Management ---

const AdminCRMView = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'faculty' | 'content' | 'settings'>('students');
  const [search, setSearch] = useState('');

  const renderCRMContent = () => {
    switch (activeTab) {
      case 'students':
        return (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students by name or enrollment..." 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus:border-blue-500 transition-all text-sm outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 transition-all"><Filter size={18} /></button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"><UserPlus size={16} /> Add Student</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-8 py-4">Student Name</th>
                    <th className="px-8 py-4">ID / Roll</th>
                    <th className="px-8 py-4">Department</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Sarah Connor', id: 'UN24001', dept: 'Computer Science', status: 'Active' },
                    { name: 'John Doe', id: 'UN24042', dept: 'Mechanical', status: 'On Probation' },
                    { name: 'Emily Blunt', id: 'UN24102', dept: 'Pharmacy', status: 'Active' },
                    { name: 'Robert Downey', id: 'UN24088', dept: 'Civil Eng', status: 'Graduated' },
                  ].map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-all font-bold text-sm text-slate-600">
                      <td className="px-8 py-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">{s.name[0]}</div>
                        <span className="text-slate-900">{s.name}</span>
                      </td>
                      <td className="px-8 py-5">{s.id}</td>
                      <td className="px-8 py-5">{s.dept}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${s.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : s.status === 'Graduated' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical size={18} /></button>
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
              { name: 'Dr. Alan Turing', role: 'Head of CS', classes: 4, students: 120 },
              { name: 'Prof. Richard Feynman', role: 'Physics Dean', classes: 2, students: 45 },
              { name: 'Dr. Neha Gupta', role: 'Pharmacy HOD', classes: 5, students: 210 },
              { name: 'Ar. Zaha Hadid', role: 'Architecture Lead', classes: 3, students: 80 },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-black">{f.name[0]}</div>
                  <button className="p-2 bg-slate-50 text-slate-300 rounded-xl group-hover:text-blue-600 transition-all"><Edit3 size={18} /></button>
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-1">{f.name}</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{f.role}</p>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Active Classes</p>
                    <p className="text-lg font-black text-slate-900">{f.classes}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Managed Students</p>
                    <p className="text-lg font-black text-slate-900">{f.students}</p>
                  </div>
                </div>
              </div>
            ))}
            <button className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-blue-500 hover:border-blue-100 hover:bg-blue-50/20 transition-all">
              <Plus size={48} />
              <span className="font-black text-sm uppercase">Recruit Faculty</span>
            </button>
          </div>
        );
      case 'content':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2">
                <h4 className="text-2xl font-black">Campus Broadcast Control</h4>
                <p className="text-slate-400 text-sm font-medium">Send push notifications or update the global dashboard announcements.</p>
              </div>
              <button className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-blue-500/20">Send New Alert</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                  <h5 className="font-black text-slate-900 text-lg flex items-center gap-2"><PlaySquare className="text-blue-600" /> Video Hub Statistics</h5>
                  <div className="space-y-4">
                     {[
                       { label: 'Short Lectures', count: 124, trend: '+12 this week' },
                       { label: 'Course Lectures', count: 89, trend: '+4 this week' },
                       { label: 'Reported Content', count: 2, trend: 'Action Required' }
                     ].map((s, i) => (
                       <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                          <div>
                            <p className="text-xs font-black text-slate-900">{s.label}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{s.trend}</p>
                          </div>
                          <span className="text-xl font-black text-blue-600">{s.count}</span>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                  <h5 className="font-black text-slate-900 text-lg flex items-center gap-2"><FileStack className="text-emerald-600" /> Resource Management</h5>
                  <div className="space-y-4">
                     {[
                       { label: 'Total Notes', count: '1.2k', load: '65%' },
                       { label: 'PYQ Archive', count: '450', load: '92%' },
                       { label: 'Storage Used', count: '4.2 TB', load: '45%' }
                     ].map((s, i) => (
                       <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs font-black text-slate-600">{s.label} ({s.count})</span>
                            <span className="text-xs font-black text-slate-400">{s.load}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: s.load }} />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-3xl mx-auto bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
             <h4 className="text-2xl font-black text-slate-900 mb-8">Platform Configuration</h4>
             <div className="space-y-8">
                {[
                  { label: 'Admission Portal', desc: 'Accept new student registrations', active: true },
                  { label: 'AI Voice Search', desc: 'Allow voice queries for students', active: true },
                  { label: 'Faculty Upload Privileges', desc: 'Allow instructors to publish materials', active: true },
                  { label: 'Maintenance Mode', desc: 'Restrict student access for system upgrades', active: false },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                    <div>
                      <p className="font-black text-slate-900">{s.label}</p>
                      <p className="text-xs text-slate-400 font-medium">{s.desc}</p>
                    </div>
                    <button className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${s.active ? 'bg-blue-600' : 'bg-slate-200'}`}>
                       <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${s.active ? 'left-7' : 'left-1 shadow-sm'}`} />
                    </button>
                  </div>
                ))}
             </div>
             <button className="w-full py-5 mt-10 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2">
                <ShieldCheck size={20} /> Deploy Master Settings
             </button>
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
            <Database className="text-blue-600" size={32} />
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">System <span className="text-blue-600">CRM</span></h2>
          </div>
          <p className="text-slate-500 font-medium">Unified management for students, faculty, content, and system configurations.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
           {[
             { id: 'students', label: 'Students', icon: <Users size={18} /> },
             { id: 'faculty', label: 'Faculty', icon: <BriefcaseIcon size={18} /> },
             { id: 'content', label: 'Content', icon: <Layers size={18} /> },
             { id: 'settings', label: 'System', icon: <Sliders size={18} /> },
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
          <p className="text-slate-500 font-medium">Manage your lectures, materials, quizzes and track student performance.</p>
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

      {/* Upload Modal Simulation */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
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
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Course / Subject</label>
                       <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-medium appearance-none">
                          <option>CS301 - Data Structures</option>
                          <option>PH405 - Quantum Physics</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Type</label>
                       <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-medium appearance-none">
                          {uploadType === 'video' ? (
                            <><option>Short Lecture</option><option>Full Lecture</option></>
                          ) : uploadType === 'material' ? (
                            <><option>Notes</option><option>PYQ</option><option>Assignment</option></>
                          ) : (
                            <><option>Graded Quiz</option><option>Practice Quiz</option></>
                          )}
                       </select>
                    </div>
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
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [presentCount, setPresentCount] = useState(0);

  const startAttendance = () => {
    setTakingPhoto(true);
    // Simulate photo processing
    setTimeout(() => {
      setTakingPhoto(false);
      setSessionActive(true);
      globalAttendanceSession = { active: true, course: 'Data Structures (CS301)', instructor: user.name };
      if (onAttendanceStarted) onAttendanceStarted(globalAttendanceSession);
    }, 2000);
  };

  const endAttendance = () => {
    setSessionActive(false);
    globalAttendanceSession = null;
  };

  useEffect(() => {
    // Simulate real-time increment of attendance as students mark present
    if (sessionActive) {
      const interval = setInterval(() => {
        setPresentCount(prev => Math.min(prev + Math.floor(Math.random() * 3), 45));
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setPresentCount(0);
    }
  }, [sessionActive]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Smart Attendance</h2>
        <p className="text-slate-500">Trigger attendance using AI Face Recognition. Students will be notified instantly.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl flex flex-col items-center justify-center space-y-6 text-center">
          {!sessionActive ? (
            <>
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                {takingPhoto ? <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /> : <Camera size={48} />}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{takingPhoto ? 'Scanning Class...' : 'Ready to Start'}</h3>
                <p className="text-sm text-slate-400 font-medium">Point your device at the students and capture a photo.</p>
              </div>
              <button 
                onClick={startAttendance}
                disabled={takingPhoto}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ScanFace size={20} /> Capture & Notify Students
              </button>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center shadow-inner animate-pulse">
                <Users size={48} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Attendance Live</h3>
                <p className="text-sm text-slate-400 font-medium tracking-tight">Session active for CS301 - Data Structures</p>
              </div>
              <div className="w-full bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marked Present</p>
                   <p className="text-2xl font-black text-emerald-600">{presentCount}/45</p>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                   <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(presentCount/45)*100}%` }} />
                </div>
              </div>
              <button 
                onClick={endAttendance}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} /> Finish Session
              </button>
            </>
          )}
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-6">
          <h3 className="text-xl font-black flex items-center gap-2"><Trophy className="text-orange-400" /> Attendance Logs</h3>
          <div className="space-y-4">
             {[
               { date: 'Today, 10:00 AM', course: 'CS301', present: '42/45', status: 'Completed' },
               { date: 'Yesterday, 02:00 PM', course: 'CS402', present: '38/40', status: 'Completed' },
               { date: 'Oct 20, 11:30 AM', course: 'CS301', present: '44/45', status: 'Completed' }
             ].map((log, i) => (
               <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <p className="text-xs font-black text-white">{log.course} • {log.date}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.status}</p>
                  </div>
                  <span className="text-sm font-black text-blue-400">{log.present}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Attendance Notification Component (Student Side) ---

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
          <p className="text-xs text-slate-500 font-medium">
            {marked 
              ? 'Your presence has been recorded for today.' 
              : `Prof. ${session.instructor} is taking attendance for ${session.course}.`}
          </p>
        </div>
        {!marked && (
          <button 
            onClick={handleMark}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <ScanFace size={20} /> Mark Me Present
          </button>
        )}
      </div>
    </div>
  );
};

// --- Edustone Hub Module ---

const EdustoneView = ({ user }: { user: User }) => {
  const [subTab, setSubTab] = useState('courses');

  const EDU_TABS = [
    { id: 'courses', label: 'Courses', icon: <Book size={18} /> },
    { id: 'community', label: 'Community', icon: <CommunityIcon size={18} /> },
    { id: 'careers', label: 'Jobs & Projects', icon: <Laptop size={18} /> },
    { id: 'progress', label: 'Attendance', icon: <ClipboardCheck size={18} /> },
    { id: 'schedule', label: 'Schedule', icon: <CalendarDays size={18} /> },
  ];

  const renderSubContent = () => {
    switch (subTab) {
      case 'courses':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {MOCK_COURSES.map(course => (
              <div key={course.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {course.code.slice(0,2)}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{course.code}</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight">{course.name}</h4>
                <p className="text-sm text-slate-500 font-medium mb-6 italic">{course.instructor}</p>
                <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <FileText size={14} className="text-blue-500" /> {course.notesCount} Notes
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <Video size={14} className="text-indigo-500" /> {course.lecturesCount} Lectures
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'community':
        return (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
              <img src={`https://i.pravatar.cc/100?u=${user.id}`} className="w-12 h-12 rounded-2xl object-cover" />
              <input placeholder="Share an update or ask a question..." className="flex-1 bg-slate-50 rounded-2xl px-6 py-3 text-sm outline-none border border-slate-50 focus:border-blue-200" />
              <button className="p-3 bg-blue-600 text-white rounded-2xl hover:scale-105 transition-all"><Send size={20} /></button>
            </div>
            {MOCK_POSTS.map(post => (
              <div key={post.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center font-black text-blue-600">
                      {post.author[0]}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">{post.author}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.role} • {post.time}</p>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600"><Heart size={16} /> {post.likes}</button>
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600"><MessageCircle size={16} /> {post.comments}</button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'careers':
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <section className="space-y-4">
              <h4 className="text-xl font-black text-slate-900">Fresh Jobs & Internships</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_JOBS.map(job => (
                  <div key={job.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">{job.type}</div>
                      <span className="text-xs font-black text-blue-600">{job.salary}</span>
                    </div>
                    <h5 className="font-black text-slate-900 text-lg">{job.title}</h5>
                    <p className="text-sm font-bold text-slate-400 mb-6">{job.company} • {job.location}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {job.tags.map(t => <span key={t} className="px-2 py-1 bg-slate-50 text-[9px] font-bold text-slate-500 rounded-lg">{t}</span>)}
                      </div>
                      <button className="text-blue-600 font-black text-xs hover:underline flex items-center gap-1">Apply Now <ExternalLink size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="space-y-4">
              <h4 className="text-xl font-black text-slate-900">Upcoming Hackathons & Competitions</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {MOCK_EVENTS.filter(e => e.type === 'hackathon' || e.type === 'competition').map(event => (
                  <div key={event.id} className="bg-slate-900 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl group border border-slate-800">
                    <img src={event.flyerUrl} className="w-full md:w-48 h-48 md:h-auto object-cover opacity-60 group-hover:opacity-100 transition-all" />
                    <div className="p-6 flex flex-col justify-center space-y-3">
                      <div className="inline-flex px-3 py-1 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase w-fit">{event.type}</div>
                      <h5 className="text-lg font-black text-white">{event.title}</h5>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <Calendar size={14} /> {event.date}
                        <Trophy size={14} /> ₹1.5L Prize
                      </div>
                      <button className="w-full py-3 bg-white text-slate-900 font-black rounded-xl text-xs hover:bg-blue-50 transition-all">Register Team</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'progress':
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Overall Attendance', val: '92%', color: 'text-emerald-500' },
                { label: 'Lectures Attended', val: '84/90', color: 'text-blue-600' },
                { label: 'Academic Standing', val: 'Distinction', color: 'text-indigo-600' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                  <p className={`text-4xl font-black mb-2 ${stat.color}`}>{stat.val}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <h4 className="font-black text-slate-900 tracking-tight">Subject-wise Attendance</h4>
                <button className="px-4 py-2 bg-white rounded-xl border border-slate-100 text-xs font-bold text-slate-500 hover:text-blue-600 transition-all flex items-center gap-2"><Download size={14} /> Download Report</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                      <th className="px-8 py-4">Course</th>
                      <th className="px-8 py-4">Total Classes</th>
                      <th className="px-8 py-4">Present</th>
                      <th className="px-8 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold text-sm text-slate-600">
                    {MOCK_COURSES.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-4 text-slate-900">{c.name}</td>
                        <td className="px-8 py-4">24</td>
                        <td className="px-8 py-4">22</td>
                        <td className="px-8 py-4"><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black">GOOD</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
              <h4 className="text-2xl font-black text-slate-900">Academic Calendar</h4>
              <div className="flex gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
                  <button key={d} className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${d === 'Mon' ? 'bg-blue-600 text-white shadow-xl' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}>{d}</button>
                ))}
              </div>
            </header>
            <div className="space-y-4">
              {MOCK_SCHEDULE.map((item, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-8 hover:shadow-lg transition-all group">
                  <div className="w-32 border-r border-slate-50">
                    <p className="text-lg font-black text-slate-900">{item.time}</p>
                    <p className="text-[10px] font-black text-blue-600 uppercase">{item.day}</p>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.subject}</h5>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><MapPin size={14} /> {item.room}</span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><Clock size={14} /> {item.type}</span>
                    </div>
                  </div>
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all"><Bell size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">Edustone <span className="text-blue-600">Hub</span></h2>
          <p className="text-slate-500 font-medium">Your unified academic dashboard for learning, progress, and career growth.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          {EDU_TABS.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${subTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="pt-4">{renderSubContent()}</div>
    </div>
  );
};

// --- Events View ---

const EventsView = ({ user }: { user: User }) => {
  const [filter, setFilter] = useState<'all' | 'hackathon' | 'workshop' | 'competition' | 'cultural'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesFilter = filter === 'all' || event.type === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const CATEGORIES = [
    { id: 'all', label: 'All Events', icon: <CalendarDays size={18} /> },
    { id: 'hackathon', label: 'Hackathons', icon: <Laptop size={18} /> },
    { id: 'workshop', label: 'Workshops', icon: <BookOpen size={18} /> },
    { id: 'competition', label: 'Competitions', icon: <Trophy size={18} /> },
    { id: 'cultural', label: 'Cultural', icon: <Users2 size={18} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">Campus <span className="text-blue-600">Events</span></h2>
          <p className="text-slate-500 font-medium">Discover, participate and grow with university-wide events.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..." 
                className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-medium w-full md:w-64 shadow-sm"
              />
           </div>
        </div>
      </header>

      <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setFilter(cat.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${filter === cat.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col">
            <div className="h-52 relative overflow-hidden">
              <img src={event.flyerUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
              <div className="absolute top-4 left-4 flex gap-2">
                 <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase border border-white/20">{event.type}</span>
                 {event.isPopular && <span className="px-3 py-1 bg-orange-50 rounded-full text-[9px] font-black text-white uppercase flex items-center gap-1"><Flame size={10} /> Popular</span>}
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                   <Calendar size={14} />
                   <span className="text-[10px] font-black uppercase tracking-widest">{event.date} • {event.time}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                <p className="text-sm text-slate-500 font-medium line-clamp-2">{event.description}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                   <div className="flex items-center gap-2 text-slate-500">
                      <MapPin size={14} className="text-blue-400" />
                      <span className="text-[10px] font-bold">{event.location}</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-500">
                      <Users size={14} className="text-blue-400" />
                      <span className="text-[10px] font-bold">{event.registeredCount} Registered</span>
                   </div>
                </div>
                <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <Ticket size={18} /> Register Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
           <Calendar className="mx-auto text-slate-200 mb-4" size={64} />
           <p className="text-xl font-black text-slate-900">No events found</p>
           <p className="text-slate-400 font-medium">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
};

// --- Profile View ---

const ProfileView = ({ user }: { user: User }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <button className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/30 rounded-2xl text-white transition-all flex items-center gap-2 text-xs font-bold">
            <Camera size={16} /> Edit Cover
          </button>
        </div>
        <div className="px-10 pb-10">
          <div className="relative -mt-20 mb-6 flex flex-col md:flex-row md:items-end gap-6">
            <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl relative">
              <img src={`https://i.pravatar.cc/300?u=${user.id}`} className="w-full h-full rounded-[2rem] object-cover" />
              <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl border-4 border-white shadow-xl hover:scale-110 transition-all">
                <Edit3 size={16} />
              </button>
            </div>
            <div className="flex-1 pb-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{user.name}</h2>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">{user.department} • {user.role}</p>
              <div className="flex gap-4 mt-4">
                <a href={user.linkedinUrl} target="_blank" className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100 flex items-center gap-2">
                  <Linkedin size={20} /> <span className="text-xs font-bold">LinkedIn</span>
                </a>
                <a href={user.githubUrl} target="_blank" className="p-3 bg-slate-50 text-slate-700 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100 flex items-center gap-2">
                  <Github size={20} /> <span className="text-xs font-bold">GitHub</span>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
            <div className="lg:col-span-2 space-y-10">
              <section className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Info className="text-blue-600" size={24} /> About Me
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  {user.bio}
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <BriefcaseIcon className="text-blue-600" size={24} /> Professional Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {user.skills?.map((skill, i) => (
                    <span key={i} className="px-5 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm font-bold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-all cursor-default">
                      {skill}
                    </span>
                  ))}
                  <button className="p-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all">
                    <Plus size={20} />
                  </button>
                </div>
              </section>

              {/* Account Connections Section */}
              <section className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Link2 className="text-blue-600" size={24} /> Connected Accounts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Linkedin size={24} />
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900">LinkedIn Profile</p>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase">Connected</p>
                         </div>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-blue-600 transition-all"><ExternalLink size={18} /></button>
                   </div>
                   <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-slate-900 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center">
                            <Github size={24} />
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900">GitHub Repository</p>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase">Connected</p>
                         </div>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-slate-900 transition-all"><ExternalLink size={18} /></button>
                   </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Layers className="text-blue-600" size={24} /> Featured Projects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.projects?.map((proj, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Compass size={24} />
                        </div>
                        <a href={proj.link} className="text-slate-400 hover:text-blue-600"><ExternalLink size={18} /></a>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2">{proj.title}</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                  <button className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center gap-3 text-slate-400 hover:bg-slate-50 hover:border-blue-300 transition-all">
                    <Plus size={32} />
                    <span className="font-bold text-sm">Add New Project</span>
                  </button>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <TrendingUp className="text-blue-400" size={20} /> Career Readiness
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400">Profile Completion</span>
                      <span className="text-xs font-black text-blue-400">85%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><CheckCircle2 size={16} /></div>
                      <span className="text-xs font-bold">Resume Uploaded</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><CheckCircle2 size={16} /></div>
                      <span className="text-xs font-bold">LinkedIn Synced</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><CheckCircle2 size={16} /></div>
                      <span className="text-xs font-bold">GitHub Connected</span>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                    <FileText size={18} /> View Resume
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Academic Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-2xl text-center">
                    <p className="text-2xl font-black text-blue-600">{user.xp}</p>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Total XP</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-2xl text-center">
                    <p className="text-2xl font-black text-orange-600">{user.streak}</p>
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Day Streak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Campus Navigation Module ---

const CampusHero = ({ onExplore }: { onExplore: () => void }) => {
  return (
    <div className="flex flex-col gap-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="lg:w-1/2 space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-xs font-bold tracking-wide uppercase">
            Smart Campus Navigation
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
            SAGE University <br /> Navigator - <span className="text-blue-600">Smart Campus</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
            Find buildings, contact authorities, check class schedules, and get instant help with our AI-powered campus assistant.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2">
              <MessageSquare size={20} /> Ask AI Assistant
            </button>
            <button 
              onClick={onExplore}
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Building2 size={20} /> Explore Buildings
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 w-full">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white ring-1 ring-slate-100 transform rotate-1">
            <img 
              src="https://storage.googleapis.com/demo-v-images/image-1718871306.png" 
              className="w-full h-[450px] object-cover" 
              alt="SAGE University Campus" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CampusMap = ({ onSelect }: { onSelect: (b: CampusBuilding) => void }) => {
  return (
    <div className="relative w-full h-[600px] bg-emerald-50/30 rounded-[3rem] overflow-hidden border border-emerald-100 shadow-inner group">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      {MOCK_BUILDINGS.map((b) => (
        <div 
          key={b.id}
          className="map-pin group/pin"
          style={{ top: b.mapCoords.top, left: b.mapCoords.left }}
          onClick={() => onSelect(b)}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white shadow-2xl ring-4 ring-white transition-all transform hover:scale-125 hover:rotate-12 cursor-pointer">
              <MapPin size={20} />
            </div>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/pin:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
              <div className="bg-white px-4 py-2 rounded-xl shadow-xl border border-blue-50">
                <p className="text-xs font-bold text-blue-900">{b.name}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const BuildingDetails = ({ building, onBack }: { building: CampusBuilding, onBack: () => void }) => {
  return (
    <div className="animate-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="xl:w-8/12 space-y-8">
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100">
            <div className="relative h-96">
              <img src={building.image} className="w-full h-full object-cover" alt={building.name} />
              <button onClick={onBack} className="absolute top-8 left-8 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-slate-900 transition-all"><ChevronRight className="rotate-180" size={24} /></button>
              <div className="absolute bottom-10 left-10 text-white drop-shadow-lg">
                <h2 className="text-5xl font-black tracking-tighter mb-2">{building.name}</h2>
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/20">{building.floors} Floors</span>
              </div>
            </div>
            <div className="p-10">
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 border-b border-slate-50 pb-8">{building.description}</p>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6"><h4 className="text-xl font-black tracking-tight flex items-center gap-2"><Users size={24} /> Departments</h4><ul className="space-y-4">{building.departments.map((dept, i) => (<li key={i} className="flex items-center gap-3 font-bold text-slate-600"><div className="w-2 h-2 rounded-full bg-blue-500" />{dept}</li>))}</ul></div>
                <div className="space-y-6"><h4 className="text-xl font-black tracking-tight flex items-center gap-2"><Navigation size={24} /> Functions & Facilities</h4><div className="flex flex-wrap gap-3">{building.facilities.map((fac, i) => (<span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">{fac}</span>))}</div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:w-4/12 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-100 space-y-6">
            <h3 className="text-2xl font-black text-slate-900">Key Authorities</h3>
            <div className="space-y-6">{building.authorities.map((auth, i) => (<div key={i} className="space-y-4"><div><h5 className="text-lg font-black text-blue-600">{auth.name}</h5><p className="text-sm text-slate-500 font-bold uppercase tracking-wide">{auth.title}</p></div><div className="space-y-3"><div className="flex items-center gap-3 text-slate-500"><Phone size={16} className="text-blue-400" /><span className="text-sm font-bold">{auth.phone}</span></div><div className="flex items-center gap-3 text-slate-500"><MailIcon size={16} className="text-blue-400" /><span className="text-sm font-bold">{auth.email}</span></div></div></div>))}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Flow ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSession, setActiveSession] = useState<any>(null);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isMapExploring, setIsMapExploring] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>(null);

  // Sync simulated global session to UI
  useEffect(() => {
    onAttendanceStarted = (session) => {
      if (user?.role === UserRole.STUDENT) {
        setActiveSession(session);
      }
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

  const getMobileNavItems = () => {
    if (user.role === UserRole.ADMIN) {
      return [
        { id: 'admin-dashboard', label: 'Control', icon: <ShieldCheck size={20} /> },
        { id: 'admin-crm', label: 'CRM', icon: <Database size={20} /> },
        { id: 'navigation', label: 'Blocks', icon: <MapIcon size={20} /> },
      ];
    }
    if (user.role === UserRole.FACULTY) {
      return [
        { id: 'faculty-dashboard', label: 'Hub', icon: <LayoutDashboard size={20} /> },
        { id: 'attendance', label: 'Attend', icon: <ScanFace size={20} /> },
        { id: 'events', label: 'Events', icon: <Calendar size={20} /> },
      ];
    }
    return NAV_ITEMS.slice(0, 5);
  };

  const renderContent = () => {
    if (activeTab === 'profile' && user.role === UserRole.STUDENT) return <ProfileView user={user} />;
    if (activeTab === 'edustone') return <EdustoneView user={user} />;
    if (activeTab === 'events') return <EventsView user={user} />;
    if (activeTab === 'attendance' && user.role === UserRole.FACULTY) return <FacultyAttendance user={user} />;
    if (activeTab === 'faculty-dashboard' && user.role === UserRole.FACULTY) return <FacultyDashboard user={user} />;
    if (activeTab === 'admin-dashboard' && user.role === UserRole.ADMIN) return <AdminDashboard onOpenCRM={() => setActiveTab('admin-crm')} />;
    if (activeTab === 'admin-crm' && user.role === UserRole.ADMIN) return <AdminCRMView />;
    
    if (activeTab === 'navigation') {
      if (selectedBuilding) return <BuildingDetails building={selectedBuilding} onBack={() => setSelectedBuilding(null)} />;
      if (isMapExploring) return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
              <button onClick={() => setIsMapExploring(false)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-blue-600 transition-colors"><ChevronRight className="rotate-180" size={20} /> Back to Hub</button>
            </header>
            <CampusMap onSelect={setSelectedBuilding} />
          </div>
        );
      return <CampusHero onExplore={() => setIsMapExploring(true)} />;
    }

    if (activeTab === 'videohub') {
      return (
        <div className="space-y-6 h-full flex flex-col">
          <div className="flex-1 short-video-container -mx-4 md:mx-0 shadow-inner rounded-3xl overflow-hidden border border-slate-200">
            {MOCK_VIDEOS.filter(v => v.type === 'short').map((video) => (
              <div key={video.id} className="short-video-item relative flex items-center justify-center bg-slate-900">
                <video src={video.videoUrl} className="h-full object-cover md:rounded-3xl shadow-2xl" autoPlay loop muted playsInline />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10 pointer-events-none">
                  <div className="pointer-events-auto text-white">
                    <h3 className="text-lg font-bold">{video.title}</h3>
                    <p className="text-sm text-slate-300 mb-4">@{video.uploadedBy} • {video.subject}</p>
                    <div className="flex items-center gap-6">
                      <button className="flex flex-col items-center gap-1 group"><Heart size={24} /><span className="text-xs">{video.likes}</span></button>
                      <button className="flex flex-col items-center gap-1 group"><MessageCircle size={24} /><span className="text-xs">Comment</span></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default dashboard views
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">University Hub</h2>
            <p className="text-slate-500 font-medium">Hello, {user.name}. Welcome back.</p>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden academic-gradient text-white">
              <div className="relative z-10 space-y-4">
                <h3 className="text-3xl font-black tracking-tight">Level Up Your Career</h3>
                <p className="text-blue-100 max-w-sm">Complete courses, join hackathons and earn badges to get noticed by recruiters.</p>
                <button onClick={() => setActiveTab('edustone')} className="px-6 py-3 bg-white text-blue-600 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">Go to Edustone</button>
              </div>
              <Bot className="absolute bottom-[-20px] right-[-20px] w-64 h-64 text-white/5 rotate-[-15deg]" />
            </div>
            
            {/* Featured Events Section on Dashboard */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6 overflow-hidden">
               <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-900">Featured Events</h3>
                 <button onClick={() => setActiveTab('events')} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
               </div>
               <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {MOCK_EVENTS.map(event => (
                    <div key={event.id} className="min-w-[280px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all cursor-pointer" onClick={() => setActiveTab('events')}>
                       <div className="h-32 relative">
                         <img src={event.flyerUrl} className="w-full h-full object-cover" />
                         <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black text-white uppercase">{event.type}</div>
                       </div>
                       <div className="p-4">
                         <h4 className="text-sm font-black text-slate-900 truncate">{event.title}</h4>
                         <p className="text-[10px] text-slate-400 font-bold mt-1">{event.date} • {event.location}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black">92%</div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</p><p className="font-bold text-slate-900">Good Standing</p></div>
               </div>
               <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black">12</div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Courses</p><p className="font-bold text-slate-900">Materials Ready</p></div>
               </div>
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900">Campus Alerts</h3>
            <div className="space-y-4">
               {[
                 { title: 'New Job Posted', desc: 'Google is hiring interns.', time: '10m ago', icon: <BriefcaseIcon className="text-blue-600" /> },
                 { title: 'TechXplore Registration', desc: 'Closing in 2 days.', time: '1h ago', icon: <Trophy className="text-orange-600" /> }
               ].map((alert, i) => (
                 <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <div className="p-2 bg-white rounded-xl shadow-sm">{alert.icon}</div>
                    <div className="flex-1"><p className="text-xs font-black text-slate-900">{alert.title}</p><p className="text-[10px] text-slate-500">{alert.desc}</p></div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Real-time Attendance Notification for Students */}
      {activeSession && <AttendancePopup session={activeSession} onMark={() => setActiveSession(null)} />}

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser(null)} />
      <main className="md:ml-64 p-4 md:p-8 h-screen flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 custom-scrollbar no-scrollbar">{renderContent()}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white glass z-[90] flex items-center justify-around p-4 border-t border-slate-100 rounded-t-[2rem]">
        {getMobileNavItems().map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center transition-all ${activeTab === item.id ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
            {item.icon}<span className="text-[9px] font-black uppercase mt-1">{item.label}</span>
          </button>
        ))}
      </nav>

      <AIAssistant />
    </div>
  );
}
