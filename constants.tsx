
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
  User as UserIcon
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
    id: '1', 
    name: 'Engineering Block', 
    color: 'bg-blue-600', 
    image: 'https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?auto=format&fit=crop&q=80&w=1200',
    description: 'Main engineering facility with library, admission office and ATM services.', 
    floors: 5,
    departments: ['Computer Science', 'Mechanical', 'Civil', 'Electrical'],
    mapCoords: { top: '35%', left: '25%' },
    facilities: ['Library', 'Admission Office', 'ATM', 'Laboratories'],
    authorities: [
      {
        name: 'Dr. Amit Singh',
        title: 'Dean of Engineering',
        phone: '+91-9876543212',
        email: 'dean.engineering@university.edu',
        room: 'Floor 5, Room DEAN-501'
      }
    ]
  },
  { 
    id: '2', 
    name: 'Admin Block', 
    color: 'bg-emerald-600', 
    image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200',
    description: 'Central administrative offices and registry.', 
    floors: 3,
    departments: ['Administration', 'Accounts', 'Registry'],
    mapCoords: { top: '25%', left: '45%' },
    facilities: ['Vice Chancellor Office', 'Student Help Desk', 'Accounts Window'],
    authorities: [
      {
        name: 'Prof. R.K. Sharma',
        title: 'Registrar',
        phone: '+91-9988776655',
        email: 'registrar@university.edu',
        room: 'Ground Floor, Admin-101'
      }
    ]
  },
  { 
    id: '3', 
    name: 'Pharmacy Block', 
    color: 'bg-purple-600', 
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660feac88?auto=format&fit=crop&q=80&w=1200',
    description: 'Pharmaceutical sciences and formulation labs.', 
    floors: 4,
    departments: ['Pharmaceutics', 'Pharmacology'],
    mapCoords: { top: '55%', left: '30%' },
    facilities: ['Pharma Labs', 'Medical Store', 'Herbal Garden'],
    authorities: [
      {
        name: 'Dr. Neha Gupta',
        title: 'HOD Pharmacy',
        phone: '+91-8877665544',
        email: 'hod.pharmacy@university.edu',
        room: 'Floor 2, PH-204'
      }
    ]
  }
];

export const MOCK_COURSES: Course[] = [
  { id: 'c1', name: 'Data Structures & Algorithms', code: 'CS301', instructor: 'Dr. Alan Turing', notesCount: 15, lecturesCount: 12 },
  { id: 'c2', name: 'Advanced Quantum Physics', code: 'PH405', instructor: 'Prof. Richard Feynman', notesCount: 8, lecturesCount: 6 },
  { id: 'c3', name: 'Modern Architecture', code: 'AR101', instructor: 'Ar. Zaha Hadid', notesCount: 10, lecturesCount: 8 },
];

// Added explicit typing to MOCK_VIDEOS to ensure the 'type' field is restricted to 'short' | 'long'
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

// Add missing link property to mock job data
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
