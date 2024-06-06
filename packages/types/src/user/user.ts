export enum UserRoleEnum {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum SignUpMethodEnum {
  EMAIL = "EMAIL",
  GOOGLE = "GOOGLE",
  GITHUB = "GITHUB",
  VK = "VK",
  YANDEX = "YANDEX",
}

export interface UserType {
  id: string;
  // userName: string;
  name: string;
  email?: string;
  image?: string;
  isEmailVerified: boolean;
  signUpMethod: SignUpMethodEnum;
  password?: string;
  roles: UserRoleEnum[];
  createdAt: Date;
  updatedAt: Date;
}
