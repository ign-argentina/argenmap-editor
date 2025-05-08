import BaseModel from "./BaseModel.js";

const INSERT_CONFIG = 'INSERT INTO config (json) VALUES ($1) RETURNING id';
const SELECT_ALL_CONFIGS = 'SELECT * FROM config';
const UPDATE_CONFIG = "";

class Config extends BaseModel {
  static newConfig = async (json) => {
    try {
      const result = await super.runQuery(INSERT_CONFIG, [JSON.stringify(json)]);
      if (!result || result.length === 0) {
        throw new Error("No se insertó ninguna config");
      }
      return result[0];
    } catch (error) {
      console.log("CONFIG MODEL (newConfig):", error);
      return null;
    }
  };
  
  static updateConfig = async (id, json) => {
    try {
      const result = await super.runQuery(UPDATE_CONFIG, [json, id]);
      return result;
    } catch (error) {
      console.log("CONFIG MODEL (updateConfig):", error);
      return null;
    }
  };

  static getAllConfigs = async () => {
    try {
      const result = await super.runQuery(SELECT_ALL_CONFIGS);
      return result;
    } catch (error) {
      console.log("CONFIG MODEL (getAllConfigs):", error);
      return null;
    }
  };
}

export default Config;