import { useEffect, useState } from 'react';

export const useFavorite = (id: number, mediaType: string) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const addToFavorite = () => {
    localStorage.setItem(
      id.toString(),
      JSON.stringify({
        id,
        mediaType: mediaType,
        addedDate: Date.now(),
        seriesInfo: {
          currentEpisode: 1,
          currentSeason: 0,
        },
      })
    );
    setIsFavorite(true);
  };

  const removeToFavorite = () => {
    localStorage.removeItem(id.toString());
    setIsFavorite(false);
  };

  const handleFavorite = () => {
    if (isFavorite) {
      removeToFavorite();
    } else {
      addToFavorite();
    }
  };

  const checkOnFavorite = () => {
    return localStorage.getItem(id.toString()) !== null;
  };

  useEffect(() => {
    setIsFavorite(checkOnFavorite());
  }, []);

  return {
    addToFavorite,
    removeToFavorite,
    handleFavorite,
    isFavorite,
    checkOnFavorite,
  };
};
