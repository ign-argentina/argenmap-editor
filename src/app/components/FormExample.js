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
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </label>
        <div>
          {/* Aquí puedes usar las preferencias como necesites */}
          {preferences.geoprocessing && <p>{preferences.somePreference}</p>}
        </div>
      </div>
    );
  }
  