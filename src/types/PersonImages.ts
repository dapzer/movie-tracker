export declare module PersonImages {
  export interface Profile {
    aspect_ratio: number;
    height: number;
    iso_639_1?: any;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }

  export interface RootObject {
    id: number;
    profiles: Profile[];
  }
}
