import { useState, useEffect } from 'react';

const useConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Lógica para cargar el config por defecto
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/argenmap/src/config/default/test.json');
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        setError('Error loading config');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
};

export default useConfig;
