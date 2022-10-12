import { SearchItem } from './SearchItem';

export interface SearchResponse {
  page: number;
  results: SearchItem[];
  total_pages: number;
  total_results: number;
}
