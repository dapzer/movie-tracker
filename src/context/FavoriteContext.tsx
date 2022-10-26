import React, { createContext, FC, useContext, useReducer } from 'react';
import { FavoriteList } from '../types/FavoriteList';
import { Actions, favoriteReducer } from './favoriteReducer';

interface FavoriteContext {
  favoriteList: FavoriteList.RootObject[];
  dispatchFavoriteList: (value: Actions) => void;
}

const FavoriteContext = createContext<FavoriteContext>(null!);

export const useFavoriteContext = () => {
  return useContext(FavoriteContext);
};

interface Props {
  children: React.ReactNode;
}

export const FavoriteContextProvider: FC<Props> = ({ children }) => {
  const [favoriteList, dispatchFavoriteList] = useReducer(favoriteReducer, null!);

  return <FavoriteContext.Provider value={{ favoriteList, dispatchFavoriteList }}>{children}</FavoriteContext.Provider>;
};
