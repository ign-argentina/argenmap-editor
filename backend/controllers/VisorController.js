import VisorService from "../services/VisorService.js";

class VisorController {
  constructor() {
    this.visorService = new VisorService();
  }

  newVisor() {
    const data = this.visorService.newVisor()
    return data
  }

  getAllVisors() {

    return ["v1", "v2", "v3"]
  }

  getVisor() {
    return "A single visor"
  }

  deleteVisor() {
    return "visor eliminado"
  }
}

export default VisorController;