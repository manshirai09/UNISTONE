import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Search, Play, Heart, Flame, Bot, MapPin, Send, User as UserIcon, Lock, 
  Mail, GraduationCap, Briefcase as BriefcaseIcon, LogOut, Plus, Users, 
  Calendar, FileText, Edit3, BookOpen, LayoutDashboard, MessageSquare, 
  Clock, ScanFace, CheckCircle, AlertCircle, PlaySquare, Image as ImageIcon, 
  Film, Save, Eye, Github, Linkedin, Network, Building, Zap, ArrowRight,
  TrendingUp, Globe, Smartphone, Laptop, Filter, Check, Camera, Upload,
  ExternalLink, ChevronRight, Book, Award, MoreVertical, FileUp, FileStack, Link as LinkIcon, FolderPlus, PlusCircle
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

// --- Auth View ---
const AuthView = ({ onLogin, logo }: { onLogin: (user: User) => void; logo: string }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const email = (e.target as any).email.value;
    
    setTimeout(() => {
      const isFaculty = email.toLowerCase().includes('faculty');
      onLogin({
        id: isFaculty ? 'FAC-301-A' : 'STU-2024-X', 
        name: isFaculty ? 'Dr. Alan Turing' : 'Sarah Connor', 
        email: email, 
        role: isFaculty ? UserRole.FACULTY : UserRole.STUDENT,
        department: 'CS', attendance: 88, xp: 12400, streak: 12, bio: 'Synchronizing intelligence nodes.',
        skills: ['React', 'Python', 'AI'], 
        profileImage: isFaculty ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
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
              <input name="email" type="email" required placeholder="University ID (Type 'faculty' for Faculty role)" className="w-full pl-14 pr-6 py-4 bg-slate-50 border rounded-2xl outline-none focus:border-[#8B0000]" />
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="password" type="password" required placeholder="Credential" className="w-full pl-14 pr-6 py-4 bg-slate-50 border rounded-2xl outline-none focus:border-[#8B0000]" />
            </div>
            <button disabled={loading} className="w-full py-5 bg-[#8B0000] text-white font-black rounded-2xl shadow-xl uppercase text-[11px] tracking-widest hover:bg-[#a50000] transition-all">
              {loading ? 'Synchronizing...' : 'Establish Connection'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- News Reader ---
const NewsReader = ({ news, onClose }: { news: NewsArticle, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[3000] bg-white animate-in slide-in-from-bottom duration-500 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto px-6 py-20 relative">
        <button onClick={onClose} className="fixed top-10 right-10 p-4 bg-slate-100 rounded-full hover:bg-slate-200 transition-all z-50"><X size={24}/></button>
        <div className="space-y-10">
          <div className="space-y-6">
            <span className="px-5 py-2 bg-[#F0E68C] text-[#8B0000] text-[10px] font-black uppercase rounded-xl">{news.source} • {news.readTime}</span>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{news.title}</h1>
          </div>
          <div className="h-[500px] rounded-[4rem] overflow-hidden shadow-2xl"><img src={news.image} className="w-full h-full object-cover" alt="" /></div>
          <div className="prose prose-xl text-slate-600 font-medium leading-relaxed space-y-8">
            <p className="text-2xl text-slate-900 font-bold italic">Latest synchronization report from {news.source}:</p>
            <p>{news.content || "The intersection of digital infrastructure and academic pedagogy is reaching a critical inflection point. This breakthrough represents a significant shift in how we process real-time campus data and personal learning trajectories."}</p>
          </div>
          <button className="flex items-center gap-4 text-[#8B0000] font-black uppercase tracking-widest hover:gap-6 transition-all">Read Full Protocol on {news.source} <ArrowRight/></button>
        </div>
      </div>
    </div>
  );
};

// --- Upload Content Modal ---
const UploadModal = ({ onClose, onUpload }: { onClose: () => void, onUpload: (content: any) => void }) => {
  const [type, setType] = useState<Lecture['type']>('lecture');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [file, setFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileName(f.name);
      const reader = new FileReader();
      reader.onloadend = () => setFile(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const submit = () => {
    if (!title) return;
    onUpload({
      id: Math.random().toString(36).substr(2, 9),
      title,
      duration: type === 'lecture' ? (duration || '45:00') : (duration || 'Due Tomorrow'),
      status: 'pending',
      type,
      url: file || undefined,
      fileType: fileName.split('.').pop() || 'file'
    });
  };

  return (
    <div className="fixed inset-0 z-[4000] bg-black/60 backdrop-blur-md flex items-center justify-center p-8 animate-in zoom-in-95">
      <div className="bg-white w-full max-w-xl rounded-[4rem] overflow-hidden shadow-5xl border-[10px] border-[#8B0000]/10 p-12 space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Establish <span className="text-[#8B0000]">Content Node</span></h3>
          <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"><X/></button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {(['lecture', 'assignment', 'reading', 'quiz'] as const).map(t => (
              <button key={t} onClick={() => setType(t)} className={`px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${type === t ? 'bg-[#8B0000] text-white shadow-brand' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{t}</button>
            ))}
          </div>
          <div className="space-y-4">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Node Title (e.g. Node Architecture 101)" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none focus:border-[#8B0000] transition-colors" />
            <input value={duration} onChange={e => setDuration(e.target.value)} placeholder={type === 'lecture' ? "Duration (e.g. 52:00)" : "Deadline (e.g. Oct 25)"} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none focus:border-[#8B0000] transition-colors" />
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center space-y-4 cursor-pointer hover:bg-slate-50 transition-all group" onClick={() => (document.getElementById('file-node-input') as any).click()}>
              <FileUp className={`mx-auto transition-colors ${file ? 'text-emerald-500' : 'text-slate-300 group-hover:text-[#8B0000]'}`} size={40} />
              <p className="text-[10px] font-black uppercase text-slate-400">{file ? `Asset Cached: ${fileName}` : 'Sync Master File Node'}</p>
              <input id="file-node-input" type="file" className="hidden" onChange={handleFile} />
            </div>
          </div>
          <button onClick={submit} className="w-full py-7 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-black transition-all">Publish Protocol</button>
        </div>
      </div>
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
          <h2 className="text-7xl font-black uppercase tracking-tighter leading-none">Campus <span className="text-[#8B0000]">Mesh</span></h2>
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
                  <p className="text-[10px] font-black uppercase text-[#8B0000] tracking-widest mb-1">Active Node</p>
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

// --- Edustone Hub ---
const EdustoneHub = ({ courses, user, setUser, setSelectedCourse }: { courses: Course[], user: User, setUser: (u: User) => void, setSelectedCourse: (course: Course) => void }) => {
  const registerCourse = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    setUser({
      ...user,
      enrolledCourseIds: [...user.enrolledCourseIds, courseId],
      xp: user.xp + 150
    });
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-7xl font-black uppercase leading-none tracking-tighter text-slate-900">
            {user.role === UserRole.FACULTY ? 'My Courses' : 'Edustone Hub'} <span className="text-[#8B0000]">Repository</span>
          </h2>
          <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">
            {user.role === UserRole.FACULTY ? 'Manage curriculum nodes and monitor synchronization.' : 'Establish learning links with academic hubs.'}
          </p>
        </div>
        {user.role === UserRole.FACULTY && (
          <button className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-2xl flex items-center gap-4 hover:bg-black transition-all">
            <PlusCircle size={20}/> Launch Repository
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {courses.map(course => {
          const isEnrolled = user.enrolledCourseIds.includes(course.id);
          const isInstructor = user.role === UserRole.FACULTY && user.name === course.instructor;

          return (
            <div key={course.id} onClick={() => (isEnrolled || isInstructor) && setSelectedCourse(course)} className={`bg-white p-12 rounded-[4.5rem] border border-slate-100 shadow-sm group transition-all relative overflow-hidden ${isEnrolled || isInstructor ? 'hover:border-[#F0E68C] hover:shadow-2xl cursor-pointer' : 'opacity-90'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0E68C]/5 -rotate-45 translate-x-12 -translate-y-12 rounded-full pointer-events-none" />
              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center font-black text-4xl mb-12 shadow-inner transition-all duration-500 ${isEnrolled || isInstructor ? 'bg-[#F0E68C]/20 text-[#8B0000] group-hover:bg-[#8B0000] group-hover:text-white' : 'bg-slate-100 text-slate-300'}`}>{course.code[0]}</div>
              <h4 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-tight line-clamp-2 min-h-[4rem]">{course.name}</h4>
              <div className="flex items-center gap-4 mt-6">
                <img src={course.instructorImage} className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-md object-cover" />
                <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest italic">{course.instructor}</p>
              </div>
              {!isEnrolled && !isInstructor && user.role === UserRole.STUDENT ? (
                <button onClick={(e) => registerCourse(e, course.id)} className="mt-8 w-full py-5 bg-[#8B0000] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-brand flex items-center justify-center gap-3 hover:bg-black transition-all">
                  <Zap size={16} fill="currentColor"/> Sync with Node
                </button>
              ) : (
                <div className="flex gap-6 mt-12">
                  <div className="flex-1 p-8 bg-slate-50 rounded-[2.5rem] text-center group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100"><p className="text-3xl font-black text-slate-900">{course.modules.reduce((acc, m) => acc + m.lectures.length, 0)}</p><p className="text-[10px] font-black uppercase text-slate-400 mt-2">Nodes</p></div>
                  <div className="flex-1 p-8 bg-slate-50 rounded-[2.5rem] text-center group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100"><p className="text-3xl font-black text-slate-900">{course.modules.length}</p><p className="text-[10px] font-black uppercase text-slate-400 mt-2">Sections</p></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Course Detail ---
const CourseDetail = ({ course, user, onUpdateModules, onClose }: { course: Course, user: User, onUpdateModules: (modules: Module[]) => void, onClose: () => void }) => {
  const [activeUploadModuleId, setActiveUploadModuleId] = useState<string | null>(null);
  const canEdit = user.role === UserRole.FACULTY && user.name === course.instructor;

  const handleAddModule = () => {
    const title = prompt("Enter Module Identity (e.g. Week 5: Advanced Topics)");
    if (title && title.trim()) {
      onUpdateModules([...course.modules, { id: Math.random().toString(36).substr(2, 9), title: title.trim(), lectures: [] }]);
    }
  };

  const handleUpload = (newLecture: Lecture) => {
    if (!activeUploadModuleId) return;
    const updatedModules = course.modules.map(m => m.id === activeUploadModuleId ? { ...m, lectures: [...m.lectures, newLecture] } : m);
    onUpdateModules(updatedModules);
    setActiveUploadModuleId(null);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in">
      {activeUploadModuleId && <UploadModal onClose={() => setActiveUploadModuleId(null)} onUpload={handleUpload} />}
      <div className="bg-white w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-5xl border-[10px] border-[#F0E68C]/20 flex flex-col max-h-[90vh]">
        <div className="h-64 academic-gradient relative p-16 flex items-end">
          <button onClick={onClose} className="absolute top-10 right-10 p-4 bg-white/20 backdrop-blur-md text-white rounded-3xl hover:bg-white/40 transition-all"><X size={24}/></button>
          <div className="flex items-center gap-10">
            <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center font-black text-5xl text-[#8B0000] shadow-2xl">{course.code[0]}</div>
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{course.name}</h2>
              <p className="text-[#F0E68C] font-black uppercase text-sm tracking-[0.2em]">{course.code} • MASTER INSTRUCTOR: {course.instructor}</p>
            </div>
          </div>
        </div>
        <div className="p-16 overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-3 gap-16 bg-slate-50/50">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-slate-400">Curriculum Mesh</h3>
              {canEdit && <button onClick={handleAddModule} className="px-6 py-3 bg-[#8B0000] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-brand"><FolderPlus size={16}/> New Section</button>}
            </div>
            <div className="space-y-12">
              {course.modules.map((m) => (
                <div key={m.id} className="space-y-6">
                  <div className="flex justify-between items-center px-4">
                    <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900 border-l-[6px] border-[#8B0000] pl-6">{m.title}</h4>
                    {canEdit && <button onClick={() => setActiveUploadModuleId(m.id)} className="flex items-center gap-2 px-4 py-2 text-[#8B0000] font-black uppercase text-[10px] tracking-widest hover:bg-[#8B0000]/5 rounded-xl transition-all"><Plus size={16}/> Add Node</button>}
                  </div>
                  <div className="space-y-4">
                    {m.lectures.length === 0 ? (
                      <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center bg-white/50"><p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Section Empty. Awaiting content synchronization.</p></div>
                    ) : m.lectures.map((l) => (
                      <div key={l.id} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:border-[#F0E68C] shadow-sm hover:shadow-xl transition-all cursor-pointer">
                        <div className="flex items-center gap-8">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-colors ${l.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300 group-hover:bg-[#8B0000]/5 group-hover:text-[#8B0000]'}`}>
                            {l.type === 'lecture' && <Play size={22} fill={l.status === 'completed' ? 'currentColor' : 'none'} />}
                            {l.type === 'assignment' && <FileStack size={22} />}
                            {l.type === 'reading' && <Book size={22} />}
                            {l.type === 'quiz' && <CheckCircle size={22} />}
                          </div>
                          <div><p className="text-xl font-black uppercase tracking-tight text-slate-900">{l.title}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">{l.type.toUpperCase()} • {l.duration}</p></div>
                        </div>
                        <div className="flex items-center gap-4">{l.url && <div className="p-3 bg-emerald-50 text-emerald-500 rounded-full"><LinkIcon size={20}/></div>}<div className="p-3 bg-slate-50 text-slate-400 rounded-full group-hover:bg-[#8B0000] group-hover:text-white transition-all"><ArrowRight size={20}/></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-10">
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5"><GraduationCap size={100} /></div>
              <h4 className="text-[12px] font-black uppercase text-slate-300 tracking-widest relative z-10">Verification Profile</h4>
              <div className="flex items-center gap-6 relative z-10">
                <img src={course.instructorImage} className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-xl object-cover" />
                <div><p className="text-xl font-black text-slate-900 uppercase leading-none">{course.instructor}</p><p className="text-[10px] font-black text-[#8B0000] uppercase mt-2 tracking-widest">Master Node</p></div>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed italic relative z-10">{course.description}</p>
            </div>
            {canEdit ? (
              <div className="p-10 bg-[#8B0000]/5 rounded-[4rem] border-2 border-dashed border-[#8B0000]/20 text-center space-y-6">
                <div className="w-16 h-16 bg-[#8B0000] text-white rounded-2xl flex items-center justify-center mx-auto shadow-brand"><Zap size={28} fill="currentColor" /></div>
                <h5 className="text-lg font-black uppercase tracking-tight text-[#8B0000]">Instructor Mode</h5>
                <p className="text-[10px] font-black uppercase text-slate-400 leading-relaxed tracking-widest">Protocols active. Publish nodes and monitor synchronization.</p>
              </div>
            ) : (
              <button className="w-full py-8 bg-[#8B0000] text-white rounded-[3rem] font-black uppercase text-[12px] shadow-brand hover:scale-[1.03] transition-all flex items-center justify-center gap-4"><Zap size={20} fill="currentColor" /> Course Synchronized</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Career Mesh ---
const CareerHub = ({ user }: { user: User }) => {
  const [filter, setFilter] = useState<'all' | 'full-time' | 'internship'>('all');
  const filteredJobs = MOCK_JOBS.filter(job => filter === 'all' ? true : job.type === filter);

  return (
    <div className="space-y-12 pb-20 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-7xl font-black uppercase leading-none tracking-tighter text-slate-900">Career <span className="text-[#8B0000]">Mesh</span></h2>
          <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Synchronize your trajectory with industry nodes.</p>
        </div>
        <div className="flex gap-2">
          {['all', 'full-time', 'internship'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)} className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -rotate-45 translate-x-12 -translate-y-12 rounded-full pointer-events-none group-hover:bg-[#8B0000]/5" />
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-4">
                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${job.type === 'internship' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>{job.type}</span>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{job.title}</h3>
                <div className="flex items-center gap-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  <div className="flex items-center gap-1"><BriefcaseIcon size={12}/> {job.company}</div>
                  <div className="flex items-center gap-1"><MapPin size={12}/> {job.location}</div>
                  {job.salary && <div className="flex items-center gap-1"><Zap size={12} className="text-[#F0E68C]" fill="currentColor"/> {job.salary}</div>}
                </div>
              </div>
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-300 group-hover:bg-[#8B0000] group-hover:text-white transition-all">{job.company[0]}</div>
            </div>
            <div className="flex flex-wrap gap-2 mt-8">
              {job.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-tighter">#{tag}</span>
              ))}
            </div>
            <button className="mt-10 w-full py-5 bg-[#8B0000] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-brand hover:bg-black transition-all">Initiate Sync Protocol</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Profile Hub ---
const ProfileHub = ({ user, setUser }: { user: User, setUser: (u: User) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio || '');

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
              <span className="px-5 py-2 bg-[#8B0000] text-white text-[10px] font-black uppercase rounded-xl tracking-widest">{user.role}</span>
              <span className="text-slate-400 font-black uppercase text-xs tracking-widest italic">{user.department} Department</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-16">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-4"><Edit3 className="text-[#8B0000]" size={24} /> Neural Summary</h3>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors"><Edit3 size={18}/></button>
              ) : (
                <button onClick={() => { setUser({...user, bio}); setIsEditing(false); }} className="px-6 py-2 bg-[#8B0000] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-brand">Sync Profile</button>
              )}
            </div>
            {isEditing ? (
              <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-3xl font-medium outline-none focus:border-[#8B0000] transition-colors" />
            ) : (
              <p className="text-xl text-slate-600 font-medium leading-relaxed italic">"{user.bio || 'Node active. Awaiting synchronization.'}"</p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'XP Pulse', value: user.xp, icon: <Zap fill="currentColor"/>, color: 'text-[#F0E68C]' },
              { label: 'Streak', value: user.streak, icon: <Flame fill="currentColor"/>, color: 'text-orange-500' },
              { label: 'Attendance', value: `${user.attendance}%`, icon: <CheckCircle/>, color: 'text-emerald-500' },
              { label: 'Projects', value: user.projects?.length || 0, icon: <FileStack/>, color: 'text-[#8B0000]' }
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
              {(user.skills || ['Node JS', 'Mesh Architecture']).map(skill => (
                <span key={skill} className="px-5 py-3 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all cursor-default">{skill}</span>
              ))}
            </div>
          </div>
          <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">Digital Identity</h3>
            <div className="space-y-4">
              <a href="#" className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl group hover:bg-slate-900 hover:text-white transition-all"><div className="flex items-center gap-4"><Github size={20}/><span className="text-[11px] font-black uppercase tracking-widest">Repository Sync</span></div><ExternalLink size={16}/></a>
              <a href="#" className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl group hover:bg-slate-900 hover:text-white transition-all"><div className="flex items-center gap-4"><Linkedin size={20}/><span className="text-[11px] font-black uppercase tracking-widest">Professional Mesh</span></div><ExternalLink size={16}/></a>
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
    return NAV_ITEMS.map(i => {
      if (i.id === 'edustone' && user.role === UserRole.FACULTY) {
        return { ...i, label: 'My Courses' };
      }
      return i;
    }).concat([{ id: 'tech-news', label: 'Tech Pulse', icon: <Globe size={20} /> }]);
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
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all group ${activeTab === item.id ? 'bg-[#8B0000] text-white shadow-2xl shadow-[#8B0000]/20' : 'text-slate-400 hover:bg-slate-50'}`}>
            <div className={`${activeTab === item.id ? 'text-white' : 'text-slate-300 group-hover:text-[#8B0000]'}`}>{item.icon}</div>
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

// --- UnistoneAI ---
const UnistoneAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([{ role: 'ai', text: "Greetings, Node. I am UNISTONE AI. How can I assist your synchronization today?" }]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const response = await askUnistoneAI(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Critical failure in neural link. Please check your credentials." }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="fixed bottom-10 right-10 w-20 h-20 bg-[#8B0000] text-white rounded-full shadow-4xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[1000] border-4 border-white"><Bot size={32} /><div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white animate-pulse" /></button>
      {isOpen && (
        <div className="fixed inset-0 z-[5000] flex items-end justify-end p-10 pointer-events-none">
          <div className="bg-white w-full max-w-md h-[70vh] rounded-[4rem] shadow-5xl border-[10px] border-[#8B0000]/10 flex flex-col pointer-events-auto animate-in slide-in-from-bottom duration-500">
            <div className="p-8 bg-[#8B0000] text-white flex justify-between items-center rounded-t-[3rem]"><div className="flex items-center gap-4"><Bot size={24} /><h3 className="text-xl font-black uppercase tracking-tighter">Unistone AI</h3></div><button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20}/></button></div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-6 rounded-[2rem] font-medium text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#8B0000] text-white shadow-brand' : 'bg-slate-50 text-slate-700'}`}>{m.text}</div></div>
              ))}
              {loading && <div className="flex justify-start"><div className="bg-slate-50 p-6 rounded-[2rem] animate-pulse text-slate-400 font-black text-xs uppercase tracking-widest">Processing Node...</div></div>}
            </div>
            <div className="p-8 border-t border-slate-100 flex gap-4 bg-white rounded-b-[4rem]">
              <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask the campus core..." className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-[#8B0000] outline-none font-bold transition-all" />
              <button onClick={handleSend} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl"><Send size={20}/></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- Main App Controller ---
export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('unistone-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [logo] = useSyncedState('unistone-logo', 'https://colleges18.s3.ap-south-1.amazonaws.com/Sage_univ_indore_b02eee0e17.jpg');
  const [courses, setCourses] = useSyncedState<Course[]>('unistone-courses-dynamic', MOCK_COURSES);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => { if (user) localStorage.setItem('unistone-user', JSON.stringify(user)); else localStorage.removeItem('unistone-user'); }, [user]);

  if (!user) return <AuthView onLogin={setUser} logo={logo} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return (
        <div className="space-y-16 pb-20 animate-in fade-in">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="text-7xl font-black uppercase tracking-tighter leading-none text-slate-900">System <span className="text-[#8B0000]">Feed</span></h2>
              <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Identity synchronized as <span className="text-[#8B0000] font-black">{user.role.toUpperCase()}</span>.</p>
            </div>
            <div className="flex gap-4">
              <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center"><p className="text-3xl font-black text-slate-900">{user.streak}</p><p className="text-[10px] font-black uppercase text-slate-400 mt-1">Streak</p></div>
              <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center"><p className="text-3xl font-black text-[#8B0000]">{user.attendance}%</p><p className="text-[10px] font-black uppercase text-slate-400 mt-1">Integrity</p></div>
            </div>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
            <div className="bg-slate-900 p-14 rounded-[5rem] text-white relative overflow-hidden group">
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4"><TrendingUp size={32} className="text-[#F0E68C]" /> Tech Pulse</h3>
              <div className="space-y-8">
                {MOCK_NEWS.slice(0, 2).map(news => (
                  <div key={news.id} className="flex gap-8 group/item cursor-pointer">
                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden shrink-0"><img src={news.image} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" /></div>
                    <div className="flex flex-col justify-center"><h4 className="text-xl font-black uppercase tracking-tight line-clamp-2 group-hover/item:text-[#F0E68C] transition-colors">{news.title}</h4><p className="text-[10px] font-black uppercase text-slate-400 mt-3">{news.source} • {news.readTime}</p></div>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveTab('tech-news')} className="mt-12 text-[#F0E68C] font-black uppercase text-xs tracking-widest flex items-center gap-2">Open Neural Pulse <ArrowRight size={14}/></button>
            </div>
            <div className="bg-white p-14 rounded-[5rem] border border-slate-100 shadow-sm relative overflow-hidden">
               <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4 text-slate-900"><Calendar size={32} className="text-[#8B0000]" /> Campus Pulse</h3>
              <div className="space-y-10">
                {MOCK_EVENTS.map(e => (
                  <div key={e.id} className="flex items-center justify-between group cursor-pointer" onClick={() => setActiveTab('events')}>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-[#F0E68C]/20 text-[#8B0000] rounded-2xl flex flex-col items-center justify-center border border-[#F0E68C]/40"><p className="text-[10px] font-black leading-none">{e.date.split(' ')[0]}</p><p className="text-xl font-black leading-none mt-1">{e.date.split(' ')[1]}</p></div>
                      <div><h4 className="text-xl font-black uppercase tracking-tight text-slate-900">{e.title}</h4><p className="text-[10px] font-black uppercase text-slate-400 mt-1">{e.location}</p></div>
                    </div>
                    <ChevronRight className="text-slate-200 group-hover:text-[#8B0000]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
      case 'navigation': return <RealisticMap buildings={MOCK_BUILDINGS} />;
      case 'edustone': return <EdustoneHub courses={courses} user={user} setUser={setUser} setSelectedCourse={setSelectedCourse} />;
      case 'careers': return <CareerHub user={user} />;
      case 'profile': return <ProfileHub user={user} setUser={setUser} />;
      default: return <div className="p-20 text-center"><h2 className="text-5xl font-black uppercase text-slate-900">Module Synchronizing...</h2></div>;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser(null)} logo={logo} />
      <main className="md:ml-72 p-6 md:p-14 h-screen overflow-y-auto custom-scrollbar no-scrollbar scroll-smooth">
        {renderContent()}
      </main>
      <UnistoneAI />
      {selectedCourse && (
        <CourseDetail 
          course={selectedCourse} 
          user={user} 
          onUpdateModules={(newModules) => {
            const updatedCourses = courses.map(c => c.id === selectedCourse.id ? { ...c, modules: newModules } : c);
            setCourses(updatedCourses);
            setSelectedCourse({ ...selectedCourse, modules: newModules });
          }} 
          onClose={() => setSelectedCourse(null)} 
        />
      )}
    </div>
  );
}
