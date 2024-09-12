'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateConfig } from '../store/configSlice'; // Importa la acción
import styles from '../form.module.css'; // Importa los estilos

export default function TabForms({ direccionForm, activeSection, initialTab }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (direccionForm && activeSection) {
      setActiveTab(initialTab || Object.keys(direccionForm[activeSection])[0] || '');
    }
  }, [direccionForm, activeSection, initialTab]);

  useEffect(() => {
    if (direccionForm[activeSection]) {
      const initialData = {};
      Object.entries(direccionForm[activeSection][activeTab] || {}).forEach(([key, value]) => {
        initialData[key] = value;
      });
      setFormData(initialData);
    }
    console.log("direccionForm:", direccionForm)
  }, [direccionForm, activeSection, activeTab]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    dispatch(updateConfig({ key: name, value: newValue }));
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

  if (!direccionForm[activeSection]) {
    return <p>No data available for this section.</p>;
  }

  return (
    <div>
      {/* Renderizado de tabs principales */}
      {/* <ul className="tabs">
        {Object.keys(direccionForm[activeSection]).map((tab) => (
          <li
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </li>
        ))}
      </ul> */}

      {/* Renderizado del contenido del tab activo */}
      {/* {direccionForm[activeSection][activeTab] && (
        <div className={styles.mapItems}>
          {Object.entries(direccionForm[activeSection][activeTab]).map(([field, value]) => (
            <div key={field} className={`form-group level-0`}>
              <label>{field}</label>
              {typeof value === 'object' && value !== null ? (
                // Si es un objeto, renderizar el TabForms de forma recursiva
                <TabForms sectionData={value} activeSection={activeTab} />
              ) : (
                // Si no es un objeto, renderizar el input correspondiente
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
      )} */}
    </div>
  );
}
