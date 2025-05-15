import Config from '../models/Config.js';
import Visor from "../models/Visor.js";
import Result from "../utils/Result.js";

class VisorService {

  saveVisor = async (json, name, description) => {
    try {
      const configResult = await Config.newConfig(json);
      if (!configResult) {
        return { success: false, error: 'No se pudo guardar la configuración' };
      }

      const cid = configResult.id;

      const visorResult = await Visor.saveVisor(cid, name, description);
      if (!visorResult) {
        return { success: false, error: 'No se pudo guardar el visor' };
      }

      return { success: true, data: visorResult };

    } catch (err) {
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

  getVisorById = async (id) => {
    try {
      const visor = await Visor.getVisorById(id);
      if (!visor) {
        return { success: false, error: "Visor no encontrado" };
      }

      const config = await Config.getConfigById(visor.cid);
      if (!config) {
        return { success: false, error: "Configuración no encontrada" };
      }

      return {
        success: true,
        data: {
          ...visor,
          config // embebemos el objeto config dentro del visor
        }
      };
    } catch (err) {
      console.error("Error en VisorService (getVisorById):", err);
      return { success: false, error: err.message };
    }
  };


  deletevisor() {

  }
}

export default VisorService