import { useState, useEffect } from "react";

const useData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Lógica para cargar el config de datos por defecto
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/argenmap/src/config/default/data.json");
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useData;
