import BaseModel from "./BaseModel.js";

const INSERT_CONFIG = 'INSERT INTO config (json) VALUES ($1) RETURNING *'
const UPDATE_CONFIG = ""

class Config extends BaseModel{

    static newConfig = async (json) =>{
        try {
            json = JSON.stringify(json)
            const result = await super.runQuery(INSERT_CONFIG, [json])
            return result
        } catch (error){
            console.log("CONFIG MODEL: ", error)
            return null;
        }
    }

    static updateConfig = async (id, json) => {
        try {
            const result = await super.runQuery(UPDATE_CONFIG, [json, id])
            return result
        } catch(error){
            console.log("CONFIG MODEL: ", error)
            return null;
        }
    }

}

export default Config