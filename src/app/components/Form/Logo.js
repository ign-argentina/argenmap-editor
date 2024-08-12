import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePreferences } from '../../store/preferencesSlice';
import styles from '../../form.module.css'

const Logo = ({ data }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.preferences.logo || data);

  // Lista de claves para mostrar en el formulario y sus nombres personalizados
  const fieldsToShow = {
    title: 'Titulo',
    src: 'Source',
    link: 'Link',
  };

  useEffect(() => {
    if (data) {
      dispatch(updatePreferences({ key: 'logo', value: data }));
    }
  }, [data, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updatePreferences({ key: 'logo', value: { ...formData, [name]: value } }));
  };

  //Listar elementos que son colores
  const isColorField = (key) => {
    const colorKeys = [];
    return colorKeys.includes(key);
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.mapItems}>
        {formData && Object.keys(fieldsToShow).map((key) => (
          <div key={key}>
            <label>
              {fieldsToShow[key]}:
              {isColorField(key) ? (
                <input
                  type="color"
                  name={key}
                  value={formData[key] || '#000000'}
                  onChange={handleChange}
                  className={styles.txtInput}
                />
              ) : (
                <input
                  type="text"
                  name={key}
                  value={formData[key] || ''}
                  placeholder={key}
                  onChange={handleChange}
                  className={styles.txtInput}
                />
              )}
            </label>
          </div>
        ))}
      </form>
    </div>
  );
};

export default Logo;
