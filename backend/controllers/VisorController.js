import VisorService from "../services/VisorService.js";
import AuthService from "../services/AuthService.js";

class VisorController {
  constructor() {
    this.visorService = new VisorService();
    this.authService = new AuthService();
  }

  createVisor = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { groupid, name, description, configJson, img } = req.body
      const { uid } = this.authService.getDataToken(token)

      if (!configJson || !name) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      const result = await this.visorService.createVisor(uid, groupid, name, description, configJson, img)

      if (!result.success) {
        return res.status(400).json({ error: result.error })
      }

      return res.status(201).json(result)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Error al guardar visor', detail: err.message });
    }
  };

  updateVisor = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { visorid, visorgid, name, description, configid, configjson, imageData } = req.body
      const { uid } = this.authService.getDataToken(token)

      if (!configjson || !name) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      const result = await this.visorService.updateVisor(uid, visorid, visorgid, name, description, configid, configjson, imageData)

      if (!result.success) {
        return res.status(400).json({ error: result.error })
      }

      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json(error)
    }
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

  getPublicVisors = async (req, res) => {
    try {
      const result = await this.visorService.getPublicVisors();

      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      return res.status(200).json(result.data);
    } catch (err) {
      return res.status(500).json({ error: 'Error al obtener visores públicos', detail: err.message });
    }
  };

  getMyVisors = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { uid } = this.authService.getDataToken(token)

      const result = await this.visorService.getMyVisors(uid);

      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      return res.status(200).json(result.data);
    } catch (err) {
      return res.status(500).json({ error: 'Error al obtener visores del usuario', detail: err.message });
    }
  };

  getGroupVisors = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { uid } = this.authService.getDataToken(token)
      const { groupid } = req.params;

      const result = await this.visorService.getGroupVisors(uid, groupid);

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(200).json(result.data);
    } catch (err) {
      return res.status(500).json({ error: 'Error al obtener visores de grupo', detail: err.message });
    }
  };


  /*   deleteVisor() {
      return "visor eliminado"
    } */
}

export default VisorController;