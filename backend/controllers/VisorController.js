import VisorService from "../services/VisorService.js";

class VisorController {
  constructor() {
    this.visorService = new VisorService();
  }

  saveVisor = async (req, res) => {
    try {
      const { json, name, description, img } = req.body;

      if (!json || !name) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      const result = await this.visorService.saveVisor(json, name, description, img);

      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      return res.status(201).json(result.data);

    } catch (err) {
      return res.status(500).json({ error: 'Error al guardar visor', detail: err.message });
    }
  };



  // getAllVisors() {

  //   return ["v1", "v2", "v3"]
  // }

  getAllVisors = async (req, res) => {
    try {
      const result = await this.visorService.getAllVisors();

      if (!result.success) {
        throw new Error(result.error);
      }

      return res.status(200).json(result.data);
    } catch (err) {
      return res.status(500).json({ error: 'Error al obtener los visores', detail: err.message });
    }
  };

  getVisorById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.visorService.getVisorById(id);

      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }

      return res.status(200).json(result.data);
    } catch (err) {
      return res.status(500).json({ error: 'Error al obtener el visor', detail: err.message });
    }
  };


  deleteVisor() {
    return "visor eliminado"
  }
}

export default VisorController;