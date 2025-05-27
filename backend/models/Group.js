import BaseModel from "./BaseModel.js";

const GET_GROUP_LIST = `SELECT g.* FROM grupos g JOIN usuarios_por_grupo ug ON ug.grupoId = g.id WHERE ug.usuarioId = $1 AND ($2::int IS NULL OR ug.rolId = $2); `
const GET_GROUP_ADMIN_LIST = 'SELECT * FROM grupos'
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
    );
` // Le enviamos 2 parámetros. userId y groupId. Si el userId no llega, es porque la peticion la hizo un superadmin, por lo tanto devuelve directamente.
// Si llega, es porq es un usuario y corrobora que sea admin del grupo antes de devolverlo
// 2 = GroupAdmin rolId

const GET_GROUP_USER_LIST = `SELECT 
  u.id AS uid,
  u.name,
  u.lastname,
  u.email,
  r.name AS rol
FROM usuarios_por_grupo upg
JOIN usuarios u ON upg.usuarioid = u.id
JOIN roles r ON upg.rolid = r.id
JOIN grupos g ON upg.grupoid = g.id
WHERE upg.grupoid = $1
  AND EXISTS (
    SELECT 1
    FROM usuarios_por_grupo
    WHERE grupoid = $1 AND usuarioid = $2 AND rolid = 2
  );`

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

  static getGroupUserList = async (groupId, userId) => {
    return await super.runQuery(GET_GROUP_USER_LIST, [groupId, userId])
  }
}

export default Group