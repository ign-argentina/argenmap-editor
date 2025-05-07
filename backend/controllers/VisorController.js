import VisorService from "../services/VisorService.js";

class VisorController {
  constructor() {
    this.visorService = new VisorService();
  }

  newVisor() {
    const data = this.visorService.newVisor()
    return data
  }

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

  getVisor() {
    return "A single visor"
  }

  deleteVisor() {
    return "visor eliminado"
  }
}

export default VisorController;