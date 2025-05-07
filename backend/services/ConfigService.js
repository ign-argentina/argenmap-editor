import Config from "../models/Config.js";
import Result from "../utils/Result.js";

class ConfigService {

  newConfig = async (json) => {
    try {

      const data = await Config.newConfig(json)
      return data ? Result.success(data) : Result.fail("Error al guardar config");

    } catch (error) {
      console.log("Error en la capa de servicio", error)
    }
  }

  updateConfig = async () => {

  }

  getAllConfigs() {

  }

  getConfig() {

  }

  deleteConfig() {

  }
}

export default ConfigService