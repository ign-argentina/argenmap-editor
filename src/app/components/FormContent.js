'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateConfig } from '../store/configSlice'; // Asegúrate de tener esta acción en tu slice
import styles from '../form.module.css'; // Importa el archivo de estilos

export default function FormContent({ content, level = 0 }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (content) {
      const initialData = {};
      Object.entries(content).forEach(([key, value]) => {
        initialData[key] = value;
      });
      setFormData(initialData);
    }
  }, [content]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      };
      // Enviar la actualización de los datos al store solo después de actualizar el estado local
      dispatch(updateConfig({ key: name, value: updatedData[name] }));
      return updatedData;
    });
  };

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
    <div className={styles.mapItems}> {/* Aplica la clase de estilos */}
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
                  name={`item-${index}`}
                  value={typeof item === 'boolean' ? (item ? 'true' : 'false') : item}
                  placeholder={item}
                  onChange={handleChange}
                  className={styles.txtInput} // Aplica la clase de estilos
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
              <>
                {getInputType(value) === 'checkbox' ? (
                  <input
                    type="checkbox"
                    name={field}
                    checked={formData[field] || false}
                    onChange={handleChange}
                    className={styles.txtInput} // Aplica la clase de estilos
                  />
                ) : (
                  <input
                    type={getInputType(value)}
                    name={field}
                    value={typeof value === 'boolean' ? (value ? 'true' : 'false') : formData[field] || ''}
                    placeholder={value}
                    onChange={handleChange}
                    className={styles.txtInput} // Aplica la clase de estilos
                  />
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
