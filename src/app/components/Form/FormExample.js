export const formName = 'Example';

export default function FormExample({ formData, onFormChange, preferences }) {
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
        <input type="text" name="example" value={formData.example} onChange={handleChange} />
      </label>
      <div>
        {preferences.somePreference && <p>{preferences.somePreference}</p>}
      </div>
    </div>
  );
}
