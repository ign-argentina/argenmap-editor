import React, { useState } from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';

const MaterialInputControl = ({ handleChange, data, path }) => {
  const [currentColor, setCurrentColor] = useState(data || '#ffffff');

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setCurrentColor(newColor);
    handleChange(path, newColor);
  };

  return (
    <div>
      <label>{path}</label>
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
  const { handleChange, data, path } = props;
  return <MaterialInputControl handleChange={handleChange} data={data} path={path} />;
};

export default withJsonFormsControlProps(ColorPickerControl);
