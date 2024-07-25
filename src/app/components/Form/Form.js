import FormExample, { formName as nameFormExample } from './FormExample';
import Theme, { formName as nameFormTheme } from './Theme';

const formComponents = [
  { component: FormExample, name: nameFormExample },
  { component: Theme, name: nameFormTheme },
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