export enum UserRoleEnum {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface UserType {
  id: string;
  // userName: string;
  name: string;
  email?: string;
  image?: string;
  isEmailVerified: boolean;
  password?: string;
  roles: UserRoleEnum[];
  createdAt: Date;
  updatedAt: Date;
}
