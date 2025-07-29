import currentVisor from "../../api/visorApi";

const Preview = ({ visorId = "123", tipo = "argenmap" }) => {

  // Podriamos leer una flag para ver que tipo previsualizar.
  const visores = ['argenmap', 'kharta'];
  const randomIndex = Math.floor(Math.random() * visores.length);

//  const url = `http://${currentVisor.IP}:${currentVisor.API_PORT}/${tipo}?id=${visorId}`; VERSION ORIGINAL

// random para testear
   const url = `http://${currentVisor.IP}:${currentVisor.API_PORT}/${visores[randomIndex]}`;
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