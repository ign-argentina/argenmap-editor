import React from 'react';
import ThemeForm, { formName as nameFormTheme } from './ThemeForm';
import ExampleForm, { formName as nameFormLogo } from './ExampleForm';

const formComponents = [
  { component: ThemeForm, name: nameFormTheme },
  { component: ExampleForm, name: nameFormLogo },
];

export default function Form({ formData, onFormChange, activeTab, preferences }) {
  const FormComponent = formComponents[activeTab].component;

  const handleChangeForm = (name, value) => {
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
      <FormComponent formData={formData} onChange={handleChangeForm} preferences={preferences} />
    </form>
  );
}

export { formComponents };