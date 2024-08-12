import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePreferences } from '../../store/preferencesSlice';
import styles from '../../form.module.css'

const Theme = ({ data }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.preferences.theme || data);

  // Lista de claves que quieres mostrar en el formulario y sus nombres personalizados
  const fieldsToShow = {
    bodyBackground: 'Color de Fonde del Body',
    headerBackground: 'Color de Fondo del Header',
    menuBackground: 'Color de Fondo de Menú',
    activeLayer: 'Capa Activa',
    textMenu: 'Color de Texto del Menú',
    textLegendMenu: 'Leyenda del Menú',
    iconBar: 'Icono de la Barra'
  };

  useEffect(() => {
    if (data) {
      dispatch(updatePreferences({ key: 'theme', value: data }));
    }
  }, [data, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updatePreferences({ key: 'theme', value: { ...formData, [name]: value } }));
  };

  const isColorField = (key) => {
    const colorKeys = ['bodyBackground', 'headerBackground', 'menuBackground', 'activeLayer', 'textMenu', 'textLegendMenu', 'iconBar'];
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

export default Theme;
