import BaseModel from "./BaseModel.js";

const GET_GROUP_LIST = `SELECT g.* FROM grupos g JOIN usuarios_por_grupo ug ON ug.grupoId = g.id WHERE ug.usuarioId = $1 AND ($2::int IS NULL OR ug.rolId = $2); `
const GET_GROUP_ADMIN_LIST = 'SELECT * FROM grupos' // DEPRECADO no borrar

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


/**
* Modelo para operaciones directas sobre la base de datos relacionadas a grupos.
* Incluye funciones para gestionar grupos, miembros y sus roles.
*/
class Group extends BaseModel {

  /**
 * Elimina un grupo por su ID.
 * @param {number} gid - ID del grupo.
 * @returns {Promise<Array>} Resultado de la consulta.
 */
  static deleteGroup = async (gid) => {
    return await super.runQuery('DELETE FROM grupos WHERE id = $1', [gid])
  }

  /**
 * Obtiene un grupo si el usuario tiene permisos de acceso o es superadmin.
 * @param {number} groupId - ID del grupo.
 * @param {?number} userId - ID del usuario (opcional, si es superadmin).
 * @returns {Promise<Array>} Datos del grupo.
 */
  static getGroup = async (groupId, userId = null) => {
    return await super.runQuery(FIND_BY_ID_WITH_ACCESS, [groupId, userId])
  }

  /**
  * Devuelve una lista de grupos donde participa el usuario.
  * @param {number} userId - ID del usuario.
  * @param {?number} rolId - Rol del usuario dentro de los grupos (opcional).
  * @returns {Promise<Array>} Lista de grupos.
  */
  static getGroupList = async (userId, rolId = null) => {
    return await super.runQuery(GET_GROUP_LIST, [userId, rolId])
  }

  /**
   * Devuelve todos los grupos sin restricción. (Deprecated)
   * @returns {Promise<Array>} Lista completa de grupos.
   */
  static getAllGroups = async (userId) => { // DEPRECADO No borrar
    return await super.runQuery(GET_GROUP_ADMIN_LIST)
  }

  /**
  * Devuelve la lista de usuarios pertenecientes a un grupo.
  * @param {number} groupId - ID del grupo.
  * @returns {Promise<Array>} Lista de usuarios.
  */
  static getGroupUserList = async (groupId) => {
    return await super.runQuery(GET_GROUP_USER_LIST, [groupId])
  }

  /**
  * Verifica si un usuario es administrador del grupo.
  * @param {number} groupId - ID del grupo.
  * @param {number} userId - ID del usuario.
  * @returns {Promise<boolean>} True si es admin.
  */
  static isAdminForThisGroup = async (groupId, userId) => {
    const data = await super.runQuery('SELECT EXISTS (SELECT 1 FROM usuarios_por_grupo WHERE grupoid = $1 AND usuarioid = $2 AND rolid = 2)', [groupId, userId]);
    return data[0]?.exists ?? false;
  };

  /**
 * Verifica si un usuario es editor del grupo.
 * @param {number} groupId - ID del grupo.
 * @param {number} userId - ID del usuario.
 * @returns {Promise<boolean>} True si es editor.
 */
  static isEditorForThisGroup = async (groupId, userId) => {
    const data = await super.runQuery('SELECT EXISTS (SELECT 1 FROM usuarios_por_grupo WHERE grupoid = $1 AND usuarioid = $2 AND rolid = 3)', [groupId, userId]);
    return data[0]?.exists ?? false;
  }

  /**
 * Verifica si un usuario ya pertenece a un grupo.
 * @param {number} groupId - ID del grupo.
 * @param {number} userId - ID del usuario.
 * @returns {Promise<Array>} Resultado de existencia.
 */
  static userExists = async (groupId, userId) => {
    return await super.runQuery('SELECT EXISTS (SELECT 1 FROM usuarios_por_grupo WHERE usuarioid = $1 AND grupoid = $2); ', [userId, groupId]) // Devuelve true o false si el usuario ya existe en el grupo
  }


  /**
   * Agrega un usuario a un grupo.
   * @param {number} groupId - ID del grupo.
   * @param {number} userId - ID del usuario.
   * @returns {Promise<Array>} Resultado de la operación.
   */
  static addUserToGroup = async (groupId, userId) => {
    return await super.runQuery(`INSERT INTO usuarios_por_grupo(grupoid, usuarioid) VALUES ($1, $2) RETURNING *`, [groupId, userId])
  }

  /**
 * Elimina a un usuario de un grupo.
 * @param {number} groupId - ID del grupo.
 * @param {number} userId - ID del usuario.
 * @returns {Promise<Array>} Resultado de la eliminación.
 */
  static deleteUserFromGroup = async (groupId, userId) => {
    return await super.runQuery('DELETE FROM usuarios_por_grupo WHERE grupoid = $1 AND usuarioid = $2 RETURNING true', [groupId, userId])
  }

  /**
 * Actualiza el rol de un usuario dentro de un grupo.
 * @param {number} userId - ID del usuario.
 * @param {number} rolId - Nuevo rol.
 * @param {number} groupId - ID del grupo.
 * @returns {Promise<Array>} Resultado de la actualización.
 */
  static updateUserRolFromGroup = async (userId, rolId, groupId) => {
    return await super.runQuery('UPDATE usuarios_por_grupo SET rolid = $3 WHERE grupoid = $1 AND usuarioid = $2 RETURNING true', [groupId, userId, rolId])
  }

  /**
 * Actualiza los datos de un grupo.
 * @param {string} name - Nuevo nombre del grupo.
 * @param {string} description - Nueva descripción.
 * @param {string} img - URL de imagen.
 * @param {number} gid - ID del grupo.
 * @returns {Promise<Array>} Resultado de la operación.
 */
  static updateGroup = async (name, description, img, gid) => {
    return await super.runQuery('UPDATE grupos SET name = $1, description = $2, img = $3 WHERE id = $4 RETURNING true', [name, description, img, gid])
  }
}


export default Group