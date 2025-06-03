import { deleteUserFromGroup } from "../../src/api/configApi.js";
import BaseModel from "./BaseModel.js";

const GET_GROUP_LIST = `SELECT g.* FROM grupos g JOIN usuarios_por_grupo ug ON ug.grupoId = g.id WHERE ug.usuarioId = $1 AND ($2::int IS NULL OR ug.rolId = $2); `
const GET_GROUP_ADMIN_LIST = 'SELECT * FROM grupos'

// Le enviamos 2 parámetros. userId y groupId. Si el userId no llega, es porque la peticion la hizo un superadmin, por lo tanto devuelve directamente.
// Si llega, es porq es un usuario y corrobora que sea admin del grupo antes de devolverlo
// 2 = GroupAdmin rolId
const FIND_BY_ID_WITH_ACCESS = `SELECT g.*
                                FROM grupos g
                                WHERE g.id = $1
                                  AND (
                                    $2::int IS NULL
                                    OR EXISTS (
                                      SELECT 1
                                      FROM usuarios_por_grupo ug
                                      WHERE ug.grupoid = g.id AND ug.usuarioid = $2 AND ug.rolid= 2
                                    )
                                  );`


const GET_GROUP_USER_LIST = `SELECT 
                                u.id,
                                u.name,
                                u.lastname,
                                u.email,
                                r.id AS rol
                            FROM usuarios_por_grupo upg
                            JOIN usuarios u ON upg.usuarioid = u.id
                            JOIN roles r ON upg.rolid = r.id
                            JOIN grupos g ON upg.grupoid = g.id
                            WHERE upg.grupoid = $1;`

class Group extends BaseModel {
  static getGroup = async (groupId, userId = null) => {
    return await super.runQuery(FIND_BY_ID_WITH_ACCESS, [groupId, userId])
  }
  static getGroupList = async (userId, rolId = null) => {
    return await super.runQuery(GET_GROUP_LIST, [userId, rolId])
  }

  static getAllGroups = async (userId) => { // EN DESUSO
    return await super.runQuery(GET_GROUP_ADMIN_LIST)
  }

  static getGroupUserList = async (groupId) => {
    return await super.runQuery(GET_GROUP_USER_LIST, [groupId])
  }

  static isAdminForThisGroup = async (groupId, userId) => {
    return await super.runQuery('SELECT EXISTS (SELECT 1 FROM usuarios_por_grupo WHERE grupoid = $1 AND usuarioid = $2 AND rolid = 2)', [groupId, userId]) // EL rol id, esta harcodeado id 2 = groupAdmin
  //  return await super.runQuery('SELECT 1 FROM usuarios_por_grupo WHERE grupoid = $1 AND usuarioid = $2 AND rolid = 2;', [groupId, userId]) // Checkea si el usuario es admin del grupo
  }

  static userExists = async (groupId, userId) => {
    return await super.runQuery('SELECT EXISTS (SELECT 1 FROM usuarios_por_grupo WHERE usuarioid = $1 AND grupoid = $2); ', [userId, groupId]) // Devuelve true o false si el usuario ya existe en el grupo
  }

  static addUserToGroup = async (groupId, userId) => {
      return await super.runQuery(`INSERT INTO usuarios_por_grupo(grupoid, usuarioid) VALUES ($1, $2) RETURNING *`, [groupId, userId])
  }

  static deleteUserFromGroup = async (groupId, userId) => {
    return await super.runQuery('DELETE FROM usuarios_por_grupo WHERE grupoid = $1 AND usuarioid = $2 RETURNING true', [groupId, userId])
  }

  static updateUserRolFromGroup = async (userId, rolId, groupId) => {
    return await super.runQuery('UPDATE usuarios_por_grupo SET rolid = $3 WHERE grupoid = $1 AND usuarioid = $2 RETURNING true', [groupId, userId, rolId])
  }
}

export default Group