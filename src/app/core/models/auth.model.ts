export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserDetail {
  userId: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  userdetailId: number;
  gender: string;
  dateOfBirth: string;
  profilePhotoUrl: string;
  address: string;
  city: string;
  country: string;
  points: number;
  membershipRank: string;
  notificationEmail: string;
  socialAccounts: Array<{
    provider: string;
    email: string;
  }>;
}
