export interface PendingUser {
  name: string;
  email: string;
  ID: string;
  role: UserRole;
  groupCode: string;
}
export type UserRole =
  | "superadmin"
  | "admin"
  | "coordinator"
  | "user";

export interface User {
  _id: string;

  name: string;
  email: string;
  ID: string;

  role: UserRole;

  active: boolean;

  otpverified: boolean;

  organization?: string;
  organizationName?: string;

  groupId?: string;
  groupName?: string;

  avatar?: string;

  createdAt: string;
  updatedAt: string;
}

export interface FailedUser {
  user: PendingUser;
  error: string;
}