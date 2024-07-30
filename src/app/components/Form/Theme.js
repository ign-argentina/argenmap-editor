import React, { useState, useEffect } from 'react';

const Theme = ({ data }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  useEffect(() => {
    // Cargar datos del localStorage si existen
    const savedData = JSON.parse(localStorage.getItem('theme')) || {};
    setFormData((prevData) => ({
      ...prevData,
      ...savedData,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      localStorage.setItem('theme', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  return (
    <form>
      {Object.keys(formData).map((key) => (
        <div key={key}>
          <label>
            {key.charAt(0).toUpperCase() + key.slice(1)}:
            <input
              type="text"
              name={key}
              value={formData[key] || ''}  // Asegura que el valor sea del estado
              placeholder={key}
              onChange={handleChange}
            />
          </label>
        </div>
      ))}
    </form>
  );
};

export default Theme;
