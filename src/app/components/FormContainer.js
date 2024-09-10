'use client';
import SectionTabs from './SectionTabs';

export default function FormContainer({ activeSection, sectionData }) {
  if (!activeSection || !sectionData) {
    return <p>No section selected or no data available.</p>;
  }

  return (
    <div className="form-container">
      <SectionTabs sectionData={sectionData} />
    </div>
  );
}
