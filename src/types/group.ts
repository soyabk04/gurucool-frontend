export interface Group {
  _id?: string;

  name: string;

  groupCode: string;

  organization: string;

  coordinator: string; // User ID

  user:[]

  createdAt?: string;

  updatedAt?: string;
}