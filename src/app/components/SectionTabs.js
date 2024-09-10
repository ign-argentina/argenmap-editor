'use client';

import { useState } from 'react';

export default function SectionTabs({ sectionData }) {
  const [activeTab, setActiveTab] = useState(Object.keys(sectionData)[0] || ''); // Tab activo por defecto

  if (!sectionData) {
    return <p>No data available for this section.</p>;
  }

  return (
    <div className="section-tabs">
      {/* Renderizado de tabs */}
      <ul className="tabs">
        {Object.keys(sectionData).map((tab) => (
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
      <div className="tab-content">
        {sectionData[activeTab] && Object.entries(sectionData[activeTab]).map(([field, value]) => (
          <div key={field} className="form-group">
            <label>{field}</label>
            <input type="text" value={value} readOnly />
          </div>
        ))}
      </div>
    </div>
  );
}
