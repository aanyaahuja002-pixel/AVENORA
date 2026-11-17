"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "avenora_favorites";
const FAVORITES_EVENT = "avenora_favorites_updated";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsLoaded(true);
    }

    // Listen to changes from other components/tabs
    const handleSync = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        } else {
          setFavorites([]);
        }
      } catch {
        // Ignore
      }
    };

    window.addEventListener(FAVORITES_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const exists = prev.includes(id);
        const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          window.dispatchEvent(new Event(FAVORITES_EVENT));
        } catch {
          // Ignore
        }
        return next;
      });
    },
    []
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    favoritesCount: favorites.length,
    isLoaded,
  };
}
