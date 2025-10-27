import BaseModel from './BaseModel.js'
import bcrypt from 'bcryptjs'

const INSERT_USER = 'INSERT INTO usuarios (email, name, lastname, password) VALUES ($1, $2, $3, $4) RETURNING id, email, name, lastname;'
const SELECT_BY_EMAIL = 'SElECT id, email, name, lastname, password, active FROM usuarios WHERE email LIKE $1;'
const SELECT_1_EMAIL = 'SELECT 1 AS duplicated FROM usuarios WHERE email LIKE $1;'
const UPDATE_USER = `UPDATE usuarios SET name = COALESCE($1, name), lastname = COALESCE($2, lastname), password = COALESCE($3, password)
                     WHERE id = $4
                     AND (COALESCE($1, name) IS DISTINCT FROM name OR COALESCE($2, lastname) IS DISTINCT FROM lastname OR COALESCE($3, password) IS DISTINCT FROM password)
                     RETURNING email, name, lastname;`;

const IS_SUPER_ADMIN = `SELECT superadmin FROM usuarios WHERE id = $1`;

const IS_GROUP_ADMIN = `
  SELECT EXISTS (
    SELECT 1
    FROM usuarios_por_grupo ug
    JOIN grupos g ON ug.grupoId = g.id
    WHERE ug.usuarioId = $1 AND ug.rolId = 2 AND g.deleted = false
  ) as groupadmin
`;

const SALT_ROUNDS = 10

const SEARCH_USER = `
  SELECT email, name, lastname, active
  FROM usuarios
  WHERE (
    email ILIKE $1 
    OR CONCAT(name, ' ', lastname) ILIKE $1
  )
  ORDER BY email ASC
  LIMIT $2;
`;

const CHANGE_USER_STATUS = `UPDATE usuarios SET active = NOT active WHERE id = $1`
/**
 * Modelo que maneja la tabla usuarios y toda la lógica relacionada.
 * Permite crear, actualizar, buscar usuarios y verificar roles.
 */
class User extends BaseModel {

  /**
 * Obtiene la lista de todos los usuarios que no son superadmins.
 * @returns {Array} Lista de usuarios con id, nombre, apellido y email.
 */
  static getUserList = async () => {
    const result = await super.runQuery(`SELECT id, name, lastname, email, active FROM usuarios WHERE NOT superadmin ORDER BY email ASC`)
    return result
  }

  /**
 * Busca un usuario por su email.
 * @param {string} email - Email a buscar.
 * @returns {Array|null} Datos del usuario o null si hay error.
 */
  static findByEmail = async (email) => {
    try {
      return await super.runQuery(SELECT_BY_EMAIL, [email])
    } catch (error) {
      console.log("USER MODEL", error)
      return null;
    }
  }

  /**
 * Crea un nuevo usuario con contraseña hasheada.
 * @param {string} email - Email del nuevo usuario.
 * @param {string} name - Nombre del nuevo usuario.
 * @param {string} lastname - Apellido del nuevo usuario.
 * @param {string} password - Contraseña sin encriptar.
 * @returns {Array|null} Usuario creado o null si falla.
 */
  static newUser = async (email, name, lastname, password) => {
    try {
      const hashPassword = await this.#hashPassword(password)
      const result = await super.runQuery(INSERT_USER, [email, name, lastname, hashPassword])
      return result
    } catch (error) {
      console.log("USER MODEL: ", error)
      return null;
    }
  }

  /**
 * Actualiza datos del usuario, puede cambiar nombre, apellido y contraseña.
 * @param {string|null} name - Nuevo nombre o null para no cambiar.
 * @param {string|null} lastname - Nuevo apellido o null para no cambiar.
 * @param {string|null} password - Nueva contraseña o null para no cambiar.
 * @param {number} id - ID del usuario a actualizar.
 * @returns {Array|undefined} Resultado de la actualización o undefined si falla.
 */
  static updateUser = async (name, lastname, password, id) => {
    try {
      let hashPassword = null
      if (password) {
        hashPassword = await this.#hashPassword(password)
      }

      const result = await super.runQuery(UPDATE_USER, [name, lastname, hashPassword, id])

      return result
    } catch (error) {
      console.log("USER MODEL: ", error)
    }
  }

  /**
   * Verifica si un email ya existe en la base de datos.
   * @param {string} email - Email a verificar.
   * @returns {boolean|null} True si está duplicado, false si no, o null ocurre un error.
   */
  static isMailDuplicated = async (email) => {
    try {
      const result = await super.runQuery(SELECT_1_EMAIL, [email])
      return result.length > 0
    } catch (error) {
      console.log("USER MODEL", error)
      return null;
    }
  }

  /**
 * Compara una contraseña con su hash para validar autenticidad.
 * @param {string} password - Contraseña en texto plano.
 * @param {string} hashPass - Contraseña hasheada almacenada.
 * @returns {boolean} True si coinciden, false si no.
 */
  static validatePassword = async (password, hashPass) => {
    return await bcrypt.compare(password, hashPass)
  }

  /**
 * Genera el hash de una contraseña (método privado).
 * @param {string} password - Contraseña a encriptar.
 * @returns {string} Contraseña encriptada.
 */
  static #hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS)
  }

  /**
   * Verifica si un usuario es superadmin.
   * @param {number} id - ID del usuario.
   * @returns {boolean} True si es superadmin, false si no.
   */
  static isSuperAdmin = async (id) => {
    try {
      const [user] = await super.runQuery(IS_SUPER_ADMIN, [id])
      return user.superadmin
    } catch (error) {
      console.log("USER MODEL: ", error)
    }
  }

  /**
   * Verifica si un usuario es admin en algún grupo.
   * @param {number} id - ID del usuario.
   * @returns {boolean} True si es admin de grupo, false si no.
   */
  static isGroupAdmin = async (id) => {
    try {
      const [user] = await super.runQuery(IS_GROUP_ADMIN, [id])
      return user.groupadmin
    } catch (error) {
      console.log("USER MODEL: ", error)
    }
  }

  static searchUser = async (search, limit) => {
    const searchTerm = `%${search}%`;
    const userList = await super.runQuery(SEARCH_USER, [searchTerm, limit])
    return userList
  }

  static changeUserStatus = async (id) => {
    const result = await super.runQuery(CHANGE_USER_STATUS, [id])
    return result
  }
}

export default User