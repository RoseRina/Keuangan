export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  fullName: string;
  email: string;
  createdAt: string;
  isActive: boolean;
}

export interface UserSession {
  user: User;
  loginTime: string;
}