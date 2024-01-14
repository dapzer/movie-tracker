import { MediaTypeEnum } from "@movie-tracker/types";

export interface MediaItemCreateApiTypes {
  mediaListId: string,
  mediaType: MediaTypeEnum,
  mediaId: number
}
