
import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Search, Play, Heart, Flame, Bot, MapPin, Send, User as UserIcon, Lock, 
  Mail, GraduationCap, Briefcase as BriefcaseIcon, LogOut, Plus, Users, 
  Calendar, FileText, Edit3, BookOpen, LayoutDashboard, MessageSquare, 
  Clock, ScanFace, CheckCircle, AlertCircle, PlaySquare, Image as ImageIcon, 
  Film, Save, Eye, Github, Linkedin, Network, Building, Zap, ArrowRight,
  TrendingUp, Globe, Smartphone, Laptop, Filter, Check, Camera
} from 'lucide-react';
import { User, UserRole, Video as VideoType, CampusBuilding, Course, CampusEvent, Job, NewsArticle } from './types';
import { NAV_ITEMS, MOCK_BUILDINGS, MOCK_COURSES, MOCK_VIDEOS, MOCK_EVENTS, MOCK_COURSES as MOCK_FACULTY, MOCK_JOBS, MOCK_NEWS } from './constants';
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
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'STU-2024-X', name: 'Sarah Connor', email: 'sarah@unistone.edu', role: UserRole.STUDENT,
        department: 'CS', attendance: 88, xp: 12400, streak: 12, bio: 'Synchronizing intelligence nodes.',
        skills: ['React', 'Python', 'AI'], profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop'
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
        <div className="md:w-1/2 p-12 bg-white">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-8 uppercase">Establish Link</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative"><Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input name="email" type="email" required placeholder="University ID" className="w-full pl-14 pr-6 py-4 bg-slate-50 border rounded-2xl outline-none focus:border-[#8B0000]" /></div>
            <div className="relative"><Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input name="password" type="password" required placeholder="Credential" className="w-full pl-14 pr-6 py-4 bg-slate-50 border rounded-2xl outline-none focus:border-[#8B0000]" /></div>
            <button disabled={loading} className="w-full py-5 bg-[#8B0000] text-white font-black rounded-2xl shadow-xl uppercase text-[11px] tracking-widest hover:bg-[#a50000] transition-all">
              {loading ? 'Synchronizing...' : 'Establish Connection'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Profile Hub ---
const ProfileHub = ({ user, setUser }: { user: User, setUser: Function }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const save = () => { setUser(formData); setEditing(false); };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden relative">
        <div className="h-64 relative">
          <img src={formData.coverImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=400&fit=crop'} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {editing && <button className="absolute top-10 right-10 p-4 bg-white/20 backdrop-blur-md text-white rounded-3xl"><ImageIcon size={20}/></button>}
        </div>
        <div className="px-12 pb-12 relative">
          <div className="flex justify-between items-end -translate-y-16">
            <div className="relative group">
              <div className="w-44 h-44 rounded-full bg-white border-[8px] border-white shadow-2xl overflow-hidden">
                <img src={formData.profileImage} className="w-full h-full object-cover" />
              </div>
              {/* Fixed: Camera icon imported and used correctly for profile edit overlay */}
              {editing && <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full cursor-pointer"><Camera size={32} className="text-white"/></div>}
            </div>
            <button onClick={() => editing ? save() : setEditing(true)} className="mb-6 px-10 py-5 bg-[#8B0000] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-105 transition-all">
              {editing ? 'Commit Identity' : 'Edit Terminal'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 -mt-4">
            <div className="space-y-8">
              {editing ? (
                <div className="space-y-6">
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-bold" placeholder="Master Name" />
                  <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-medium h-32 resize-none" placeholder="Bio Data" />
                  <div className="flex gap-4">
                    <input value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="flex-1 px-6 py-4 bg-slate-50 border rounded-2xl text-xs" placeholder="GitHub URL" />
                    <input value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} className="flex-1 px-6 py-4 bg-slate-50 border rounded-2xl text-xs" placeholder="LinkedIn URL" />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{formData.name}</h2>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="px-4 py-1.5 bg-[#F0E68C]/20 text-[#8B0000] text-[10px] font-black uppercase rounded-lg border border-[#F0E68C]/40">{formData.department} Hub</span>
                      <span className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-lg border border-slate-100">{formData.id}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 font-medium italic text-lg leading-relaxed">{formData.bio}</p>
                  <div className="flex gap-3">
                    {formData.githubUrl && <a href={formData.githubUrl} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-[#8B0000] transition-all"><Github size={20}/></a>}
                    {formData.linkedinUrl && <a href={formData.linkedinUrl} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-[#8B0000] transition-all"><Linkedin size={20}/></a>}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-6 shadow-inner">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3"><Zap className="text-[#8B0000]" size={24}/> Integrity Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-end"><p className="text-[10px] font-black uppercase text-slate-400">Sync Integrity (Attendance)</p><p className="text-3xl font-black text-[#8B0000]">{formData.attendance}%</p></div>
                  <div className="h-4 bg-white rounded-full overflow-hidden border border-slate-100"><div className="h-full bg-[#8B0000] shadow-[0_0_10px_rgba(139,0,0,0.4)]" style={{width: `${formData.attendance}%`}}/></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center shadow-sm group hover:border-[#F0E68C] transition-all">
                  <Flame className="mx-auto text-orange-500 mb-3 group-hover:scale-110 transition-transform" size={32} fill="currentColor"/>
                  <p className="text-3xl font-black leading-none text-slate-900">{formData.streak}</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">Node Streak</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center shadow-sm group hover:border-[#F0E68C] transition-all">
                  <TrendingUp className="mx-auto text-[#8B0000] mb-3 group-hover:scale-110 transition-transform" size={32} />
                  <p className="text-3xl font-black leading-none text-slate-900">{formData.xp}</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">Total Energy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Course Detail Modal ---
const CourseDetail = ({ course, onClose }: { course: Course, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-5xl border-[8px] border-[#F0E68C]/20 flex flex-col max-h-[90vh]">
        <div className="h-56 academic-gradient relative p-12 flex items-end">
          <button onClick={onClose} className="absolute top-10 right-10 p-4 bg-white/20 backdrop-blur-md text-white rounded-3xl hover:bg-white/40 transition-all"><X size={24}/></button>
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center font-black text-4xl text-[#8B0000] shadow-2xl">{course.code[0]}</div>
            <div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{course.name}</h2>
              <p className="text-[#F0E68C] font-bold uppercase mt-3 tracking-widest">{course.instructor} • {course.code}</p>
            </div>
          </div>
        </div>
        <div className="p-16 overflow-y-auto no-scrollbar grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">Node Curriculum <span className="text-slate-300 text-sm font-bold">({course.lecturesCount} Streams)</span></h3>
            <div className="space-y-4">
              {course.lectures.map((l, i) => (
                <div key={l.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-[#F0E68C] transition-all cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${l.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-white text-slate-300'}`}>{i + 1}</div>
                    <div><p className="text-lg font-black uppercase tracking-tight leading-none text-slate-900">{l.title}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-2">{l.duration}</p></div>
                  </div>
                  {l.status === 'completed' ? <CheckCircle className="text-emerald-500" size={24}/> : <Play className="text-slate-300 group-hover:text-[#8B0000] transition-colors" size={24}/>}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-10">
            <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-6">
              <h4 className="text-[12px] font-black uppercase text-slate-400 tracking-widest">Master Instructor</h4>
              <div className="flex items-center gap-5">
                <img src={course.instructorImage} className="w-16 h-16 rounded-2xl shadow-md object-cover" />
                <div><p className="font-black text-slate-900 leading-none">{course.instructor}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Verified Expert</p></div>
              </div>
            </div>
            <button className="w-full py-8 bg-slate-900 text-white rounded-[3rem] font-black uppercase text-[12px] shadow-2xl hover:bg-black transition-all active:scale-95">Establish Stream Link</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Map Sub-Module ---
const MapModule = ({ buildings }: { buildings: CampusBuilding[] }) => {
  const [selected, setSelected] = useState<CampusBuilding | null>(null);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="h-[60vh] bg-white rounded-[5rem] border border-slate-100 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8B0000_1.5px,transparent_1.5px)] bg-[length:60px:60px]" />
        {buildings.map(b => (
          <div key={b.id} onClick={() => setSelected(b)} className="map-pin" style={{ top: b.mapCoords.top, left: b.mapCoords.left }}>
            <div className={`w-14 h-14 ${b.color} rounded-full border-[6px] border-white shadow-3xl flex items-center justify-center text-white transition-all hover:scale-150 ${selected?.id === b.id ? 'ring-[12px] ring-[#8B0000]/30 selected-pin-pulse border-[#8B0000]' : ''}`}>
              <MapPin size={24} fill="currentColor" />
            </div>
          </div>
        ))}
        <div className="absolute top-10 left-10 w-96 glass p-8 rounded-[3rem] border border-white/40 shadow-4xl">
          <Search className="text-[#8B0000] absolute right-12 top-1/2 -translate-y-1/2" />
          <input placeholder="Locate Node..." className="bg-transparent font-black uppercase tracking-tighter w-full outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {buildings.map(b => (
          <div key={b.id} onClick={() => setSelected(b)} className="bg-white p-6 rounded-[3.5rem] border border-slate-100 shadow-sm group hover:border-[#F0E68C] hover:shadow-2xl transition-all cursor-pointer">
            <div className="h-48 rounded-[2.5rem] overflow-hidden mb-6"><img src={b.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /></div>
            <div className="px-4 pb-4">
              <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-none">{b.name}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-3 tracking-widest">{b.floors} Levels • Sync Status: Active</p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[5rem] overflow-hidden shadow-5xl border-[8px] border-[#F0E68C]/20">
            <div className="h-64 relative">
              <img src={selected.image} className="w-full h-full object-cover" />
              <button onClick={() => setSelected(null)} className="absolute top-10 right-10 p-4 bg-white/20 backdrop-blur-md text-white rounded-3xl"><X/></button>
            </div>
            <div className="p-16 space-y-10">
              <h3 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">{selected.name}</h3>
              <p className="text-slate-500 font-medium italic text-lg leading-relaxed border-l-[6px] border-[#8B0000] pl-10">{selected.description}</p>
              <div className="flex flex-wrap gap-3">
                {selected.departments.map(d => <span key={d} className="px-6 py-3 bg-slate-50 text-[10px] font-black uppercase rounded-[1.5rem] border border-slate-100">{d} Node</span>)}
              </div>
              <button className="w-full py-8 bg-[#8B0000] text-white rounded-[3rem] font-black uppercase text-[12px] shadow-2xl">Initialize Guidance Link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Dashboard ---
const Dashboard = ({ user, setTab }: { user: User, setTab: Function }) => {
  const filteredNews = useMemo(() => MOCK_NEWS.filter(news => news.category === user.department || news.category === 'General'), [user.department]);

  return (
    <div className="space-y-16 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col lg:flex-row justify-between items-end gap-8">
        <div>
          <h2 className="text-7xl font-black uppercase tracking-tighter leading-none">System <span className="text-[#8B0000]">Feed</span></h2>
          <p className="text-slate-500 font-medium italic mt-5 text-xl tracking-tight leading-relaxed max-w-xl">Identity node fully synchronized. Active integrity: <span className="text-[#8B0000] font-black">{user.attendance}%</span></p>
        </div>
        <div className="flex gap-6">
          <div className="px-10 py-6 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-6"><Flame className="text-orange-500" fill="currentColor" size={40}/><p className="text-4xl font-black">{user.streak}</p></div>
          <div className="px-10 py-6 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-6"><TrendingUp className="text-[#8B0000]" size={40}/><p className="text-4xl font-black">{user.xp}</p></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <section className="bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4 mb-12"><Globe className="text-[#8B0000]"/> Personalized Intel Hub</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredNews.map(news => (
                <div key={news.id} className="group cursor-pointer">
                  <div className="h-44 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-lg">
                    <img src={news.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-5 left-5 px-4 py-1.5 bg-[#F0E68C] text-[#8B0000] text-[9px] font-black uppercase rounded-lg border border-[#8B0000]/20">{news.source}</div>
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tight leading-tight line-clamp-2">{news.title}</h4>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-10">
            <div className="flex justify-between items-end"><h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4"><PlaySquare className="text-red-500" size={32}/> Knowledge Bytes</h3><button className="text-[12px] font-black text-[#8B0000] uppercase tracking-widest hover:underline">Full Collaboration Node</button></div>
            <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar snap-x">
              {MOCK_VIDEOS.map(v => (
                <div key={v.id} className="w-56 h-96 bg-slate-200 rounded-[3.5rem] overflow-hidden shrink-0 relative group shadow-2xl snap-start border-[6px] border-white">
                  <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex flex-col justify-end p-8">
                    <div className="flex items-center gap-3 mb-4"><img src={v.uploaderImage} className="w-8 h-8 rounded-full border-2 border-white shadow-md"/><p className="text-white text-[9px] font-black uppercase">{v.uploadedBy}</p></div>
                    <p className="text-white text-[12px] font-black line-clamp-2 uppercase tracking-tight leading-relaxed">{v.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <section className="bg-slate-900 p-14 rounded-[5rem] text-white relative overflow-hidden shadow-3xl">
             <h3 className="text-3xl font-black uppercase mb-12 flex items-center gap-4 tracking-tighter"><Calendar className="text-[#F0E68C]" size={32}/> Events Pulse</h3>
             <div className="space-y-10">
                {MOCK_EVENTS.map(e => (
                  <div key={e.id} className="flex gap-6 group cursor-pointer">
                    <div className="w-20 h-20 rounded-[1.8rem] overflow-hidden border border-white/10 shrink-0"><img src={e.image} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"/></div>
                    <div className="overflow-hidden flex flex-col justify-center">
                      <p className="text-lg font-black truncate uppercase tracking-tighter group-hover:text-[#F0E68C] transition-colors leading-none">{e.title}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-3 tracking-widest uppercase font-bold">{e.date} • {e.location}</p>
                    </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-16 py-7 bg-white/5 border border-white/10 rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95" onClick={() => setTab('events')}>Full Pulse Registry</button>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- Career Hub ---
const CareerHub = ({ user }: { user: User }) => {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const nicheJobs = useMemo(() => jobs.filter(j => j.niche === user.department || j.niche === 'General'), [user.department, jobs]);

  const apply = (id: string) => setJobs(jobs.map(j => j.id === id ? {...j, status: 'applied'} : j));

  return (
    <div className="space-y-12 pb-20 animate-in fade-in">
      <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">Career <span className="text-[#8B0000]">Mesh</span></h2>
      <div className="grid grid-cols-1 gap-8">
        {nicheJobs.map(job => (
          <div key={job.id} className="bg-white p-12 rounded-[4.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between group hover:border-[#F0E68C] transition-all gap-8">
            <div className="flex items-center gap-10">
              <div className="w-20 h-20 bg-slate-50 rounded-[1.8rem] flex items-center justify-center font-black text-3xl text-[#8B0000] group-hover:bg-[#8B0000] group-hover:text-white transition-all duration-500">{job.company[0]}</div>
              <div>
                <h4 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">{job.title}</h4>
                <p className="text-[12px] font-black text-slate-400 uppercase mt-4 tracking-widest italic">{job.company} • {job.location}</p>
                <div className="flex flex-wrap gap-3 mt-6">{job.tags.map(tag => <span key={tag} className="px-5 py-2 bg-slate-50 text-[10px] font-black uppercase text-slate-500 rounded-xl border border-slate-100">{tag}</span>)}</div>
              </div>
            </div>
            <div className="flex flex-col md:items-end gap-6 pt-8 md:pt-0">
               <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{job.salary}</p>
               <button onClick={() => apply(job.id)} disabled={job.status === 'applied'} className={`px-14 py-6 rounded-[2rem] font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 shadow-2xl ${job.status === 'applied' ? 'bg-emerald-500 text-white cursor-default' : 'bg-slate-900 text-white hover:bg-black'}`}>
                 {job.status === 'applied' ? 'Connection Synced' : 'Establish Protocol'}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Sidebar Controller ---
const Sidebar = ({ activeTab, setActiveTab, user, onLogout, logo }: any) => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-100 z-[900] flex flex-col p-10 hidden md:flex">
      <div className="flex items-center gap-5 mb-16">
        <div className="w-16 h-16 bg-white rounded-[1.2rem] flex items-center justify-center shadow-xl border border-slate-100 overflow-hidden"><img src={logo} className="w-full h-full object-contain p-2" /></div>
        <span className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">Unistone</span>
      </div>
      <nav className="flex-1 space-y-3">
        {NAV_ITEMS.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all group ${activeTab === item.id ? 'bg-[#8B0000] text-white shadow-2xl shadow-[#8B0000]/20' : 'text-slate-400 hover:bg-slate-50'}`}>
            <div className={`${activeTab === item.id ? 'text-white' : 'text-slate-300 group-hover:text-[#8B0000]'}`}>{item.icon}</div>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>
      <button onClick={onLogout} className="w-full flex items-center gap-5 px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-50 transition-all mt-10"><LogOut size={22} /> Disconnect</button>
    </aside>
  );
};

// --- Main App Controller ---
export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('unistone-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [logo] = useSyncedState('unistone-logo', 'https://colleges18.s3.ap-south-1.amazonaws.com/Sage_univ_indore_b02eee0e17.jpg');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => { if (user) localStorage.setItem('unistone-user', JSON.stringify(user)); else localStorage.removeItem('unistone-user'); }, [user]);

  if (!user) return <AuthView onLogin={setUser} logo={logo} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} setTab={setActiveTab} />;
      case 'navigation': return <MapModule buildings={MOCK_BUILDINGS} />;
      case 'edustone': return (
        <div className="space-y-12 pb-20 animate-in fade-in">
          <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Edustone <span className="text-[#8B0000]">Repository</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {MOCK_COURSES.map(course => (
              <div key={course.id} onClick={() => setSelectedCourse(course)} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm group hover:border-[#F0E68C] transition-all hover:shadow-2xl cursor-pointer">
                <div className="w-20 h-20 bg-[#F0E68C]/20 rounded-[1.8rem] flex items-center justify-center font-black text-3xl text-[#8B0000] mb-10 shadow-inner group-hover:bg-[#8B0000] group-hover:text-white transition-all duration-500">{course.code[0]}</div>
                <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-tight">{course.name}</h4>
                <p className="text-[12px] font-black text-slate-400 uppercase mt-4 tracking-widest italic">{course.instructor}</p>
                <div className="flex gap-6 mt-10">
                  <div className="flex-1 p-6 bg-slate-50 rounded-[1.8rem] text-center"><p className="text-2xl font-black text-slate-900">{course.lecturesCount}</p><p className="text-[9px] font-black uppercase text-slate-400 mt-1">Streams</p></div>
                  <div className="flex-1 p-6 bg-slate-50 rounded-[1.8rem] text-center"><p className="text-2xl font-black text-slate-900">{course.notesCount}</p><p className="text-[9px] font-black uppercase text-slate-400 mt-1">Intel Logs</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'videohub': return (
        <div className="space-y-12 pb-20 animate-in fade-in">
          <header className="flex justify-between items-end"><h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Collaboration <span className="text-[#8B0000]">Node</span></h2><button className="px-10 py-5 bg-[#8B0000] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-2xl flex items-center gap-3"><Film size={18}/> Publish Hub</button></header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_VIDEOS.map(video => (
              <div key={video.id} className="bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-3xl transition-all">
                <div className="aspect-[9/16] relative overflow-hidden bg-slate-200">
                  <img src={video.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40"><Play size={32} fill="currentColor" /></div></div>
                </div>
                <div className="p-8 space-y-4">
                  <h4 className="text-slate-900 text-sm font-black uppercase tracking-tight line-clamp-2 leading-relaxed">{video.title}</h4>
                  <div className="flex items-center gap-3 border-t pt-4 border-slate-50"><img src={video.uploaderImage} className="w-8 h-8 rounded-xl object-cover"/><div className="overflow-hidden"><p className="text-[10px] font-black text-slate-900 uppercase truncate">{video.uploadedBy}</p><p className="text-[8px] text-slate-400 font-bold uppercase">{video.uploaderRole}</p></div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'events': return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-20">
          <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Event <span className="text-[#8B0000]">Mesh</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {MOCK_EVENTS.map(e => (
              <div key={e.id} className="bg-white rounded-[4.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:border-[#F0E68C] transition-all hover:shadow-3xl flex flex-col">
                <div className="h-64 relative overflow-hidden"><img src={e.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /><div className="absolute top-8 left-8 px-6 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl">{e.type}</div></div>
                <div className="p-14 flex-1">
                   <p className="text-[12px] font-black text-[#8B0000] uppercase tracking-widest mb-3 leading-none">{e.date} • {e.time}</p>
                   <h4 className="text-4xl font-black leading-tight uppercase tracking-tighter mb-5">{e.title}</h4>
                   <div className="flex items-center gap-4 text-slate-400 font-bold text-[12px] uppercase tracking-widest"><MapPin size={20} className="text-[#8B0000]"/> {e.location}</div>
                   <div className="mt-10 flex items-center justify-between"><span className="px-6 py-3 bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase rounded-[1.5rem] border border-emerald-100">{e.registeredCount} Synced Nodes</span><button className="px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95">Establish Link</button></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'careers': return <CareerHub user={user} />;
      case 'profile': return <ProfileHub user={user} setUser={setUser} />;
      case 'comms': return (
        <div className="space-y-12 animate-in fade-in pb-20">
          <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Campus <span className="text-[#8B0000]">Connect</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_FACULTY.map(f => (
              <div key={f.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:border-[#F0E68C] transition-all hover:shadow-2xl cursor-pointer">
                 <div className="flex items-center gap-6 mb-8">
                    <img src={f.instructorImage} className="w-20 h-20 rounded-[2rem] object-cover shadow-inner group-hover:scale-110 transition-transform duration-500" />
                    <div><h4 className="text-xl font-black text-slate-900 leading-none uppercase tracking-tighter">{f.instructor}</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Faculty Hub</p></div>
                 </div>
                 <div className="space-y-4 pt-8 border-t border-slate-50"><button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl">Establish Direct Flow</button></div>
              </div>
            ))}
          </div>
        </div>
      );
      default: return <Dashboard user={user} setTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser(null)} logo={logo} />
      <main className="md:ml-72 p-6 md:p-14 h-screen overflow-y-auto custom-scrollbar no-scrollbar scroll-smooth">{renderContent()}</main>
      {selectedCourse && <CourseDetail course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
    </div>
  );
}
