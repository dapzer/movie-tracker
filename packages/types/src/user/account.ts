export interface Account {
  id: string;
  userId: string;
  access_token: string;
  refresh_token: string;
  provider: string;
  providerAccountId: string;
  expires_at: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
