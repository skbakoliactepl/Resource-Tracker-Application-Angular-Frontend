// models/auth.models.ts

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;  // e.g. seconds or timestamp depending on your API
  role: string;       // role returned from backend JWT or login API
}

export interface User {
  username: string;
  email: string;
  role: string;
}
