import { FavoriteList } from '../../../types/FavoriteList';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const initialState: FavoriteList.StatusedObject = {
  notViewed: [],
  allFavorites: [],
  viewed: [],
  waitNewPart: [],
  watchingNow: [],
};

export const favoriteListSlice = createSlice({
  name: 'favoriteList',
  initialState,
  reducers: {
    deleteFavoriteListItem: (state, action) => {},
  },
});

export const { deleteFavoriteListItem } = favoriteListSlice.actions;
export const selectFavoriteList = (state: RootState) => state.favoriteList;
export default favoriteListSlice.reducer;
