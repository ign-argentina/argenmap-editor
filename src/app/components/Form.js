import FormExample, { formName as nameFormExample } from './FormExample';
import FormDatos, { formName as nameFormDatos } from './FormDatos';

const formComponents = [
  { component: FormExample, name: nameFormExample },
  { component: FormDatos, name: nameFormDatos },

];

export default function Form({ formData, onFormChange, activeTab, preferences }) {
  const forms = formComponents.map(({ component: FormComponent }) => (
    <FormComponent formData={formData} onFormChange={onFormChange} preferences={preferences} />
  ));

  return (
    <form>
      {forms[activeTab]}
    </form>
  );
}

export { formComponents };