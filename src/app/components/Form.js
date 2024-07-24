import FormExample from './FormExample';
import FormDatos from './FormDatos';
// import FormAnotherField from './FormAnotherField';

export default function Form({ formData, onFormChange, activeTab, preferences }) {
  const forms = [
    <FormExample formData={formData} onFormChange={onFormChange} preferences={preferences} />,
    <FormDatos formData={formData} onFormChange={onFormChange} preferences={preferences} />,
    // <FormAnotherField formData={formData} onFormChange={onFormChange} preferences={preferences} />,
  ];

  return (
    <form>
      {forms[activeTab]}
    </form>
  );
}
