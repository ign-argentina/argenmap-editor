import React from 'react';
import GenericForm from './GenericForm';

const Geoprocessing = ({ data }) => {
  const fieldsToShow = {
    isActive: 'Visibilidad',
    buttonTitle: 'Titulo del Boton',
    buttonIcon: 'Icono del Boton',
    dialogTitle: 'Dialogo del Titulo',
  };

  return (
    <GenericForm
      formKey="geoprocessing"
      data={data}
      fieldsToShow={fieldsToShow}
      checkBoxFields={['isActive']}
    />
  );
};

export default Geoprocessing;
