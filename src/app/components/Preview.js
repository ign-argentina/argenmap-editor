export default function Preview({ formData }) {
    return (
      <div>
        <h2>Preview</h2>
        <h3>{formData.title}</h3>
        <p>{formData.description}</p>
        <p>{formData.anotherField}</p>
        <p>{formData.fourthField}</p>
      </div>
    );
  }
  