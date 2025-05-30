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
    FROM usuarios_por_grupo
    WHERE usuarioId = $1 AND rolId = 2
  ) as groupadmin
`;

const SALT_ROUNDS = 10

class User extends BaseModel {

  static getUserList = async () => {
    const result = await super.runQuery(`SELECT id, name, lastname, email FROM usuarios`)
    return result
  }

  static findByEmail = async (email) => {
    try {
      return await super.runQuery(SELECT_BY_EMAIL, [email])
    } catch (error) {
      console.log("USER MODEL", error)
      return null;
    }
  }

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

  // Verifica que el mail no esté duplicado.
  static isMailDuplicated = async (email) => {
    try {
      const result = await super.runQuery(SELECT_1_EMAIL, [email])
      return result.length > 0
    } catch (error) {
      console.log("USER MODEL", error)
      return null;
    }
  }

  static validatePassword = async (password, hashPass) => {
    return await bcrypt.compare(password, hashPass)
  }

  static #hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS)
  }

  // Devuelve la flag "superadmin" en la tabla usuarios. (Columna superadmin)
  static isSuperAdmin = async (id) => {
    try {
      const [user] = await super.runQuery(IS_SUPER_ADMIN, [id])
      return user.superadmin
    } catch (error) {
      console.log("USER MODEL: ", error)
    }
  }

  // Recorre la tabla "Usuarios por grupo" y finaliza al encontrar un grupo en el cual el usuario es admin.  Devuelve true o false
  static isGroupAdmin = async (id) => {
    try {
      const [user] = await super.runQuery(IS_GROUP_ADMIN, [id])
      return user.groupadmin
    } catch (error) {
      console.log("USER MODEL: ", error)
    }
  }
}

export default User