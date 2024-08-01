import React, { useState, useEffect } from 'react';

const Logo = ({ data, updatePreferences }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  useEffect(() => {
    // Cargar datos del localStorage si existen
    const savedData = JSON.parse(localStorage.getItem('logo')) || {};
    setFormData((prevData) => ({
      ...prevData,
      ...savedData,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      localStorage.setItem('logo', JSON.stringify(updatedData));
      updatePreferences('logo', updatedData); // Actualizar preferencesNew
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

export default Logo;
