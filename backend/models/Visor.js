import BaseModel from "./BaseModel.js";

const INSERT_VISOR = `
  INSERT INTO visores (name, description, cid, img)
  VALUES ($1, $2, $3, $4)
  RETURNING *`;

const SELECT_ALL_VISORS = `SELECT * FROM visores`;

const SELECT_VISOR_BY_ID = `SELECT * FROM visores WHERE id = $1`;

class Visor extends BaseModel {
  static saveVisor = async (cid, name, description, img) => {
    try {
      const result = await super.runQuery(INSERT_VISOR, [name, description, cid, img]);
      return result;
    } catch (err) {
      console.log("Error en Visor model (saveVisor):", err);
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
  };

  static getVisorById = async (id) => {
    try {
      const result = await super.runQuery(SELECT_VISOR_BY_ID, [id]);
      return result?.[0] || null;
    } catch (err) {
      console.log("Error en Visor model (getVisorById):", err);
      return null;
    }
  };
}

export default Visor;
