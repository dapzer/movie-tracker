import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface SearchParams {
  searchTerm: string;
  currentPage: number;
}

const initialState: SearchParams = {
  searchTerm: '',
  currentPage: 1,
};

export const searchParamsSlice = createSlice({
  name: 'searchParams',
  initialState,
  reducers: {
    changeSearchTern: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    changeCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});
export const { changeSearchTern, changeCurrentPage } = searchParamsSlice.actions;
export const selectSearchParams = (state: RootState) => state.searchParams;
export default searchParamsSlice.reducer;
