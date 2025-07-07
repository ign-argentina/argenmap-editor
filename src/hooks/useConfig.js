/* import { useState, useEffect } from 'react';

const useConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('../config/config.json');
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

export default useConfig; */


import { useState, useEffect } from 'react';
import confi from '../config/config.json';

const useConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Simular delay para "loading"
      setTimeout(() => {
        setConfig(confi);
        setLoading(false);
      }, 200); // 100ms delay
    } catch (err) {
      setError('Error loading config');
      setLoading(false);
    }
  }, []);

  return { config, loading, error };
};

export default useConfig;
