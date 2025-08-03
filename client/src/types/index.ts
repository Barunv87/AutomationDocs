export interface Lesson {
  _id?: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
}

export interface Tutorial {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail?: string;
  lessons: Lesson[];
  author: string;
  tags: string[];
  estimatedTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  tutorialId: string;
  completedLessons: number[];
  currentLesson: number;
  completedAt?: Date;
  progress: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  enrolledTutorials: Tutorial[];
  progress: UserProgress[];
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}