'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { updateConfig } from '../store/configSlice'; // Importa la acción
import styles from '../form.module.css'; // Importa los estilos
import React from 'react'; // Asegúrate de importar React

const TabForms = React.memo(({ direccionForm, activeSection, initialTab }) => {
  const dispatch = useDispatch();
  const [tabs, setTabs] = useState({});
  const [activeTab, setActiveTab] = useState('');
  const [formData, setFormData] = useState({});
  // old
  // console.log("formKey:", formKey) //nombre del tab
  // console.log("value:", value) //valor
  // console.log("formData:", formData) //contenido del tab
  // console.log("data:", data) //contenido del tab

  // new
  // console.log("c:", activeTab) //nombre del tab
  // console.log("name:", name)
  // console.log("newValue:", newValue) //valor
  // console.log(data) //contenido del tab
  useEffect(() => {
    if (direccionForm && activeSection) {
      const sectionData = direccionForm[activeSection];
      const newTabs = {};
      const basicTabContent = {};

      // Organizar los datos en tabs principales
      Object.entries(sectionData).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          newTabs[key] = value; // Agregar como tab si es objeto
        } else {
          basicTabContent[key] = value; // Agrupar en "Básico"
        }
      });

      // Agregar tab "Básico" solo si tiene contenido
      if (Object.keys(basicTabContent).length > 0) {
        newTabs['Básico'] = basicTabContent;
      }

      setTabs(newTabs);
      // Establecer el primer tab activo si no se ha proporcionado initialTab
      setActiveTab(initialTab || Object.keys(newTabs)[0] || '');
    }
  }, [direccionForm, activeSection, initialTab]);

  useEffect(() => {
    if (direccionForm[activeSection] && activeTab) {
      const initialData = {};
      Object.entries(direccionForm[activeSection][activeTab] || {}).forEach(([key, value]) => {
        initialData[key] = value;
      });
      setFormData(initialData);
    }
  }, [direccionForm, activeSection, activeTab]);

  const handleChange = useCallback((e) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    
    console.log("activeSection:", activeSection)
    console.log("activeTab:", activeTab)
    console.log("tabcontent:", direccionForm[activeSection][activeTab])
    console.log("name:", name)
    console.log("newValue:", newValue)

    dispatch(updateConfig({ key: name, value: newValue }));
  }, [dispatch, activeTab]);

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
      <ul className="tabs">
        {Object.keys(tabs).map((tab) => (
          <li
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </li>
        ))}
      </ul>

      {/* Renderizado del contenido del tab activo */}
      <div>
        {tabs[activeTab] && (
          <div className={styles.mapItems}>
            {Object.entries(tabs[activeTab]).map(([field, value]) => (
              <div key={field} className={`form-group`}>
                <label>{field}</label>
                {typeof value === 'object' && value !== null ? (
                  <TabForms direccionForm={{ [field]: value }} activeSection={field} initialTab={Object.keys(value)[0]} />
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
        )}
      </div>
    </div>
  );
});

export default TabForms;
