import { useEffect, useState } from 'react';
import { FavoriteList } from '../types/FavoriteList';
import { useFavorite } from './useFavorite';

export const useSeriesControls = (favoriteData: FavoriteList.RootObject) => {
  const [currentSeason, setCurrentSeason] = useState(favoriteData.trackingData.seriesInfo.currentSeason);
  const [currentEpisode, setCurrentEpisode] = useState(favoriteData.trackingData.seriesInfo.currentEpisode);
  const { updateFavoriteItem } = useFavorite();

  const updateSeries = () => {
    if (
      favoriteData.trackingData.seriesInfo.currentSeason === currentSeason &&
      favoriteData.trackingData.seriesInfo.currentEpisode === currentEpisode
    ) {
      return;
    }

    updateFavoriteItem(favoriteData.id, {
      ...favoriteData.trackingData,
      seriesInfo: {
        currentEpisode,
        currentSeason,
      },
    });
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
