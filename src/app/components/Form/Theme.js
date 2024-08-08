import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePreferences } from '../../store/preferencesSlice';

const Theme = ({ data }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.preferences.theme || data);

  useEffect(() => {
    if (data) {
      dispatch(updatePreferences({ key: 'theme', value: data }));
    }
  }, [data, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updatePreferences({ key: 'theme', value: { ...formData, [name]: value } }));
  };

  return (
    <form>
      {formData && Object.keys(formData).map((key) => (
        <div key={key}>
          <label>
            {key.charAt(0).toUpperCase() + key.slice(1)}:
            <input
              type="text"
              name={key}
              value={formData[key] || ''}
              placeholder={key}
              onChange={handleChange}
            />
          </label>
        </div>
      ))}
    </form>
  );
};

export default Theme;
