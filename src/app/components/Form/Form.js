import React from 'react';
import FormExample, { formName as nameFormExample } from './FormExample';
import Theme, { formName as nameFormTheme } from './Theme';

const formComponents = [
  { component: Theme, name: nameFormTheme },
  { component: FormExample, name: nameFormExample },
];

export default function Form({ formData, onFormChange, activeTab, preferences }) {
  const FormComponent = formComponents[activeTab].component;

  const handleChange = (name, value) => {
    const keys = name.split('.');
    const updatedFormData = { ...formData };

    if (keys.length === 2) {
      updatedFormData[keys[0]][keys[1]] = value;
    } else {
      updatedFormData[name] = value;
    }

    onFormChange(updatedFormData);
  };

  return (
    <form>
      <FormComponent formData={formData} onChange={handleChange} preferences={preferences} />
    </form>
  );
}

export { formComponents };