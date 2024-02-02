export interface MediaListType {
  id: string;
  humanFriendlyId: string;
  userId: string;
  title?: string;
  poster?: string;
  isSystem: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
