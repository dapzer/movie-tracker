import { FavoriteList } from '@/types/FavoriteList';
import { createSlice, isRejected, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { addFavoriteListItemApi, deleteFavoriteListItemApi, fetchFavoriteListApi, updateFavoriteListItemApi } from './favoriteListThunk';
import { FavoriteListPayload } from './types/FavoriteListPayload';
import { getFavoriteItemIndexes } from '@/utils/getFavoriteItemIndexes';
import { toast } from 'react-toastify';

interface FavoriteListState extends FavoriteList.StatusedObject {
  isGettingFavoriteList: boolean;
}

const initialState: FavoriteListState = {
  notViewed: [],
  allFavorites: [],
  viewed: [],
  waitNewPart: [],
  watchingNow: [],
  isGettingFavoriteList: false,
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
      const { indexInStatusedList, indexInAllFavorites } = getFavoriteItemIndexes(state, action.payload.mediaId, action.payload.mediaStatus);

      state[action.payload.mediaStatus][indexInStatusedList].trackingData = action.payload.newTrackingData;
      state.allFavorites[indexInAllFavorites].trackingData = action.payload.newTrackingData;
    },
    changeFavoriteListItemStatus: (state, action: PayloadAction<FavoriteListPayload.ChangeStatus>) => {
      const { indexInAllFavorites } = getFavoriteItemIndexes(state, action.payload.mediaId, action.payload.mediaStatus);

      state[action.payload.mediaStatus] = state[action.payload.mediaStatus].filter((el) => el.id !== action.payload.mediaId);
      state.allFavorites[indexInAllFavorites].trackingData.currentStatus = action.payload.newStatus;

      state[action.payload.newStatus].push(state.allFavorites[indexInAllFavorites]);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFavoriteListApi.fulfilled, (state, action) => {
      state.allFavorites = action.payload.allFavorites;
      state.notViewed = action.payload.notViewed;
      state.viewed = action.payload.viewed;
      state.waitNewPart = action.payload.waitNewPart;
      state.watchingNow = action.payload.watchingNow;
      state.isGettingFavoriteList = false;
    });
    builder.addCase(fetchFavoriteListApi.pending, (state) => {
      state.isGettingFavoriteList = true;
    });
    builder.addCase(addFavoriteListItemApi.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.allFavorites.push(action.payload);
      state[action.payload.trackingData.currentStatus].push(action.payload);
    });
    builder.addMatcher(
      isRejected(addFavoriteListItemApi, fetchFavoriteListApi, deleteFavoriteListItemApi, updateFavoriteListItemApi),
      (state, action) => {
        toast.warn(action.payload as string);
      }
    );
  },
});

export const { deleteFavoriteListItem, updateFavoriteListItem, changeFavoriteListItemStatus } = favoriteListSlice.actions;
export const selectFavoriteList = (state: RootState) => state.favoriteList;
export default favoriteListSlice.reducer;
