import { useState, useEffect } from 'react';

const useLang = () => {
  const [language, setLang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLang = async () => {
      try {
        const response = await fetch('/argenmap/src/config/default/language.json');
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

  return { language, loading, error };
};

export default useLang;
