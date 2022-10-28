import { useEffect, useState } from 'react';
import { Details } from '../types/Details';
import { FavoriteList } from '../types/FavoriteList';
import { useFavorite } from './useFavorite';

export const useSeriesControls = (favoriteData: FavoriteList.RootObject, seasons: Details.Season[]) => {
  const { updateFavoriteList } = useFavorite();
  const [currentSeason, setCurrentSeason] = useState(favoriteData.seriesData.currentSeason);
  const [currentEpisode, setCurrentEpisode] = useState(favoriteData.seriesData.currentEpisode);

  const updateSeries = () => {
    if (favoriteData.seriesData.currentSeason === currentSeason && favoriteData.seriesData.currentEpisode === currentEpisode) return;
    favoriteData.seriesData.currentSeason = currentSeason;
    favoriteData.seriesData.currentEpisode = currentEpisode;

    updateFavoriteList(favoriteData.id, favoriteData.seriesData, favoriteData.currentStatus);
  };

  const generateEpisodesList = (totalCount: number) => {
    const episodes: number[] = [];

    for (let i = 1; i <= totalCount; i++) {
      episodes.push(i);
    }

    return episodes;
  };

  const handleSeason = (season: number) => {
    if (currentSeason === season) return;
    setCurrentSeason(season);
    setCurrentEpisode(1);
  };

  useEffect(() => {
    updateSeries();
  }, [currentEpisode, currentSeason]);

  return {
    updateSeries,
    setCurrentSeason,
    handleSeason,
    setCurrentEpisode,
    currentEpisode,
    currentSeason,
    generateEpisodesList,
  };
};
