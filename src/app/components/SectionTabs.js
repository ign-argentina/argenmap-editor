'use client';

import { useState, useEffect } from 'react';

// Componente para mostrar un formulario para los datos en un tab
function FormContent({ content, level = 0 }) {
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
                <input type="text" value={item} readOnly />
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
              <input type="text" value={value} readOnly />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default function SectionTabs({ sectionData, initialTab }) {
  const [activeTab, setActiveTab] = useState('');
  const [tabs, setTabs] = useState({});

  useEffect(() => {
    if (sectionData) {
      const newTabs = {};
      const basicTabContent = {};

      // Organizar los datos en tabs principales
      Object.entries(sectionData).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          newTabs[key] = value; // Agregar como tab si es objeto
        } else {
          basicTabContent[key] = value; // Agrupar en "básico"
        }
      });

      // Agregar tab "básico" solo si tiene contenido
      if (Object.keys(basicTabContent).length > 0) {
        newTabs['básico'] = basicTabContent;
      }

      setTabs(newTabs);
      // Establecer el primer tab activo si no se ha proporcionado initialTab
      setActiveTab(initialTab || Object.keys(newTabs)[0] || '');
    }
  }, [sectionData, initialTab]);

  if (!sectionData) {
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
      {tabs[activeTab] && <FormContent content={tabs[activeTab]} />}
    </div>
  );
}
