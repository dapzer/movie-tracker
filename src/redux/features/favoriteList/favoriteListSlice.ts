import { FavoriteList } from '../../../types/FavoriteList';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { addFavoriteListItemApi, fetchFavoriteListApi } from './favoriteListThunk';
import { FavoriteListPayload } from './types/FavoriteListPayload';
import { getFavoriteItemIndexesHelper } from '../../../utils/getFavoriteItemIndexes.helper';

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
    deleteFavoriteListItem: (state, action: PayloadAction<FavoriteListPayload.Delete>) => {
      state[action.payload.mediaStatus] = state[action.payload.mediaStatus].filter((el) => el.id !== action.payload.mediaId);
      state.allFavorites = state.allFavorites.filter((el) => el.id !== action.payload.mediaId);
    },
    updateFavoriteListItem: (state, action: PayloadAction<FavoriteListPayload.UpdateItem>) => {
      const { indexInStatusedList, indexInAllFavorites } = getFavoriteItemIndexesHelper(state, action.payload.mediaId, action.payload.mediaStatus);

      state[action.payload.mediaStatus][indexInStatusedList].trackingData = action.payload.newTrackingData;
      state.allFavorites[indexInAllFavorites].trackingData = action.payload.newTrackingData;
    },
    changeFavoriteListItemStatus: (state, action: PayloadAction<FavoriteListPayload.ChangeStatus>) => {
      const { indexInAllFavorites } = getFavoriteItemIndexesHelper(state, action.payload.mediaId, action.payload.mediaStatus);

      state[action.payload.mediaStatus] = state[action.payload.mediaStatus].filter((el) => el.id !== action.payload.mediaId);
      state.allFavorites[indexInAllFavorites].trackingData.currentStatus = action.payload.newStatus;

      state[action.payload.newStatus].push(state.allFavorites[indexInAllFavorites]);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFavoriteListApi.fulfilled, (state, action) => {
      return (state = action.payload || initialState);
    });
    builder.addCase(addFavoriteListItemApi.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.allFavorites.push(action.payload);
      state.notViewed.push(action.payload);
    });
  },
});

export const { deleteFavoriteListItem, updateFavoriteListItem, changeFavoriteListItemStatus } = favoriteListSlice.actions;
export const selectFavoriteList = (state: RootState) => state.favoriteList;
export default favoriteListSlice.reducer;
