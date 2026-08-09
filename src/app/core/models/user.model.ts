export interface User {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string; // or Date if you convert it
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  role:string;
}

export interface UserProfile extends User {
  department?: string;
  bio?: string;
  zipCode?: string;
  profilePhoto:string;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: User;
  user:User;
  errors: any;
  accessToken:any;
}

export interface AuthState {
  isAuthenticated: boolean;
  user?: User;
  loading: boolean;
  error?: string;
}