import { createAsyncThunk } from '@reduxjs/toolkit';
import { FavoriteList } from '@/types/FavoriteList';
import { FavoriteListPayload } from './types/FavoriteListPayload';
import { FavoriteListThunks } from './types/FavoriteListThunks';

export const fetchFavoriteListApi = createAsyncThunk('favoriteList/fetchById', async (userId: string, thunkAPI) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_FAVORITE_API}?userId=${userId}`);

  if (response.ok) {
    const data = await response.json();
    return data.favoriteList as FavoriteList.StatusedObject;
  }

  return thunkAPI.rejectWithValue(`Error when fetching favorite list. Code: ${response.status}`);
});

export const addFavoriteListItemApi = createAsyncThunk(
  'favoriteList/addItem',
  async ({ userId, mediaId, mediaType }: FavoriteListPayload.AddNew, thunkAPI) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FAVORITE_API}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, mediaId, mediaType }),
    });

    const data = await response.json();

    if (response.ok) {
      return data.favoriteItem as FavoriteList.RootObject;
    }

    return thunkAPI.rejectWithValue(`Error when adding new favorite list item. Code: ${response.status}`);
  },
);

export const deleteFavoriteListItemApi = createAsyncThunk('favoriteList/deleteItem',
  async ({
           userId,
           mediaId,
         }: FavoriteListThunks.Delete, thunkAPI) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FAVORITE_API}`, {
      method: 'DELETE',
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
    }

    return thunkAPI.rejectWithValue(`Error when deleting favorite list item. Code: ${response.status}`);
  });

export const updateFavoriteListItemApi = createAsyncThunk(
  'favoriteList/update',
  async ({ userId, mediaId, trackingData }: FavoriteListThunks.Update, thunkAPI) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FAVORITE_API}`, {
      method: 'PATCH',
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
    }

    thunkAPI.rejectWithValue(`Error when updating favorite list item. Code: ${response.status}`);
  },
);
