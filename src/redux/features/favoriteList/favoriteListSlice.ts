import { FavoriteList } from '../../../types/FavoriteList';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { addFavoriteListItemApi, fetchFavoriteListApi } from './favoriteListThunk';
import { FavoriteListPayload } from './FavoriteListPayload';
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
      state[action.payload.mediaStatus].filter((el) => el.id !== action.payload.mediaId);
      state.allFavorites.filter((el) => el.id !== action.payload.mediaId);
    },
    updateFavoriteListItemSeriesData: (state, action: PayloadAction<FavoriteListPayload.UpdateSeriesData>) => {
      const { indexInStatusedList, indexInAllFavorites } = getFavoriteItemIndexesHelper(state, action.payload.mediaId, action.payload.mediaStatus);

      state[action.payload.mediaStatus][indexInStatusedList].seriesData = action.payload.newSeriesData;
      state.allFavorites[indexInAllFavorites].seriesData = action.payload.newSeriesData;
    },
    changeFavoriteListItemStatus: (state, action: PayloadAction<FavoriteListPayload.ChangeStatus>) => {
      const { indexInAllFavorites } = getFavoriteItemIndexesHelper(state, action.payload.mediaId, action.payload.mediaStatus);

      state[action.payload.mediaStatus].filter((el) => el.id !== action.payload.mediaId);
      state.allFavorites[indexInAllFavorites].currentStatus = action.payload.newStatus;

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

export const { deleteFavoriteListItem, updateFavoriteListItemSeriesData, changeFavoriteListItemStatus } = favoriteListSlice.actions;
export const selectFavoriteList = (state: RootState) => state.favoriteList;
export default favoriteListSlice.reducer;
