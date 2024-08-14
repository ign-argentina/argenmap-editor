import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePreferences } from '../../store/preferencesSlice';
import styles from '../../form.module.css'

const Searchbar = ({ data }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.preferences.searchbar || data);

  // Lista de claves para mostrar en el formulario y sus nombres personalizados
  const fieldsToShow = {
    isActive: 'Visiblidad',
    color_focus: 'Titulo del Boton',
    background_color: 'Dialogo del Titulo',
  };

  useEffect(() => {
    if (data) {
      dispatch(updatePreferences({ key: 'searchbar', value: data }));
    }
  }, [data, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updatePreferences({ key: 'searchbar', value: { ...formData, [name]: value } }));
  };

  //Listar elementos que son colores
  const isColorField = (key) => {
    const colorKeys = ['color_focus', 'background_color']
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

export default Searchbar;
