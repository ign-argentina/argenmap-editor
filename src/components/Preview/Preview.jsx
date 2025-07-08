import React from 'react';

const Preview = ({ visorId = "123", tipo = "argenmap" }) => {
  const url = `http://localhost:4000/visor/${tipo}?id=${visorId}`;
  return (
    <iframe
      src={url}
      title={`Visor ${tipo}`}
      width="100%"
      height="100%"
      style={{ border: 'none' }}
    />
  );
};

export default Preview;