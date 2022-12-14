import { configureStore } from '@reduxjs/toolkit';
import { favoriteListSlice } from './features/favoriteList/favoriteListSlice';
import { searchParamsSlice } from './features/searchParams/searchParamsSlice';

export const store = configureStore({
  reducer: {
    favoriteList: favoriteListSlice.reducer,
    searchParams: searchParamsSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
