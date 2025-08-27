import BaseModel from "./BaseModel.js";

const INSERT_CONFIG = 'INSERT INTO config (data, preferences) VALUES ($1, $2) RETURNING id';
const SELECT_ALL_CONFIGS = 'SELECT * FROM config';
const UPDATE_CONFIG = "UPDATE config SET json = $1 WHERE id = $2 RETURNING id";
const SELECT_CONFIG_BY_ID = 'SELECT * FROM config WHERE id = $1';

class Config extends BaseModel {

  static getConfigById = async (id) => {
    try {
      const result = await super.runQuery(SELECT_CONFIG_BY_ID, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.log("CONFIG MODEL (getConfigById):", error);
      return null;
    }
  };

  static newConfig = async (config) => {
    try {
      const {data, preferences} = config
      console.log(data)
      console.log(preferences)
/*       const preferences = preferences ? JSON.stringify */
      const result = await super.runQuery(INSERT_CONFIG, [JSON.stringify(data), preferences ? JSON.stringify(preferences) : null]);
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