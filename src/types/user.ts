export type UserRole =
  | "user"
  | "coordinator"
  | "admin";

export interface PendingUser {
  name: string;
  email: string;
  ID: string;
  role: UserRole;
  groupCode: string;
}

export interface FailedUser {
  user: PendingUser;
  error: string;
}