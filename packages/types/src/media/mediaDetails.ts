import { MediaTypeEnum } from "./mediaItem";
import { TmdbMediaDetailsSeasonType } from "../tmdb";

export type MediaDetailsType = {
  id: string;
  mediaId: number;
  mediaType: MediaTypeEnum;
  score: number | null;
  en: MediaDetailsInfoType;
  ru: MediaDetailsInfoType;
  createdAt: Date;
  updatedAt: Date;
};

export type MediaDetailsInfoType = {
  title: string | null;
  originalTitle: string | null;
  poster: string | null;
  seasons?: TmdbMediaDetailsSeasonType[];
};
