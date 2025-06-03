import BaseModel from "./BaseModel.js";
const SELECT_ROLES = `SELECT * FROM roles WHERE name NOT LIKE 'superadmin'`;

class Rol extends BaseModel {
  static roles = null;

  static async init() {
    if (!Rol.roles) {
      Rol.roles = await Rol.loadRoles();
    }
  }

  static async loadRoles() {
    return await super.runQuery(SELECT_ROLES, []);
  }

  static getRoles() {
    return Rol.roles;
  }
}

export default Rol;
