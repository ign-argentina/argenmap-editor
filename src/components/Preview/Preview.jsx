import currentVisor from "../../api/visorApi";

const Preview = ({ visorId = "123", tipo = "argenmap" }) => {
  const url = `http://${currentVisor.IP}:${currentVisor.API_PORT}/visor/${tipo}?id=${visorId}`;
  return (
    <iframe
      src={url}
      title={`Visor ${tipo}`}
      width="100%"
      height="100%"
      style={{ border: 'none' }}
    />
  );
};

export default Preview;