// models/auth.models.ts

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;  // e.g. seconds or timestamp depending on your API
  roleName: string;       // role returned from backend JWT or login API
}

export interface User {
  fullName?: string;
  userID?: number;
  username: string;
  email: string;
  role: string;
  organization?: string;
  projects?: string;
  designation?: string;
  resourceID?: number;
  address?: string;
}

export interface ResetPasswordRequest {
  userID: number;
  newPassword?: string;
  currentPassword?: string;
}
