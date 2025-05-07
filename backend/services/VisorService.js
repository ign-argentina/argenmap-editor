import Config from '../models/Config.js';
import Visor from "../models/Visor.js";
import Result from "../utils/Result.js";

class VisorService {

  saveVisor = async (json, name, description) => {
    try {
      // 1. Guardar la config y obtener el ID
      const configResult = await Config.newConfig(json);
      if (!configResult) return { success: false, error: 'No se pudo guardar la configuración' };

      const cid = configResult.id;

      // 2. Guardar el visor con el ID de config
      const visorResult = await Visor.saveVisor(cid, name, description);
      if (!visorResult) return { success: false, error: 'No se pudo guardar el visor' };

      return { success: true, data: visorResult };

    } catch (err) {
      console.log("Error en VisorService (saveVisor):", err);
      return { success: false, error: err.message };
    }
  };
  

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