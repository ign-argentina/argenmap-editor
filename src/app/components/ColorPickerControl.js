import React, { useState } from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { SketchPicker } from 'react-color'; 

const MaterialInputControl = ({ handleChange, data, path }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState(data || '#ffffff');

  const handleButtonClick = () => {
    setDisplayColorPicker(!displayColorPicker);
    console.log(data, path)
  };

  const handleColorChange = (color) => {
    setCurrentColor(color.hex);
    handleChange(path, color.hex);
  };

  return (
    <div>
      <label>{path}</label>
      <button
        style={{
          backgroundColor: currentColor,
          width: '100%',
          height: '25px',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
        onClick={handleButtonClick}
      />
      
      {displayColorPicker && (
        <div style={{ position: 'absolute', zIndex: 2 }}>
          <div
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
            onClick={() => setDisplayColorPicker(false)}
          />
          <SketchPicker
            color={currentColor}
            onChangeComplete={handleColorChange}
          />
        </div>
      )}
    </div>
  );
};

const ColorPickerControl = (props) => {
  const { handleChange, data, path } = props;
  return <MaterialInputControl handleChange={handleChange} data={data} path={path} />;
};

export default withJsonFormsControlProps(ColorPickerControl);
