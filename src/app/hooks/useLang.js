import { useState, useEffect } from 'react';

const useLang = () => {
  const [lang, setLang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLang = async () => {
      try {
        const response = await fetch('/argenmap/src/config/default/langTest.json');
        const data = await response.json();
        setLang(data);
      } catch (error) {
        setError('Error loading languages');
      } finally {
        setLoading(false);
      }
    };

    fetchLang();
  }, []);

  return { lang, loading, error };
};

export default useLang;
