import React from 'react';

export const formName = "ExampleForm";

export default function ExampleForm({ formData, onChange, preferences }) {
  const handleChangeTheme = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  //Formulario
  return (
    <div>
      <label>
        Body Background:
        <input type="text" name="example" value={formData.example || ''} onChange={handleChangeTheme} />
      </label>
    </div>

  );
}