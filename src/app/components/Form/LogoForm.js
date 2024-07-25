import React from 'react';

export const formName = "LogoForm";

export default function LogoForm({ formData, onChange, preferences }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div>
      {Object.keys(preferences.logo).map((key) => (
        <div key={key}>
          <label>
            {key}:
            <input
              type="text"
              name={`logo.${key}`}
              value={formData.theme[key]}
              onChange={handleChange}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
