import Config from '../models/Config.js';
import Visor from "../models/Visor.js";
import Result from "../utils/Result.js";
import Group from '../models/Group.js';
import User from '../models/User.js';
import { config } from 'dotenv';

class VisorService {

  createVisor = async (uid, groupid = null, name, description, configJson, img, isPublic = false) => {
    try {
      let result = []
      const configResult = await Config.newConfig(configJson);
      if (!configResult) {
        return { success: false, error: 'No se pudo guardar la configuración' };
      }

      const cid = configResult.id;

      if (groupid && (await Group.isAdminForThisGroup(groupid, uid) || await User.isSuperAdmin(uid))) {
        result = await Visor.createVisor(uid, groupid, cid, name, description, img, isPublic);
      } else {
        result = await Visor.createVisor(uid, null, cid, name, description, img);
      }

      return result.length > 0 ? Result.success("Visor guardado con éxito") : Result.fail("No se pudo guardar el visor")
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  updateVisor = async (uid, visorid, visorgid, name, description, configid, configjson, img) => {
    try {
      let result = []
      const haveAccessToVisor = visorgid && (await Group.isEditorForThisGroup(visorgid, uid) || await Group.isAdminForThisGroup(visorgid, uid) || await User.isSuperAdmin(uid))
      const isVisorOwner = !visorgid && await Visor.isOwner(visorid, uid)

      if (haveAccessToVisor || isVisorOwner) {
        const [configResult] = await Config.updateConfig(configid, configjson);
        if (configResult.id) { // Config update devuelve el id de la cfg. Por lo tanto, si hay id quiere decir que corresponde a la peticion. Una vez validado, actualizamos visor
          result = await Visor.updateVisor(configid, name, description, img, visorid)
        }
      }
      return result.length > 0 ? Result.success("Visor guardado con éxito") : Result.fail("No se pudo guardar el visor")
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  deleteVisor = async (uid, visorId, visorgid) => {
    try {
      const haveAccessToVisor = visorgid && (
        await Group.isAdminForThisGroup(visorgid, uid) ||
        await User.isSuperAdmin(uid)
      );

      const isVisorOwner = !visorgid && await Visor.isOwner(visorId, uid);

      if (!haveAccessToVisor && !isVisorOwner) {
        return Result.fail("No tenés permisos para eliminar este visor");
      }

      const result = await Visor.deleteVisor(visorId);

      return result.length > 0
        ? Result.success("Visor eliminado correctamente")
        : Result.fail("No se pudo eliminar el visor");
    } catch (err) {
      console.error("Error en VisorService (deleteVisor):", err);
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

  getPublicVisors = async () => {
    try {
      const result = await Visor.getPublicVisors();
      return result.length >= 0 ? Result.success(result) : Result.fail("No se pudo obtener el listado de visores publicos");
    } catch (err) {
      console.error("Error en VisorService (getPublicVisors):", err);
      return { success: false, error: err.message };
    }
  };

  getMyVisors = async (uid) => {
    try {
      const result = await Visor.getMyVisors(uid);
      return result.length >= 0 ? Result.success(result) : Result.fail("No se pudo obtener el listado de visores");
    } catch (err) {
      console.error("Error en VisorService (getMyVisors):", err);
      return { success: false, error: err.message };
    }
  };

  getGroupVisors = async (uid, groupid) => {
    try {
      let result = []
      if (await Group.isMember(uid, groupid) || await User.isSuperAdmin(uid)) {
        result = await Visor.getGroupVisors(groupid)
      }

      return result.length >= 0 ? Result.success(result) : Result.fail("No se pudieron obtener los visores del grupo");
    } catch (err) {
      console.error("Error en VisorService (getGroupVisors):", err);
      return { success: false, error: err.message };
    }
  };

  deletevisor() {

  }

  changeVisorStatus = async (uid, visorid, visorgid = null) => {
    try {
      let result = []

      const haveAccessToVisor = visorgid && (await Group.isAdminForThisGroup(visorgid, uid) || await User.isSuperAdmin(uid) );

      if (haveAccessToVisor){
        result = await Visor.changePublicStatus(visorid)
      }

      return result.length > 0 ? Result.success(result) : Result.fail("No se ha podido cambiar el estado del visor")
    } catch (error) {
      console.log("VISORES: Error en la capa de Servicio")
      return Result.fail("Error en la capa de servicio")
    }
  }
}

export default VisorService