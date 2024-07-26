import React from 'react';

export const formName = "ThemeForm";

export default function ThemeForm({ formData, onChange, preferences }) {
  const handleChangeTheme = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  //Formulario
  return (
    <div>
      <label>
        Body Background:
        <input type="text" name="theme.bodyBackground" value={formData.theme.bodyBackground || ''} onChange={handleChangeTheme} />
      </label>
    </div>

  );
}
