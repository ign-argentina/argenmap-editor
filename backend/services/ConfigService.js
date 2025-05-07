import Config from "../models/Config.js";
import Result from "../utils/Result.js";

class ConfigService {
  newConfig = async (json) => {
    try {
      const data = await Config.newConfig(json);
      return data ? Result.success(data) : Result.fail("Error al guardar config");
    } catch (error) {
      console.log("Error en la capa de servicio (newConfig):", error);
      return Result.fail(error.message);
    }
  };

  updateConfig = async () => {
    // implementación futura
  };

  getAllConfigs = async () => {
    try {
      const result = await Config.getAllConfigs();
      return result
        ? { success: true, data: result }
        : { success: false, error: 'No se pudieron obtener las configuraciones' };
    } catch (error) {
      console.log("Error en la capa de servicio (getAllConfigs):", error);
      return { success: false, error: error.message };
    }
  };
}

export default ConfigService;