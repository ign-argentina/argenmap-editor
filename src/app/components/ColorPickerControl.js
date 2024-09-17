// ColorPickerControl.js
import React from 'react';
import { ColorButton  } from 'material-ui-color';
import { withJsonFormsControlProps } from '@jsonforms/react';

const ColorPickerControl = ({ data, handleChange }) => {
  const handleColorChange = (color) => {
    handleChange(color.hex);
  };

  return (
    <ColorButton 
      value={data}
      onChange={handleColorChange}
    />
  );
};

export default withJsonFormsControlProps(ColorPickerControl);
