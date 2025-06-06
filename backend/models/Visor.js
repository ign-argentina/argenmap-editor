import BaseModel from "./BaseModel.js";

const INSERT_VISOR = `INSERT INTO visores (uid, gid, cid, name, description, img) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
const UPDATE_VISOR = `UPDATE visores SET cid = $1, name = $2, description = $3, img = $4 WHERE id = $5 RETURNING name`
const IS_VISOR_OWNER = 'SELECT EXISTS (SELECT 1 FROM visores WHERE uid = $1)'
const SELECT_ALL_VISORS = `SELECT * FROM visores`;

const SELECT_VISOR_BY_ID = `SELECT * FROM visores WHERE id = $1`;

class Visor extends BaseModel {
  static createVisor = async (uid, groupid, cid, name, description, img) => {
    try {
      const result = await super.runQuery(INSERT_VISOR, [uid, groupid, cid, name, description, img]);
      return result;
    } catch (err) {
      console.log("Error en Visor model (createVisor):", err);
      return null;
    }
  }

  static updateVisor = async (cid, name, description, img, visorid) => {
    try {
      const result = await super.runQuery(UPDATE_VISOR, [cid, name, description, img, visorid]);
      return result;
    } catch (err) {
      console.log("Error en Visor model (updateVisor):", err);
      return null;
    }
  }

  static getAllVisors = async () => {
    try {
      const result = await super.runQuery(SELECT_ALL_VISORS);
      return result;
    } catch (error) {
      console.log("VISOR MODEL (getAllVisors):", error);
      return null;
    }
  }

  static getVisorById = async (id) => {
    try {
      const result = await super.runQuery(SELECT_VISOR_BY_ID, [id]);
      return result?.[0] || null;
    } catch (err) {
      console.log("Error en Visor model (getVisorById):", err);
      return null;
    }
  }

  static isOwner = async (id, uid) => {
    const data = await super.runQuery(IS_VISOR_OWNER, [id, uid])
    return data[0]?.exists ?? false;
  }
}

export default Visor