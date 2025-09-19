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
      const { groupid, name, description, configJson, img, isPublic } = req.body
      const { uid } = this.authService.getDataToken(token)

      if (!configJson || !name) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      const result = await this.visorService.createVisor(uid, groupid, name, description, configJson, img, isPublic)

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

  deleteVisor = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME];
      const { uid } = this.authService.getDataToken(token);

      const { visorid, visorgid } = req.body;

      if (!visorid) {
        return res.status(400).json({ error: 'Falta el ID del visor' });
      }

      const result = await this.visorService.deleteVisor(uid, visorid, visorgid);

      if (!result.success) {
        return res.status(403).json({ error: result.error });
      }

      return res.status(200).json(result);
    } catch (err) {
      console.error("Error en VisorController (deleteVisor):", err);
      return res.status(500).json({ error: 'Error al eliminar el visor', detail: err.message });
    }
  };

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

  changePublicStatus = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { visorid, visorgid, } = req.body
      const { uid } = this.authService.getDataToken(token)

      if (!visorid) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      const result = await this.visorService.changePublicStatus(uid, visorid, visorgid)

      /*       if (!result.success) {
              return res.status(400).json({ error: result.error })
            } */
      /*       return res.status(200).json(result) */
      return result.success ? res.status(200).json(result) : res.status(400).json({ error: result.error })

    } catch (error) {
      return res.status(500).json(error)
    }
  }

  changeIsSharedStatus = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { visorid, visorgid } = req.body
      const { uid } = this.authService.getDataToken(token)

      if (!visorid) {
        return res.status(400).json({ error: "Faltan campos requeridos" })
      }

      const result = await this.visorService.changeIsSharedStatus(uid, visorid, visorgid)

      return result.success ? res.status(200).json(result) : res.status(400).json({ error: result.error })

    } catch (error) {
      return res.status(500).json(error)
    }
  }

  createShareLink = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { visorid, visorgid, expires } = req.body
      const { uid } = this.authService.getDataToken(token)


      if (!visorid) {
        return res.status(400).json({ error: 'Falta el ID del visor' });
      }

      const result = await this.visorService.createShareLink(uid, visorid, visorgid, expires);

      return result.success ? res.status(200).json(result) : res.status(403).json({ error: result.error });
    } catch (err) {
      console.error("Error en VisorController (deleteVisor):", err);
      return res.status(500).json({ error: 'Error al eliminar el visor', detail: err.message });
    }
  };

  getConfigByShareToken = async (req, res) => { // ASEGURAR CON HEADERS PROVENIENTES DEL VISOR SERVER PARA QUE EL ACCESO SEA SOLO DESDE AHI.
    try {
      const { shareToken, isTemporal } = req.query;

      const result = shareToken ? await this.visorService.getConfigByShareToken(shareToken, isTemporal) : null

      return result.success ? res.status(200).json(result.data) : res.status(403).json({ error: result.error });
    } catch (error) {
      console.log("Error en la capa de controladores (getConfigByShareToken)", error)
      return res.status(500).json({ error: 'Error al buscar el visor', detail: error.message });
    }
  }

    // Se puede volver a usar el mismo metodo en distintoe ndpoint para los visores personales

  restoreViewer = async (req, res) => {
    try {
      const { viewerid, groupid } = req.body
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { uid } = this.authService.getDataToken(token)

      if (!viewerid) {
        return res.status(400).json({ error: 'Faltan parámetros para realizar la consulta' });
      }

      const result = await this.visorService.restoreViewer(viewerid, uid, groupid)

      return result.success ? res.status(200).json(result.data) : res.status(403).json({ error: result.error })
    } catch (error) {
      console.log("Error en la capa de controladores (restoreGroupViewer)", error)
      return res.status(500).json({ error: 'Error ', detail: error.message });
    }
  }

  // Se puede volver a usar el mismo metodo en distintoe ndpoint para los visores personales
  getDeletedViewers = async (req, res) => {
    try {
      const { groupid } = req.params
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { uid } = this.authService.getDataToken(token)

      const result = await this.visorService.getDeletedViewers(uid, groupid)

      return result.success ? res.status(200).json(result.data) : res.status(403).json({ error: result.error })
    } catch (error) {
      console.log("Error en el controlador ", error)
      return res.status(500).json({ error: "Error ", error })
    }
  }
}

export default VisorController;