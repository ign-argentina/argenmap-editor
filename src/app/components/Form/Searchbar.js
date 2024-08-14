import React from 'react';
import GenericForm from './GenericForm';

const Searchbar = ({ data }) => {
  const fieldsToShow = {
    isActive: 'Visibilidad',
    color_focus: 'Color de Foco',
    background_color: 'Color de Fondo',
  };

  return (
    <GenericForm
      formKey="searchbar"
      data={data}
      fieldsToShow={fieldsToShow}
      colorFields={['color_focus', 'background_color']}
    />
  );
};

export default Searchbar;
