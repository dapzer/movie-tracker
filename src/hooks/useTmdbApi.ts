import { useQueries, useQuery } from '@tanstack/react-query';
import { Details } from '@/types/Details';
import { creditsApi, detailApi, personCreditsApi, recommendationsApi, searchApi, seasonsApi, trendsApi, videosApi } from '@/api/fetchApi';
import { Person } from '@/types/Person';
import { FavoriteList } from '@/types/FavoriteList';
import { Videos } from '@/types/Videos';
import { useCallback } from 'react';
import { SeasonDetails } from '@/types/SeasonDetails';

export const useGetMovieDetails = (mediaId: number, mediaType: string, language: string, initialData?: Details.RootObject) =>
  useQuery({
    queryKey: [
      'getDetails',
      {
        mediaId,
        mediaType,
        language,
      },
    ],
    queryFn: () => detailApi({ mediaId, mediaType, language }),
    initialData: initialData,
  });

export const useGetPersonDetails = (mediaId: number, mediaType: string, language: string, initialData?: Person.RootObject) =>
  useQuery({
    queryKey: [
      'getDetails',
      {
        mediaId,
        mediaType,
        language,
      },
    ],
    queryFn: () => detailApi<Person.RootObject>({ mediaId, mediaType, language }),
    initialData: initialData,
  });

export const useGetMovieCredits = (mediaId: number, mediaType: string, language: string) =>
  useQuery(
    [
      'getCredits',
      {
        mediaId,
        mediaType,
        language,
      },
    ],
    () => creditsApi({ mediaId, mediaType, language })
  );

export const useGetPersonCredits = (personId: number, language: string) =>
  useQuery(
    [
      'getPersonCredits',
      {
        personId,
        language,
      },
    ],
    () => personCreditsApi({ personId, language })
  );

export const useGetRecommendations = (mediaId: number, mediaType: string, language: string) =>
  useQuery(
    [
      'getRecommendations',
      {
        mediaId,
        mediaType,
        language,
      },
    ],
    () => recommendationsApi({ mediaId, mediaType, language })
  );

export const useGetFavoriteItemsDetail = (favoriteList: FavoriteList.RootObject[], language: string) =>
  useQueries({
    queries: favoriteList.map((item) => {
      return {
        queryKey: [
          'getDetails',
          {
            mediaType: item.mediaType,
            mediaId: item.id,
            language,
          },
        ],
        queryFn: () =>
          detailApi({
            mediaType: item.mediaType,
            mediaId: item.id,
            language,
          }),
      };
    }),
  });

export const useGetPopularList = (mediaType: string, language: string) =>
  useQuery({
    queryKey: [
      'getPopularList',
      {
        mediaType,
        language,
      },
    ],
    queryFn: () => trendsApi({ language, mediaType }),
  });

export const useGetSearchByTerm = (searchValue: string, language: string, page: number) =>
  useQuery(
    [
      'getSearchByTerm',
      {
        searchValue,
        page,
        language,
      },
    ],
    () => searchApi({ searchValue, page, language })
  );

export const useGetVideos = (mediaId: number, mediaType: string, language: string) =>
  useQuery({
    queryKey: [
      'getVideos',
      {
        mediaId,
        mediaType,
        language,
      },
    ],
    queryFn: () => videosApi({ mediaId, mediaType, language }),
    select: useCallback((data: Videos.RootObject | null) => {
      if (!data) return null;
      data.results = data.results.sort((a, b) => (a.type === 'Trailer' || a.type === 'Teaser' ? -1 : 1));
      return data;
    }, []),
  });

export const useGetTvSeriesDetails = (mediaId: number, mediaType: string, language: string, initialData?: SeasonDetails.RootObject[]) =>
  useQuery({
    queryKey: [
      'getTvSeriesDetails',
      {
        mediaId,
        mediaType,
        language,
      },
    ],
    queryFn: () => seasonsApi({ mediaId, mediaType, language }).then((data) => data.seasons),
    initialData: initialData,
  });
