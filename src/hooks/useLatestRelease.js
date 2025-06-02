import { useEffect, useState } from "react";
import axios from "axios";

const STORAGE_KEY = "cachedRelease";
const CACHE_TTL = 60 * 60 * 1000; // 1 hora

export function useLatestRelease() {
  const [release, setRelease] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRelease() {
      const cached = localStorage.getItem(STORAGE_KEY);
      const cachedTime = localStorage.getItem(STORAGE_KEY + "_time");

      const isFresh = cached && cachedTime && Date.now() - cachedTime < CACHE_TTL;

      if (isFresh) {
        setRelease(JSON.parse(cached));
        return;
      }

      try {
        const response = await axios.get(
          "https://api.github.com/repos/ign-argentina/argenmap-editor/releases/latest"
        );
        setRelease(response.data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
        localStorage.setItem(STORAGE_KEY + "_time", Date.now().toString());
      } catch (err) {
        setError("Error obteniendo la última release");
        console.error(err);
      }
    }

    fetchRelease();
  }, []);

  return { release, error };
}
