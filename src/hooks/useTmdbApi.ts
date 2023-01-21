import { useQueries, useQuery } from '@tanstack/react-query';
import { Details } from '../types/Details';
import {
  creditsApi,
  detailApi,
  personCreditsApi,
  recommendationsApi,
  searchApi,
  trendsApi,
  videosApi,
} from '../api/fetchApi';
import { Person } from '../types/Person';
import { FavoriteList } from '../types/FavoriteList';
import { Videos } from '../types/Videos';
import { useCallback } from 'react';

export const useGetMovieDetails = (mediaId: number, mediaType: string, lang: string, initialData?: Details.RootObject) =>
  useQuery({
    queryKey: [
      'getDetails',
      {
        mediaId: mediaId,
        mediaType: mediaType,
        language: lang,
      },
    ],
    queryFn: () => detailApi({ mediaId, mediaType, language: lang }),
    initialData: initialData,
  });

export const useGetPersonDetails = (mediaId: number, mediaType: string, lang: string, initialData?: Person.RootObject) =>
  useQuery({
    queryKey: [
      'getDetails',
      {
        mediaId: mediaId,
        mediaType: mediaType,
        language: lang,
      },
    ],
    queryFn: () => detailApi<Person.RootObject>({ mediaId, mediaType, language: lang }),
    initialData: initialData,
  });

export const useGetMovieCredits = (mediaId: number, mediaType: string, lang: string) =>
  useQuery(
    [
      'getCredits',
      {
        mediaId: mediaId,
        mediaType: mediaType,
        language: lang,
      },
    ],
    creditsApi,
  );


export const useGetPersonCredits = (personId: number, lang: string) =>
  useQuery(
    [
      'getPersonCredits',
      {
        person_id: personId,
        language: lang,
      },
    ],
    personCreditsApi,
  );

export const useGetRecommendations = (mediaId: number, mediaType: string, lang: string) =>
  useQuery(
    [
      'getRecommendations',
      {
        mediaId: mediaId,
        mediaType: mediaType,
        language: lang,
      },
    ],
    recommendationsApi,
  );

export const useGetFavoriteItemsDetail = (favoriteList: FavoriteList.RootObject[], lang: string) =>
  useQueries({
    queries: favoriteList.map((item) => {
      return {
        queryKey: [
          'getDetails',
          {
            mediaType: item.mediaType,
            mediaId: item.id,
            language: lang,
          },
        ],
        queryFn: () => detailApi({
          mediaType: item.mediaType,
          mediaId: item.id,
          language: lang,
        }),
      };
    }),
  });

export const useGetPopularList = (mediaType: string, lang: string) =>
  useQuery({
    queryKey: [
      'getPopularList',
      {
        mediaType: mediaType,
        language: lang,
      },
    ],
    queryFn: trendsApi,
  });

export const useGetSearchByTerm = (searchTerm: string, lang: string, currentPage: number) =>
  useQuery(
    [
      'getSearchByTerm',
      {
        searchValue: searchTerm,
        page: currentPage,
        language: lang,
      },
    ],
    searchApi,
  );

export const useGetVideos = (mediaId: number, mediaType: string, lang: string) =>
  useQuery({
    queryKey: [
      'getVideos',
      {
        mediaId: mediaId,
        mediaType: mediaType,
        language: lang,
      },
    ],
    queryFn: videosApi,
    select: useCallback(
      (data: Videos.RootObject | null) => {
        if (!data) return null;
        data.results = data.results.sort((a, b) => a.type === 'Trailer' || a.type === 'Teaser' ? -1 : 1);
        return data;
      }, [],
    ),
  });
