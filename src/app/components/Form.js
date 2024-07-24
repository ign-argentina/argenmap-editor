import FormTitle from './FormTitle';
import FormDatos from './FormDatos';
// import FormAnotherField from './FormAnotherField';
// import FormFourthField from './FormFourthField';

export default function Form({ formData, onFormChange, activeTab, preferences }) {
  const forms = [
    <FormTitle formData={formData} onFormChange={onFormChange} preferences={preferences} />,
    <FormDatos formData={formData} onFormChange={onFormChange} preferences={preferences} />,
    // <FormAnotherField formData={formData} onFormChange={onFormChange} preferences={preferences} />,
    // <FormFourthField formData={formData} onFormChange={onFormChange} preferences={preferences} />
  ];

  return (
    <form>
      {forms[activeTab]}
    </form>
  );
}
