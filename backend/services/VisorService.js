import Visor from "../models/Visor.js";
import Result from "../utils/Result.js";

class VisorService {

  newService() {
    return Visor.newVisor();
  }

  getAllVisors = async () => {
    try {
      const result = await Visor.getAllVisors();
      return result
        ? { success: true, data: result }
        : { success: false, error: 'No se pudieron obtener los visores' };
    } catch (error) {
      console.log("Error en la capa de servicio (getAllVisors):", error);
      return { success: false, error: error.message };
    }
  };

  getvisor() {

  }

  deletevisor() {

  }
}

export default VisorService