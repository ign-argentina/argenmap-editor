'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateConfig } from '../store/configSlice'; // Importa la acción
import styles from '../form.module.css'; // Importa los estilos

export default function FormContent({ content, level = 0 }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  // const formData = useSelector((state) => state.config[formKey] || data);

  useEffect(() => {
    if (content) {
      console.log("Content: ", content)
      const initialData = {};
      Object.entries(content).forEach(([key, value]) => {
        initialData[key] = value;
      });
      setFormData(initialData);
    }
  }, [content]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  
    console.log('Form data before dispatch:', formData);

    dispatch(updateConfig({ key: name, value: newValue }));
    // dispatch(updatePreferences({ key: formKey, value: { ...formData, [name]: newValue } }));

  };
  

  const getInputType = (value) => {
    if (typeof value === 'boolean') return 'checkbox';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') {
      if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) return 'color';
      if (/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)) return 'url'; 
    }
    return 'text';
  };

  return (
    <div className={styles.mapItems}>
      {Object.entries(content).map(([field, value]) => (
        <div key={field} className={`form-group level-${level}`}>
          <label>{field}</label>
          {typeof value === 'object' && value !== null ? (
            <FormContent content={value} level={level + 1} />
          ) : (
            <input
              type={getInputType(value)}
              name={field}
              value={formData[field] || ''}
              onChange={handleChange}
              className={styles.txtInput}
            />
          )}
        </div>
      ))}
    </div>
  );
}
