export interface MediaListType {
  id: string;
  userId: string;
  title?: string;
  poster?: string;
  isSystem: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
