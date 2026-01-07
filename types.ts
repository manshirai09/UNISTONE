
export enum UserRole {
  STUDENT = 'student',
  FACULTY = 'faculty',
  ADMIN = 'admin'
}

export interface Project {
  title: string;
  description: string;
  link: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enrollmentNo?: string;
  department: string;
  year?: string;
  xp: number;
  streak: number;
  bio?: string;
  skills?: string[];
  projects?: Project[];
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  type: 'short' | 'long';
  subject: string;
  department: string;
  uploadedBy: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  likes: number;
  views: number;
  createdAt: string;
}

export interface MapCoords {
  top: string;
  left: string;
}

export interface Authority {
  name: string;
  title: string;
  phone: string;
  email: string;
  room: string;
}

export interface CampusBuilding {
  id: string;
  name: string;
  description: string;
  color: string;
  image: string;
  floors: number;
  departments: string[];
  facilities: string[];
  authorities: Authority[];
  mapCoords: MapCoords;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  notesCount: number;
  lecturesCount: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  department: string;
  eligibility: 'Open to All' | 'CS Students Only' | 'Faculty Only' | 'Final Year Only';
  flyerUrl: string;
  registeredCount: number;
  isPopular?: boolean;
  type: 'hackathon' | 'workshop' | 'competition' | 'cultural';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  type: 'full-time' | 'internship';
  location: string;
  link: string;
  salary?: string;
  tags: string[];
}

export interface CommunityPost {
  id: string;
  author: string;
  role: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
}

export interface ScheduleItem {
  day: string;
  time: string;
  subject: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}
