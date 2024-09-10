'use client';
import { useEffect, useState } from 'react';

export default function Navbar({ setActiveGroup }) {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // Aquí simulamos la carga de las secciones, puedes reemplazar esto con datos reales si es necesario
    setSections(['app', 'about', 'map', 'ui']);
  }, []);

  return (
    <nav className="navbar">
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
