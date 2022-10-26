import { getResponse } from './fetchApi';
import { FavoriteList } from '../types/FavoriteList';

export const getFavoriteListApi = async (userId: string | undefined) => {
  return getResponse(`${process.env.NEXT_PUBLIC_FAVORITE_API}?userId=${userId}`);
};

export const updateFavoriteListApi = async (userId: string | undefined, mediaId?: number, seriesData?: FavoriteList.SeriesData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_FAVORITE_API}/update`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      id: mediaId,
      ...seriesData,
    }),
  });
  const data = await response.json();

  return data;
};

export const addFavoriteListItem = async (userId: string | undefined, newFavoriteItem: FavoriteList.RootObject) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_FAVORITE_API}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, ...newFavoriteItem }),
  });
  const data = await response.json();

  return data;
};

export const deleteFavoriteListApi = async (userId: string | undefined, mediaId?: number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_FAVORITE_API}/delete`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      id: mediaId,
    }),
  });
  const data = await response.json();

  return data;
};
