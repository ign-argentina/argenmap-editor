export default function Form({ formData, onFormChange, activeTab }) {
    const handleChange = (e) => {
      const { name, value } = e.target;
      onFormChange({
        ...formData,
        [name]: value,
      });
    };
  
    return (
      <form>
        {activeTab === 0 && (
          <div>
            <label>
              Title:
              <input type="text" name="title" value={formData.title} onChange={handleChange} />
            </label>
          </div>
        )}
        {activeTab === 1 && (
          <div>
            <label>
              Description:
              <textarea name="description" value={formData.description} onChange={handleChange} />
            </label>
          </div>
        )}
        {activeTab === 2 && (
          <div>
            {/* Aquí puedes agregar más campos específicos para la tercera pestaña */}
            <label>
              Another Field:
              <input type="text" name="anotherField" value={formData.anotherField || ''} onChange={handleChange} />
            </label>
          </div>
        )}
        {activeTab === 3 && (
          <div>
            {/* Aquí puedes agregar más campos específicos para la cuarta pestaña */}
            <label>
              Fourth Field:
              <input type="text" name="fourthField" value={formData.fourthField || ''} onChange={handleChange} />
            </label>
          </div>
        )}
      </form>
    );
  }
  