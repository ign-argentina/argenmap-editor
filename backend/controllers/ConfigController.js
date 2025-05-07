import ConfigService from "../services/ConfigService.js";

class ConfigController {
  constructor() {
    this.configService = new ConfigService();
  }

  newConfig = async (req, res) => {
    try {

      const { json } = req.body

      if (!json) {
        return res.status(400).json({ error: 'Falta el campo json' })
      }

      const result = await this.configService.newConfig(json)

      if (!result.success) {
        throw new Error(result.error)
      }

      return res.status(201).json(result.data)

    } catch (err) {
      return res.status(500).json({ err });
    }
  }

  updateConfig = async (req, res) => {
    try {
      const { id } = req.params;
      const { json } = req.body;

      if (!json || !id) {
        return res.status(400).json({ error: 'Los campos ID y JSOn son obligatorios' })
      }

      const result = this.configService.updateConfig(json, id)

      if (!result.success) {
        throw new Error(result.message)
      }

      if (result.data.length === 0) {
        return res.status(404).json({ error: 'Error al actualizar config' })
      }

      return res.status(200).json(result.data)
    } catch (err) {
      return res.status(500).json({ err })
    }
  }

  getAllConfigs = async (req, res) => {
    try {
      const result = await this.configService.getAllConfigs();
  
      if (!result.success) {
        throw new Error(result.error);
      }
  
      return res.status(200).json(result.data);
    } catch (err) {
      return res.status(500).json({ error: 'Error al obtener las configuraciones', detail: err.message });
    }
  };
  

  // getAllConfigs() {
  //   return ["v1", "v2", "v3"]
  // }

  getConfig() {
    return "A single visor"
  }

  deleteConfig() {
    return "visor eliminado"
  }
}

export default ConfigController;