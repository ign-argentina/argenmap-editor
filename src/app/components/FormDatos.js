export const formName = 'Datos';

export default function FormDatos({ formData, onFormChange, preferences }) {
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
        {preferences.geoprocessing.availableProcesses[1].name}:
        <input type="text" name="datos" value={formData.datos} onChange={handleChange} />
      </label>
      <div>
        {preferences.somePreference && <p>{preferences.somePreference}</p>}
      </div>
    </div>
  );
}
