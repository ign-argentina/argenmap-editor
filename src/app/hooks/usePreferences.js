import { useState, useEffect } from 'react';

const usePreferences = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Lógica para cargar el preferences por defecto
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/argenmap/src/config/default/config.json');
        const data = await response.json();
        setPreferences(data);
      } catch (error) {
        setError('Error loading preferences');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  return { preferences, loading, error };
};

export default usePreferences;
