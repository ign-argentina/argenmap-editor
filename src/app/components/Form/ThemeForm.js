import React from 'react';

export const formName = "ThemeForm";

export default function ThemeForm({ formData, onChange, preferences }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div>
      {Object.keys(preferences.theme).map((key) => (
        <div key={key}>
          <label>
            {key}:
            <input
              type="text"
              name={`theme.${key}`}
              value={formData.theme[key]}
              onChange={handleChange}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
