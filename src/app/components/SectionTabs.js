'use client';
import { useState, useEffect } from 'react';
import GenericForm from './GenericForm'; // Importa el nuevo componente

export default function SectionTabs({ sectionData }) {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (sectionData && Object.keys(sectionData).length > 0) {
      // Reinicia el tab activo al cambiar de sección
      setActiveTab(Object.keys(sectionData)[0]);
    }
  }, [sectionData]); // Cada vez que cambia la sección, reinicia el tab activo

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Verifica si no hay datos disponibles para esta sección
  if (!sectionData || Object.keys(sectionData).length === 0) {
    return <p>No data available for this section.</p>;
  }

  // Verifica que el activeTab tenga datos asociados en sectionData
  const activeTabData = sectionData[activeTab];
  
  if (!activeTabData || typeof activeTabData !== 'object') {
    return <p>No data available for this tab.</p>;
  }

  return (
    <div className="section-tabs">
      <div className="tabs">
        {Object.keys(sectionData).map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="form-content">
        {activeTab && <GenericForm formData={activeTabData} />}
      </div>
    </div>
  );
}
