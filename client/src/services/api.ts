import axios from 'axios';
import { Tutorial, AuthResponse, User } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const tutorialApi = {
  getAllTutorials: (params?: { category?: string; difficulty?: string; search?: string }) => 
    api.get<Tutorial[]>('/tutorials', { params }),
  
  getTutorial: (id: string) => 
    api.get<Tutorial>(`/tutorials/${id}`),
  
  enrollInTutorial: (tutorialId: string, userId: string) =>
    api.post(`/tutorials/${tutorialId}/enroll`, { userId }),
  
  updateProgress: (tutorialId: string, userId: string, lessonOrder: number) =>
    api.post(`/tutorials/${tutorialId}/progress`, { userId, lessonOrder }),
};

export const authApi = {
  register: (userData: { username: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', credentials),
  
  getUserProfile: (userId: string) =>
    api.get<User>(`/auth/profile/${userId}`),
};

export default api;