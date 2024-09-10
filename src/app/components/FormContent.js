'use client';

import { useState, useEffect } from 'react';

// Componente para mostrar un formulario para los datos en un tab
export default function FormContent({ content, level = 0 }) {
  const getInputType = (value) => {
    if (typeof value === 'boolean') return 'checkbox';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') {
      if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) return 'color'; // Color
      if (/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)) return 'url'; // URL
    }
    return 'text'; // Por defecto texto
  };

  return (
    <div className={`form-content level-${level}`}>
      {Array.isArray(content) ? (
        content.map((item, index) => (
          <div key={index} className={`array-item level-${level}`}>
            <h4>Item {index + 1}</h4>
            {/* Renderizar cada elemento del array */}
            {typeof item === 'object' && item !== null ? (
              <FormContent content={item} level={level + 1} />
            ) : (
              <div className={`form-group level-${level}`}>
                <label>Item {index + 1}</label>
                <input
                  type={getInputType(item)}
                  value={item}
                  readOnly
                />
              </div>
            )}
          </div>
        ))
      ) : (
        Object.entries(content).map(([field, value]) => (
          <div key={field} className={`form-group level-${level}`}>
            <label>{field}</label>
            {typeof value === 'object' && value !== null && !Array.isArray(value) ? (
              <FormContent content={value} level={level + 1} /> // Mostrar contenido del objeto como formulario
            ) : (
              <input
                type={getInputType(value)}
                value={value}
                readOnly
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
