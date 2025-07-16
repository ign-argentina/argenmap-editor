import BaseModel from "./BaseModel.js";

const INSERT_VISOR = `INSERT INTO visores (uid, gid, cid, name, description, img, publico) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
const UPDATE_VISOR = `UPDATE visores SET cid = $1, name = $2, description = $3, img = $4 WHERE id = $5 RETURNING name`
const UPDATE_PUBLIC_STATUS = 'UPDATE visores SET publico = NOT publico WHERE id = $1 RETURNING name'
const IS_VISOR_OWNER = 'SELECT EXISTS (SELECT 1 FROM visores WHERE uid = $2 and id = $1)'
const SELECT_ALL_VISORS = `SELECT * FROM visores`;

const SELECT_VISOR_BY_ID = `SELECT * FROM visores WHERE id = $1`;

const SELECT_PUBLIC_VISORS = `
  SELECT * FROM visores
  WHERE publico = true AND deleted = false`;

const SELECT_MY_VISORS = `
  SELECT * FROM visores
  WHERE uid = $1 AND deleted = false AND gid IS NULL`;

const DELETE_VISOR = `
  UPDATE visores
  SET deleted = TRUE
  WHERE id = $1 
  RETURNING 1`;

const SELECT_GROUP_VISORS = `
  SELECT * FROM visores 
  WHERE gid = $1 AND deleted = false`;

const GET_SHARE_TOKEN = `SELECT sharetoken FROM visores WHERE id = $1`

const GET_BY_SHARE_TOKEN = `SELECT cid FROM visores WHERE sharetoken = $1`

class Visor extends BaseModel {
  static createVisor = async (uid, groupid, cid, name, description, img, isPublic = false) => {
    try {
      const result = await super.runQuery(INSERT_VISOR, [uid, groupid, cid, name, description, img, isPublic]);
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

  static deleteVisor = async (visorId) => {
    try {
      const result = await super.runQuery(DELETE_VISOR, [visorId]);
      return result;
    } catch (err) {
      console.log("Error en Visor model (deleteVisor):", err);
      return null;
    }
  };

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

  static isOwner = async (visorId, uid) => {
    const data = await super.runQuery(IS_VISOR_OWNER, [visorId, uid])
    return data[0]?.exists ?? false;
  }

  static getPublicVisors = async () => {
    try {
      const result = await super.runQuery(SELECT_PUBLIC_VISORS);
      return result;
    } catch (err) {
      console.log("Error en Visor model (getPublicVisors):", err);
    }
  };

  static getMyVisors = async (uid) => {
    try {
      const result = await super.runQuery(SELECT_MY_VISORS, [uid]);
      return result;
    } catch (err) {
      console.log("Error en Visor model (getMyVisors):", err);
      return null;
    }
  };

  static getGroupVisors = async (groupid) => {
    try {
      const result = await super.runQuery(SELECT_GROUP_VISORS, [groupid]);
      return result;
    } catch (err) {
      console.log("Error en Visor model (getGroupVisors):", err);
      return null;
    }
  };

  static changePublicStatus = async (id) => {
    const result = await super.runQuery(UPDATE_PUBLIC_STATUS, [id])
    return result;
  }

  static getShareToken = async (id) => {
    const result = await super.runQuery(GET_SHARE_TOKEN, [id])
    return result
  }

  static getConfigIdByShareToken = async (shareToken) => {
    try {
      const result = await super.runQuery(GET_BY_SHARE_TOKEN, [shareToken]);
      return result?.[0].cid || null;
    } catch (err) {
      console.error("Error en Visor.getConfigIdByShareToken:", err);
      throw err; // O podés devolver null
    }
  };
}

export default Visor