import React, { useState } from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { SketchPicker } from 'react-color'; 

const MaterialInputControl = ({ handleChange, data, path }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false); // Controla la visibilidad del picker
  const [currentColor, setCurrentColor] = useState(data || '#ffffff'); // Estado para el color actual

  // Manejador para abrir/cerrar el color picker
  const handleButtonClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  // Manejador para actualizar el color
  const handleColorChange = (color) => {
    setCurrentColor(color.hex);
    handleChange(path, color.hex); // Actualiza el color en JsonForms
  };

  return (
    <div>
      {/* Botón que muestra el color actual */}
      <button
        style={{
          backgroundColor: currentColor,
          width: '36px',
          height: '36px',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
        onClick={handleButtonClick}
      />
      
      {/* Muestra el SketchPicker si displayColorPicker es true */}
      {displayColorPicker && (
        <div style={{ position: 'absolute', zIndex: 2 }}>
          <div
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
            onClick={() => setDisplayColorPicker(false)} // Cierra el picker si se hace clic fuera
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
