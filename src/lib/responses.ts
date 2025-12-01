export interface RefreshToken {
  token: string;
  createdAt: string;
  expiresAt: string;
}

export interface BusinessRole {
  role: string;
  name: string;
  applicationRoles: string[];
  accessibleRoles: string[] | null;
  permitAllRoles: boolean;
  key: string;
}

export interface User {
  userId: string;
  fullName: string;
  email: string;
  avatar: string | null;
  gender: string | null;
  username: string;
  premium: boolean;
  token: string;
  refreshToken: RefreshToken;
  businessRole: BusinessRole;
}
