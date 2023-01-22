import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { FavoriteList } from '@/types/FavoriteList';
import { FavoriteListPayload } from './types/FavoriteListPayload';
import { FavoriteListThunks } from './types/FavoriteListThunks';

export const fetchFavoriteListApi = createAsyncThunk('favoriteList/fetchById', async (userId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_FAVORITE_API}?userId=${userId}`);

  if (response.ok) {
    const data = await response.json();
    return data.favoriteList as FavoriteList.StatusedObject;
  } else {
    toast.error(`Error when fetching favorite list. Code: ${response.status}`);
  }
});

export const addFavoriteListItemApi = createAsyncThunk('favoriteList/addItem', async ({ userId, favoriteItem }: FavoriteListPayload.AddNew) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_FAVORITE_API}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, favoriteItem }),
  });

  if (response.ok) {
    return favoriteItem as FavoriteList.RootObject;
  } else {
    toast.error(`Error when adding new favorite list item. Code: ${response.status}`);
  }
});

export const deleteFavoriteListItemApi = createAsyncThunk('favoriteList/deleteItem', async ({ userId, mediaId }: FavoriteListThunks.Delete) => {
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

  if (response.ok) {
    const data = await response.json();
    return data.msg;
  } else {
    toast.error(`Error when deleting favorite list item. Code: ${response.status}`);
  }
});

export const updateFavoriteListItemApi = createAsyncThunk(
  'favoriteList/update',
  async ({ userId, mediaId, trackingData }: FavoriteListThunks.Update) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FAVORITE_API}/update`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        id: mediaId,
        trackingData,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.msg;
    } else {
      toast.error(`Error when updating favorite list item. Code: ${response.status}`);
    }
  }
);
