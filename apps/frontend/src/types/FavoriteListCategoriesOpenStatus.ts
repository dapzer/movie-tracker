import { FavoriteList } from '@/types/FavoriteList';

export type FavoriteListCategoriesOpenStatus = Record<Exclude<FavoriteList.StatusesNames, 'allFavorites'>, boolean>;
