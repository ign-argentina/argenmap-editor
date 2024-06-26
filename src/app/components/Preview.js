// OLD Preview
// export default function Preview({ formData }) {
//     return (
//       <div>
//         <h3>{formData.title}</h3>
//         <p>{formData.description}</p>
//         <p>{formData.anotherField}</p>
//         <p>{formData.fourthField}</p>
//       </div>
//     );
//   }s

import React from 'react';

const Preview = () => {
  return (
    <iframe
      src="/argenmap/index.html"
      title="Argenmap Visor"
      width="100%"
      height="100%"
      style={{ border: 'insert' }}
    ></iframe>
  );
};

export default Preview;
