'use client';
import { useEffect, useState } from 'react';

export default function Navbar({ setActiveGroup, preferences }) {
  const [sections, setSections] = useState([]);
  const [version, setVersion] = useState('');

  useEffect(() => {
    if (preferences) {
      // Filtrar las secciones para incluir solo aquellas que son objetos
      const filteredSections = Object.entries(preferences)
        .filter(([key, value]) => typeof value === 'object' && value !== null)
        .map(([key]) => key);
      
      setSections(filteredSections);

      // Obtener la versión si está disponible
      const versionInfo = preferences.version || 'No disponible';
      setVersion(versionInfo);
    }
  }, [preferences]);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="/logos/logo.png" alt="Logo" className="logo" />
      </div>
      <div className="version-info">
        <label>Versión: {version}</label>
      </div>
      <ul>
        {sections.map((section) => (
          <li key={section}>
            <button
              className="navbar-button"
              onClick={() => setActiveGroup(section)} // Cambia la sección activa
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
