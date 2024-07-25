export const formName = 'Tema';

export default function Theme({ formData, onFormChange, preferences }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <label>
        {preferences.geoprocessing.availableProcesses[0].name}:
        <input type="text" name="theme" value={formData.theme} onChange={handleChange} />
      </label>
      <div>
        {preferences.somePreference && <p>{preferences.somePreference}</p>}
      </div>
    </div>
  );
}
