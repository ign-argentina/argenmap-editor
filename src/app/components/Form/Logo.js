import React from 'react';
import GenericForm from './GenericForm';

const Logo = ({ data }) => {
  const fieldsToShow = {
    title: 'Titulo',
    src: 'Source',
    link: 'Link',
  };

  return (
    <GenericForm
      formKey="logo"
      data={data}
      fieldsToShow={fieldsToShow}
      urlFields={['link']}
    />
  );
};

export default Logo;
