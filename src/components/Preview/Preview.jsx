import React from 'react';

const Preview = () => {

  return (
    <iframe
         src="/argenmap/index.html"
      /* src="https://mapa.ign.gob.ar/beta/" */
      title="Argenmap Visor"
      width="100%"
      height="100%"
      style={{ border: 'none' }}
    ></iframe>
  );
};

export default Preview;