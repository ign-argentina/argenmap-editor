import Group from "../models/Group.js"

class GroupService {

  getGroupList = async (userId, isSuperAdmin = false, isGroupAdmin = false) => {
    try {
      let rolId = null;
      let data = []
      if (isSuperAdmin) {
        data = await this.#getAllGroups(userId)
      } else {
        rolId = isGroupAdmin ? 2 : rolId // Mejorar. No hardcode (o si?)
        data = await Group.getGroupList(userId, rolId) // Búsqueda normal, te devuelve los grupos donde perteneces.
      }
      return data
    } catch (error) {
      console.log("Error en capa de servicio: " + error)
    }
  }

  getGroup = async (id, uid, isSuperAdmin) => {
    try {
      let grupo = []
      if (isSuperAdmin) {
        [grupo] = await Group.getGroup(id)
      } else {
        [grupo] = await Group.getGroup(id, uid)
      }
      return grupo
    } catch (error) {
      console.log("Error en la capa de servicio " + error)
    }
  }

  #getAllGroups = async (userId) => {
    try {
      return await Group.getAllGroups()
    } catch (error) {
      console.log("Error en capa de serivcio: " + error)
    }
  }
}

export default GroupService