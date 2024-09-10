// 'use client';
// import { useState, useEffect } from 'react';
// import usePreferences from '../hooks/usePreferences';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// export default function Navbar({ setActiveGroup }) {
//   const [formVisible, setFormVisible] = useState(true);
//   const { preferences, loading: preferencesLoading, error: preferencesError } = usePreferences();
//   const [sections, setSections] = useState([]);
  
//   // Define las secciones que no quieres mostrar
//   const excludedSections = ['version']; // Aquí puedes agregar otras secciones que quieras excluir

//   useEffect(() => {
//     if (preferences) {
//       // Extrae las claves principales del objeto preferences (app, map, about, etc.)
//       const mainSections = Object.keys(preferences)
//         .filter((section) => !excludedSections.includes(section)); // Filtra las secciones excluidas
//       setSections(mainSections);
//     }
//   }, [preferences]);

//   const handleButtonClick = (section) => {
//     setActiveGroup(section); // Cambia el grupo activo
//   };

//   const toggleFormDisplay = () => {
//     setFormVisible(!formVisible);
//     const formContainer = document.querySelector('.form-container');
//     if (formContainer) {
//       formContainer.style.display = formVisible ? 'none' : 'grid';
//     }
//   };

//   if (preferencesLoading) return <p>Loading...</p>;
//   if (preferencesError) return <p>Error loading preferences</p>;

//   return (
//     <nav className="navbar">
//       <img src="/path-to-your-logo.png" alt="Logo" className="logo" />
//       <button
//         className={`navbar-display-button ${formVisible ? 'fa-solid fa-arrow-left' : 'fa-solid fa-arrow-right'}`}
//         onClick={toggleFormDisplay}
//       />
//       <ul>
//         {sections.map((section) => (
//           <li key={section}>
//             <button
//               className="navbar-button"
//               onClick={() => handleButtonClick(section)}
//             >
//               {section.charAt(0).toUpperCase() + section.slice(1)} {/* Capitaliza la primera letra */}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// }


'use client';
'use client';
import { useState, useEffect } from 'react';
import usePreferences from '../hooks/usePreferences';
import FormContainer from './FormContainer';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Navbar({ setActiveGroup }) {
  const [formVisible, setFormVisible] = useState(true);
  const { preferences, loading: preferencesLoading, error: preferencesError } = usePreferences();
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null); // Estado para la sección activa

  const excludedSections = ['excludedSection']; // Excluir las secciones que no quieras mostrar

  useEffect(() => {
    if (preferences) {
      const mainSections = Object.keys(preferences)
        .filter((section) => !excludedSections.includes(section));
      setSections(mainSections);
    }
  }, [preferences]);

  const handleButtonClick = (section) => {
    setActiveSection(section); // Cambia la sección activa
  };

  const toggleFormDisplay = () => {
    setFormVisible(!formVisible);
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
      formContainer.style.display = formVisible ? 'none' : 'grid';
    }
  };

  if (preferencesLoading) return <p>Loading...</p>;
  if (preferencesError) return <p>Error loading preferences</p>;

  return (
    <div className="navbar-section">
      <nav className="navbar">
        <img src="/path-to-your-logo.png" alt="Logo" className="logo" />
        <button
          className={`navbar-display-button ${formVisible ? 'fa-solid fa-arrow-left' : 'fa-solid fa-arrow-right'}`}
          onClick={toggleFormDisplay}
        />
        <ul>
          {sections.map((section) => (
            <li key={section}>
              <button
                className="navbar-button"
                onClick={() => handleButtonClick(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {activeSection && (
        <FormContainer 
          activeSection={activeSection} 
          sectionData={preferences[activeSection]} 
        />
      )}
    </div>
  );
}
