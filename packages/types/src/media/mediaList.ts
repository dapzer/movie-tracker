export interface MediaListType {
  id: string;
  humanFriendlyId: string;
  userId: string;
  title?: string;
  poster?: string;
  likesCount?: number;
  isLiked?: boolean;
  isSystem: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaListLikeType {
  id: string;
  mediaListId: string;
  mediaListHumanFriendlyId?: string;
  userId: string;
  createdAt: Date;
}
