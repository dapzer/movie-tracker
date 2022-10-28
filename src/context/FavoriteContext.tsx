import React, { createContext, FC, Reducer, useContext, useReducer } from 'react';
import { FavoriteList } from '../types/FavoriteList';
import { Actions, favoriteReducer } from './favoriteReducer';

interface FavoriteContext {
  favoriteList: FavoriteList.StatusedObject;
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
  const [favoriteList, dispatchFavoriteList] = useReducer<Reducer<any, any>>(favoriteReducer, []);

  return (
    <FavoriteContext.Provider
      value={React.useMemo(() => {
        return { favoriteList, dispatchFavoriteList };
      }, [favoriteList, dispatchFavoriteList])}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
