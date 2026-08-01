// src/types/organization.ts

export interface Organization {
  name: string;
  domain: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrganizationUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateOraganization {
  name: string;
  domain: string;
  primaryColor: string;
  secondaryColor: string;
  users: {
    name: string;
    ID: string;
    email: string;
    role: "admin";
  }[];
}

