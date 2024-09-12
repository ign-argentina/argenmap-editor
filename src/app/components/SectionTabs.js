'use client';

import { useState, useEffect } from 'react';
import FormContent from './FormContent';

export default function SectionTabs({ sectionData, activeSection, initialTab }) {
  const [activeTab, setActiveTab] = useState('');
  const [tabs, setTabs] = useState({});
  const [combinedData, setCombinedData] = useState({});

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

      // Crear el nuevo objeto combinado
      setCombinedData({
        sectionName: activeSection,  // Nombre de la sección
        sectionContent: sectionData, // Contenido de la sección
      });

      // console.log("sectionData: ", sectionData)
      // console.log("activeSection: ", activeSection)
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
      {tabs[activeTab] && 
      <FormContent 
        content={tabs[activeTab]}
        combinedData={combinedData}
      />}
    </div>
  );
}
