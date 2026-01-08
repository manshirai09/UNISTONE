
import React from 'react';
import { 
  Map as MapIcon, 
  BookOpen, 
  Video as VideoIcon, 
  Calendar, 
  MessageSquare, 
  Briefcase, 
  ShieldAlert, 
  Bot,
  LayoutDashboard,
  User as UserIcon,
  Home
} from 'lucide-react';
import { CampusBuilding, UserRole, CampusEvent, Course, Job, CommunityPost, ScheduleItem, Video } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'navigation', label: 'Campus Map', icon: <MapIcon size={20} /> },
  { id: 'edustone', label: 'Edustone Hub', icon: <BookOpen size={20} /> },
  { id: 'videohub', label: 'Video Hub', icon: <VideoIcon size={20} /> },
  { id: 'events', label: 'Events', icon: <Calendar size={20} /> },
  { id: 'comms', label: 'Connect', icon: <MessageSquare size={20} /> },
  { id: 'careers', label: 'Careers', icon: <Briefcase size={20} /> },
  { id: 'profile', label: 'My Profile', icon: <UserIcon size={20} /> },
];

export const MOCK_BUILDINGS: CampusBuilding[] = [
  { 
    id: 'A', 
    name: 'A Block (Administration)', 
    color: 'bg-emerald-600', 
    image: 'data:image/jpeg;base64,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',
    description: 'Central administrative hub housing the VC office, registrar, and student support services.', 
    floors: 3,
    departments: ['Registry', 'Accounts', 'VC Office', 'Human Resources'],
    mapCoords: { top: '20%', left: '50%' },
    facilities: ['Reception', 'ATM', 'Conference Hall'],
    authorities: [{ name: 'Prof. R.K. Sharma', title: 'Registrar', phone: '011-23456', email: 'reg@unistone.edu', room: 'A-101' }]
  },
  { 
    id: 'B', 
    name: 'B Block', 
    color: 'bg-blue-600', 
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
    description: 'Department of Computer Science and Information Technology.', 
    floors: 5,
    departments: ['Computer Science', 'AI & ML', 'Cybersecurity'],
    mapCoords: { top: '30%', left: '40%' },
    facilities: ['Server Room', 'IoT Lab', 'Coding Studio'],
    authorities: [{ name: 'Dr. Alan Turing', title: 'HOD CS', phone: '011-23457', email: 'turing@unistone.edu', room: 'B-302' }]
  },
  { 
    id: 'C', 
    name: 'C Block', 
    color: 'bg-blue-500', 
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&q=80&w=1200',
    description: 'School of Humanities and Social Sciences.', 
    floors: 4,
    departments: ['Psychology', 'Sociology', 'Political Science'],
    mapCoords: { top: '30%', left: '60%' },
    facilities: ['Counseling Center', 'Seminar Room'],
    authorities: []
  },
  { 
    id: 'D', 
    name: 'D Block', 
    color: 'bg-indigo-600', 
    image: 'https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?auto=format&fit=crop&q=80&w=1200',
    description: 'Engineering and Applied Sciences facility.', 
    floors: 4,
    departments: ['Mechanical', 'Civil', 'Electrical'],
    mapCoords: { top: '40%', left: '30%' },
    facilities: ['Workshop', 'Fluid Mechanics Lab'],
    authorities: []
  },
  { 
    id: 'E', 
    name: 'E Block', 
    color: 'bg-purple-600', 
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660feac88?auto=format&fit=crop&q=80&w=1200',
    description: 'Life Sciences and Biotechnology center.', 
    floors: 4,
    departments: ['Biotechnology', 'Botany', 'Zoology'],
    mapCoords: { top: '40%', left: '70%' },
    facilities: ['Greenhouse', 'Microbiology Lab'],
    authorities: []
  },
  { 
    id: 'F', 
    name: 'F Block', 
    color: 'bg-cyan-600', 
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200',
    description: 'Management Studies and Commerce wing.', 
    floors: 3,
    departments: ['Business Admin', 'Finance', 'Marketing'],
    mapCoords: { top: '50%', left: '20%' },
    facilities: ['Mock Boardroom', 'Incubation Cell'],
    authorities: []
  },
  { 
    id: 'G', 
    name: 'G Block', 
    color: 'bg-sky-600', 
    image: 'https://images.unsplash.com/photo-1498243639359-2818a77e8017?auto=format&fit=crop&q=80&w=1200',
    description: 'School of Law and Legal Studies.', 
    floors: 3,
    departments: ['Cyber Law', 'Corporate Law', 'Criminal Justice'],
    mapCoords: { top: '50%', left: '80%' },
    facilities: ['Moot Court', 'Legal Aid Clinic'],
    authorities: []
  },
  { 
    id: 'H', 
    name: 'H Block', 
    color: 'bg-teal-600', 
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
    description: 'Mass Communication and Journalism studio.', 
    floors: 3,
    departments: ['Journalism', 'Animation', 'Media Production'],
    mapCoords: { top: '60%', left: '30%' },
    facilities: ['News Room', 'Radio Station', 'Photography Lab'],
    authorities: []
  },
  { 
    id: 'I', 
    name: 'I Block', 
    color: 'bg-rose-600', 
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200',
    description: 'Pharmacy and Health Sciences.', 
    floors: 4,
    departments: ['Pharmaceutics', 'Public Health'],
    mapCoords: { top: '60%', left: '70%' },
    facilities: ['Medical Dispensary', 'Analytical Lab'],
    authorities: [{ name: 'Dr. Neha Gupta', title: 'HOD Pharma', phone: '011-23458', email: 'neha@unistone.edu', room: 'I-204' }]
  },
  { 
    id: 'J', 
    name: 'J Block', 
    color: 'bg-orange-600', 
    image: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f67?auto=format&fit=crop&q=80&w=1200',
    description: 'Fine Arts and Design hub.', 
    floors: 3,
    departments: ['Fashion Design', 'Interior Design', 'Visual Arts'],
    mapCoords: { top: '70%', left: '40%' },
    facilities: ['Fashion Lab', 'Art Gallery'],
    authorities: []
  },
  { 
    id: 'K', 
    name: 'K Block', 
    color: 'bg-violet-600', 
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200',
    description: 'Education and Research wing.', 
    floors: 4,
    departments: ['B.Ed', 'M.Ed', 'PhD Research'],
    mapCoords: { top: '70%', left: '60%' },
    facilities: ['Research Lounge', 'E-Library'],
    authorities: []
  },
  { 
    id: 'L', 
    name: 'L Block', 
    color: 'bg-blue-700', 
    image: 'https://images.unsplash.com/photo-1507733593252-b462c6da7f3d?auto=format&fit=crop&q=80&w=1200',
    description: 'Central Library and Resource Center.', 
    floors: 6,
    departments: ['Library Sciences'],
    mapCoords: { top: '80%', left: '50%' },
    facilities: ['Quiet Study Zone', 'Digital Archive'],
    authorities: []
  },
  { 
    id: 'M', 
    name: 'M Block', 
    color: 'bg-slate-700', 
    image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=1200',
    description: 'Research and Development / Startup Hub.', 
    floors: 4,
    departments: ['R&D', 'Innovation Cell'],
    mapCoords: { top: '85%', left: '30%' },
    facilities: ['Fab Lab', 'Maker Space'],
    authorities: []
  },
  { 
    id: 'C1', 
    name: 'Canteen Block 1', 
    color: 'bg-yellow-600', 
    image: 'https://images.unsplash.com/photo-1567529684892-0f79df4955ff?auto=format&fit=crop&q=80&w=1200',
    description: 'Main campus cafeteria serving various cuisines.', 
    floors: 2,
    departments: [],
    mapCoords: { top: '45%', left: '50%' },
    facilities: ['Food Court', 'Coffee Shop', 'Seating Area'],
    authorities: []
  },
  { 
    id: 'C2', 
    name: 'Canteen Block 2', 
    color: 'bg-yellow-500', 
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200',
    description: 'North Campus food court and snack point.', 
    floors: 1,
    departments: [],
    mapCoords: { top: '75%', left: '50%' },
    facilities: ['Juice Bar', 'Quick Bites'],
    authorities: []
  },
  { 
    id: 'H1', 
    name: 'Aagan 1 (Girls Hostel)', 
    color: 'bg-pink-600', 
    image: 'https://images.unsplash.com/photo-1555854817-5b2738a77fd5?auto=format&fit=crop&q=80&w=1200',
    description: 'Premium female residential wing with 24/7 security and dining.', 
    floors: 6,
    departments: ['Hostel Administration'],
    mapCoords: { top: '5%', left: '80%' },
    facilities: ['Mess Hall', 'Gym', 'Laundry'],
    authorities: []
  },
  { 
    id: 'H2', 
    name: 'Aagan 2 (Girls Hostel)', 
    color: 'bg-pink-500', 
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200',
    description: 'Secondary female residential wing with modern amenities.', 
    floors: 4,
    departments: ['Hostel Administration'],
    mapCoords: { top: '15%', left: '85%' },
    facilities: ['Common Room', 'Reading Area'],
    authorities: []
  },
  { 
    id: 'H3', 
    name: 'Prangan 1 (Boys Hostel)', 
    color: 'bg-blue-800', 
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
    description: 'Main male residential complex with extensive sports facilities.', 
    floors: 8,
    departments: ['Hostel Administration'],
    mapCoords: { top: '85%', left: '15%' },
    facilities: ['Cricket Ground', 'Mess Hall', 'Badminton Court'],
    authorities: []
  },
  { 
    id: 'H4', 
    name: 'Prangan 2 (Boys Hostel)', 
    color: 'bg-blue-900', 
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200',
    description: 'Secondary male residential complex for seniors.', 
    floors: 5,
    departments: ['Hostel Administration'],
    mapCoords: { top: '75%', left: '10%' },
    facilities: ['Library', 'Dining Area', 'Indoor Games'],
    authorities: []
  }
];

export const MOCK_COURSES: Course[] = [
  { id: 'c1', name: 'Data Structures & Algorithms', code: 'CS301', instructor: 'Dr. Alan Turing', notesCount: 15, lecturesCount: 12 },
  { id: 'c2', name: 'Advanced Quantum Physics', code: 'PH405', instructor: 'Prof. Richard Feynman', notesCount: 8, lecturesCount: 6 },
  { id: 'c3', name: 'Modern Architecture', code: 'AR101', instructor: 'Ar. Zaha Hadid', notesCount: 10, lecturesCount: 8 },
];

export const MOCK_VIDEOS: Video[] = [
  { 
    id: 'v1', 
    title: 'Complexity Analysis in 60s', 
    type: 'short', 
    subject: 'CS301', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-34440-large.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/v1/400/700',
    likes: 120,
    views: 1200,
    description: 'Brief overview', department: 'CS', uploadedBy: 'Prof. X', duration: 60, createdAt: '2024'
  },
  { 
    id: 'v2', 
    title: 'How Pointers Work', 
    type: 'short', 
    subject: 'CS301', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-white-robot-moving-its-hands-and-head-4622-large.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/v2/400/700',
    likes: 450,
    views: 3400,
    description: 'Pointer logic', department: 'CS', uploadedBy: 'Prof. Y', duration: 45, createdAt: '2024'
  },
  { 
    id: 'v3', 
    title: 'Full Lecture: Neural Networks 101', 
    type: 'long', 
    subject: 'CS502', 
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/v3/800/450',
    likes: 2100,
    views: 15000,
    description: 'Deep dive into NN', department: 'CS', uploadedBy: 'Prof. Z', duration: 3600, createdAt: '2024'
  },
];

export const MOCK_EVENTS: CampusEvent[] = [
  {
    id: 'e1',
    title: 'TechXplore 2024',
    description: 'The annual flagship technology fest of UNISTONE. Hackathons, workshops, and startup pitching sessions await you.',
    date: 'Oct 24, 2024',
    time: '09:00 AM',
    location: 'Main Auditorium',
    department: 'Computer Science',
    eligibility: 'Open to All',
    flyerUrl: 'https://images.unsplash.com/photo-1540575861501-7ad060e39fe5?auto=format&fit=crop&q=80&w=800',
    registeredCount: 450,
    isPopular: true,
    type: 'hackathon'
  },
  {
    id: 'e2',
    title: 'Quantum Computing Workshop',
    description: 'A deep dive into qubits and quantum gates with industry experts from IBM Quantum.',
    date: 'Nov 02, 2024',
    time: '11:30 AM',
    location: 'Science Block - Lab 402',
    department: 'Physics',
    eligibility: 'CS Students Only',
    flyerUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    registeredCount: 120,
    type: 'workshop'
  },
  {
    id: 'e3',
    title: 'Sage Cultural Fest',
    description: 'Join us for a day of music, dance, and cultural exchange. Showcasing the diverse talent of our university.',
    date: 'Dec 15, 2024',
    time: '04:00 PM',
    location: 'Open Air Theatre',
    department: 'Arts & Culture',
    eligibility: 'Open to All',
    flyerUrl: 'https://images.unsplash.com/photo-1514525253361-bee8718a34a1?auto=format&fit=crop&q=80&w=800',
    registeredCount: 890,
    isPopular: true,
    type: 'cultural'
  },
  {
    id: 'e4',
    title: 'AI Ethics Competition',
    description: 'A formal debate on the implications of AI on modern society. Win prizes and internships.',
    date: 'Nov 20, 2024',
    time: '10:00 AM',
    location: 'Admin Block Hall B',
    department: 'Social Sciences',
    eligibility: 'Open to All',
    flyerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    registeredCount: 230,
    type: 'competition'
  }
];

export const MOCK_JOBS: Job[] = [
  { id: 'j1', title: 'Frontend Developer Intern', company: 'Google', type: 'internship', location: 'Remote', link: '#', salary: '50k/mo', tags: ['React', 'TS'] },
  { id: 'j2', title: 'Software Engineer', company: 'Microsoft', type: 'full-time', location: 'Hyderabad', link: '#', salary: '24 LPA', tags: ['C++', 'Azure'] },
];

export const MOCK_POSTS: CommunityPost[] = [
  { id: 'p1', author: 'Dr. Alan Turing', role: 'Faculty', content: 'Does anyone have questions about tomorrow\'s quiz on Binary Trees?', likes: 24, comments: 8, time: '2h ago' },
  { id: 'p2', author: 'Alex Reed', role: 'Student', content: 'Just finished the hackathon flyer. Who\'s joining the design team?', likes: 42, comments: 12, time: '5h ago' },
];

export const MOCK_SCHEDULE: ScheduleItem[] = [
  { day: 'Mon', time: '10:00 AM', subject: 'Data Structures', room: 'E-201', type: 'Lecture' },
  { day: 'Mon', time: '12:30 PM', subject: 'Cloud Computing', room: 'CS Lab 1', type: 'Lab' },
  { day: 'Tue', time: '09:00 AM', subject: 'Algorithms', room: 'E-202', type: 'Lecture' },
  { day: 'Wed', time: '11:00 AM', subject: 'System Design', room: 'E-105', type: 'Tutorial' },
];
