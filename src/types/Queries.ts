export module Queries {
  type Language = string;
  type SearchValue = string;
  type Page = number;
  type MediaType = string;
  type MediaId = number;

  export interface Search {
    language: Language;
    searchValue: SearchValue;
    page: Page;
  }

  export interface PersonCredits {
    language: Language;
    personId: MediaId;
  }

  export interface Trends {
    language: Language;
    mediaType: MediaType;
  }

  export interface Seasons extends RootObject {}

  export interface RootObject {
    language: Language;
    mediaType: MediaType;
    mediaId: MediaId;
  }
}
