import React from 'react';
import GenericForm from './GenericForm';

const Theme = ({ data }) => {
  const fieldsToShow = {
    bodyBackground: 'Color de Fondo del Body',
    headerBackground: 'Color de Fondo del Header',
    menuBackground: 'Color de Fondo de Menú',
    activeLayer: 'Capa Activa',
    textMenu: 'Color de Texto del Menú',
    textLegendMenu: 'Leyenda del Menú',
    iconBar: 'Icono de la Barra'
  };

  return (
    <GenericForm
      formKey="theme"
      data={data}
      fieldsToShow={fieldsToShow}
      colorFields={['bodyBackground', 'headerBackground', 'menuBackground', 'activeLayer', 'textMenu', 'textLegendMenu', 'iconBar']}
    />
  );
};

export default Theme;
