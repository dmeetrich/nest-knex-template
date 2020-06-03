export interface User {
  id: number;
  email: string;
  firstName: string;
  secondName: string;
  password?: string;
  role: number;
  isDeleted: boolean;
}

export interface CreateUser {
  email: string;
  firstName: string;
  secondName: string;
  password: string;
}

export interface GetUser {
  id?: number;
  email?: string;
  password?: string;
}

export interface Role {
  id: number;
  name: string;
  defaultRole: boolean;
}

export interface OnlyUser {
  email: string;
  firstName?: string;
  secondName?: string;
  password?: string;
  role?: number;
}

export interface UserRole {
  id: number;
  email: string;
  firstName: string;
  secondName: string;
  password?: string;
  role: string;
  isDeleted: boolean;
}
