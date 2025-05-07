import BaseModel from "./BaseModel.js";
import { v4 as uuidv4 } from 'uuid';

const INSERT_VISOR = `INSERT INTO visores (id, cid, name, description, lastUpdate) VALUES ($1, $2, $3, $4, $5) RETURNING *`
const INSERT_VISOR_CONFIG = 'INSERT INTO config (json) VALUES ($1) RETURNING id'
const SELECT_AL_VISORS = `SELECT v.id, v.name, v.description, v.lastUpdate, c.json FROM visores v JOIN config c ON v.cid = c.id ORDER BY v.lastUpdate DESC`
const DELETE_VISOR = 'DELETE FROM visores WHERE id = $1'

class Visor extends BaseModel {

  async newVisor(name, description, json) {
    try {

      // Primero insertamos en config
      const configResult = await super.runQuery(INSERT_VISOR_CONFIG, [JSON.stringify(json)])

      const cid = configResult.rows[0].id;
      const id = uuidv4();
      const now = new Date()

      const result = await super.runQuery(INSERT_VISOR, [id, cid, name, description || null, now])

      return result[0] //por que [0]?
    } catch (error) {
      return this.#printError(error)
    }
  }

  async getAllVisors() {
    try {
      const result = await super.runQuery(SELECT_AL_VISORS)
      return result
    } catch (error) {
      return this.#printError(error)
    }
  }

  getVisor() {

  }

  async deleteVisor(id) {
    try {
      const result = await super.runQuery(DELETE_VISOR, [id])
      return result
    } catch (error) {
      return this.#printError(error)
    }
  }


  #printError(error) {
    console.log("VISOR MODEL: ", error)
    return null
  }
}

export default Visor