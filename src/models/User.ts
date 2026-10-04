export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN"
}

export interface User {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}