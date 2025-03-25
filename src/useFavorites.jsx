import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (ad) => {
    setFavorites(prev => [...prev, ad]);
  };

  const removeFromFavorites = (adId) => {
    setFavorites(prev => prev.filter(fav => fav._id !== adId));
  };

  return { favorites, addToFavorites, removeFromFavorites };
};