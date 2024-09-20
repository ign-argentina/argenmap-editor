import React, { useState } from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';

const MaterialInputControl = ({ handleChange, data, path, label }) => {
  const [currentColor, setCurrentColor] = useState(data || '#ffffff');

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setCurrentColor(newColor);
    handleChange(path, newColor);
  };

  return (
    <div>
      <label className='color-picker-label'>{label}</label>
      <input
        type="color"
        value={currentColor}
        onChange={handleColorChange}
        style={{
          width: '100%',
          height: '40px',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};

const ColorPickerControl = (props) => {
  const { handleChange, data, path, label } = props;
  return <MaterialInputControl handleChange={handleChange} data={data} path={path} label={label} />;
};

export default withJsonFormsControlProps(ColorPickerControl);
