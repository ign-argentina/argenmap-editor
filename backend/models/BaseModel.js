import db from "../db/database.js";

/**
 * Clase base para modelos que se conectan a la base de datos.
 * Proporciona un método genérico para ejecutar consultas SQL.
 */
class BaseModel {
  /**
 * Ejecuta una consulta SQL con los parámetros dados.
 * @param {string} sql - La consulta SQL a ejecutar.
 * @param {Array} [params=[]] - Lista de parámetros para la consulta.
 * @returns {Promise<Array>} Resultados obtenidos (filas).
 */
  static async runQuery(sql, params = []) {
    const result = await db.query(sql, params);
    return result.rows;
  }
}
export default BaseModel;