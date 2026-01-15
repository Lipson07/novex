export interface HeaderInterface {
  id: number;
  name: string;
  active: boolean;
}

export interface TaskInterface {
  id: number;
  name: string;
  active: boolean;
  success: boolean;
  project: string;
  risk: string;
  riskId: number;
  createdAt: string;
  dedline: string;
  blocked: boolean;
  overdue: boolean;
}
export interface UserInterface {
  userid: number;
  email: string;
  password: string;
  name: string;
  online: boolean;
  role: string;
  avatar: boolean;
}
