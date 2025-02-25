export interface User {
  id: string;
  name: string;
  skills: string[];
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  hackathonId: string;
  members: User[];
  projectName?: string;
  projectDescription?: string;
  projectRepo?: string;
  submissionUrl?: string;
}

export interface Hackathon {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  maxTeamSize: number;
  prizes: Prize[];
  tracks: Track[];
  status: 'upcoming' | 'active' | 'completed';
  createdBy: string;
}

export interface Prize {
  name: string;
  description: string;
  value: string;
}

export interface Track {
  name: string;
  description: string;
}

export interface Project {
  id: string;
  teamId: string;
  hackathonId: string;
  name: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  submissionTime: string;
  track?: string;
  votes: Vote[];
}

export interface Vote {
  userId: string;
  projectId: string;
  score: number;
  timestamp: string;
} 