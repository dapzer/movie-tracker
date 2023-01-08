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
import { Credits } from '../types/Credits';
import { SearchResponse } from '../types/SearchResponse';
import { FavoriteList } from '../types/FavoriteList';
import { Videos } from '../types/Videos';
import { useCallback } from 'react';

export const useGetMovieDetails = (mediaId: number, mediaType: string, lang: string, initialData?: Details.RootObject) =>
  useQuery<Details.RootObject>({
    queryKey: [
      'getDetails',
      {
        mediaId: mediaId,
        mediaType: mediaType,
        language: lang,
      },
    ],
    queryFn: detailApi,
    initialData: initialData,
  });

export const useGetPersonDetails = (mediaId: number, mediaType: string, lang: string, initialData?: Person.RootObject) =>
  useQuery<Person.RootObject>({
    queryKey: [
      'getDetails',
      {
        mediaId: mediaId,
        mediaType: mediaType,
        language: lang,
      },
    ],
    queryFn: detailApi,
    initialData: initialData,
  });

export const useGetMovieCredits = (mediaId: number, mediaType: string, lang: string) =>
  useQuery<Credits.RootObject>(
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
  useQuery<Person.Credits>(
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
  useQuery<SearchResponse.RootObject>(
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
        queryFn: detailApi,
      };
    }),
  });

export const useGetPopularList = (mediaType: string, lang: string) =>
  useQuery<SearchResponse.RootObject>({
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
  useQuery<SearchResponse.RootObject>(
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
  useQuery<Videos.RootObject>({
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
      (data: Videos.RootObject) => {
        data.results = data.results.sort((a, b) => a.type === 'Trailer' || a.type === 'Teaser' ? -1 : 1);
        return data;
      }, [],
    ),
  });
