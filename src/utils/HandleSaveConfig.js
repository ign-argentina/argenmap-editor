import { createConfig } from '../api/configApi'


const HandleSaveConfig = ({ formularioJson }) => {

    // Cuando quieras guardar
    async function saveConfigJson(formularioJson) {
        try {
        const configGuardado = await createConfig(formularioJson);
        console.log('Config guardado:', configGuardado);
        } catch (error) {
        console.error('Error al guardar config:', error);
        }
    }
    
    return { saveConfigJson };
  };
  
  export default HandleSaveConfig;