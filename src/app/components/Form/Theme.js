import React, { useState, useEffect } from 'react';

const Theme = ({ data, updatePreferences }) => {
  const [formData, setFormData] = useState({});

  // Cargar los datos al formulario
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // Cargar datos del localStorage si existen
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('theme')) || {};
    setFormData((prevData) => ({
      ...prevData,
      ...savedData,
    }));
  }, []);

  // Edita el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      localStorage.setItem('theme', JSON.stringify(updatedData));
      updatePreferences('theme', updatedData); // Actualizar preferencesNew
      return updatedData;
    });
  };

  return (
    <form>
      {formData && Object.keys(formData).map((key) => (
        <div key={key}>
          <label>
            {key.charAt(0).toUpperCase() + key.slice(1)}:
            <input
              type="text"
              name={key}
              value={formData[key] || ''}
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
