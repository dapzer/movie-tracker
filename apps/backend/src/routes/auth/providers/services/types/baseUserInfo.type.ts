export type BaseUserInfoType = {
  id: string;
  avatarUrl: string;
  name: string;
  email: string | null;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  provider: string;
};
