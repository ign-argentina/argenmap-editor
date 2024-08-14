import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePreferences } from '../../store/preferencesSlice';
import styles from '../../form.module.css';

const GenericForm = ({ formKey, data, fieldsToShow, colorFields = [], urlFields = [] }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.preferences[formKey] || data);

  useEffect(() => {
    if (data) {
      dispatch(updatePreferences({ key: formKey, value: data }));
    }
  }, [data, dispatch, formKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updatePreferences({ key: formKey, value: { ...formData, [name]: value } }));
  };

  const renderInputField = (key) => {
    if (colorFields.includes(key)) {
      return (
        <input
          type="color"
          name={key}
          value={formData[key] || '#000000'}
          onChange={handleChange}
          className={styles.txtInput}
        />
      );
    } else if (urlFields.includes(key)) {
      return (
        <input
          type="url"
          name={key}
          value={formData[key] || ''}
          placeholder={key}
          onChange={handleChange}
          className={styles.txtInput}
        />
      );
    } else {
      return (
        <input
          type="text"
          name={key}
          value={formData[key] || ''}
          placeholder={key}
          onChange={handleChange}
          className={styles.txtInput}
        />
      );
    }
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.mapItems}>
        {formData && Object.keys(fieldsToShow).map((key) => (
          <div key={key}>
            <label>
              {fieldsToShow[key]}:
              {renderInputField(key)}
            </label>
          </div>
        ))}
      </form>
    </div>
  );
};

export default GenericForm;
