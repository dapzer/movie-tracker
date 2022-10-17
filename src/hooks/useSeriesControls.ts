import { LocalStorageMovie } from '../types/LocalStorageMovie';
import { useEffect, useState } from 'react';
import { Details } from '../types/Details';

export const useSeriesControls = (id: number, seasons: Details.Season[]) => {
  const localData = JSON.parse(localStorage.getItem(id.toString()) || '');
  const [currentSeason, setCurrentSeason] = useState(localData.seriesInfo.currentSeason);
  const [currentEpisode, setCurrentEpisode] = useState(localData.seriesInfo.currentEpisode);

  const updateSeries = () => {
    localData.seriesInfo.currentSeason = currentSeason;
    localData.seriesInfo.currentEpisode = currentEpisode;

    localStorage.setItem(localData.id.toString(), JSON.stringify(localData));
  };

  const generateEpisodesList = (totalCount: number) => {
    const episodes: number[] = [];

    for (let i = 1; i <= totalCount; i++) {
      episodes.push(i);
    }

    return episodes;
  };

  const handleSeason = (season?: string) => {
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
