import AuthService from "../services/AuthService.js"
import GroupService from "../services/GroupService.js"

class GroupController {
  constructor() {
    this.groupService = new GroupService()
    this.authService = new AuthService();
  }

  createGroup = async (req, res) => {

  }

  updateGroup = async (req, res) => {

  }

  deleteGroup = async (req, res) => {

  }

  getGroupList = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { uid, rolId } = this.authService.getDataToken(token)
      const result = await this.groupService.getGroupList(uid, rolId)
      return res.status(200).json(result)
    } catch (error) {
      console.log("Error en Controlador: " + error)
      return res.status(500).json(error)
    }
  }

  getManageGroupList = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { uid, isag } = this.authService.getDataToken(token)
      const result = await this.groupService.getGroupList(uid, isag)
      return res.status(200).json(result)
    } catch (error) {
      console.log("Error en Controlador: " + error)
      return res.status(500).json(error)
    }
  }

  getGroup = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const {id} = req.params
      const {uid, isa, isag} = this.authService.getDataToken(token)
      const result = await this.groupService.getGroup(id, uid, isa, isag)
      return res.status(200).json(result)
    } catch (error) {
      console.log("Error en controlador: " + error)
      return res.status(500).json(error)
    }
  }

  getGroupUserList = async (req, res) => {
    try{
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const {id} = req.params
      const {uid, isa} = this.authService.getDataToken(token)
      const result = await this.groupService.getGroupUserList(id, uid, isa);

      return res.status(200).json(result.data)
    }catch(error){
      console.log("Error en el controlador" + error)
      return res.status(500).json(error)
    }
  }

  addUserToGroup = async (req, res) => {
    try{
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const {id, gid} = req.body
      const {uid, isa} = this.authService.getDataToken(token)
      const result = await this.groupService.addUserToGroup(id, uid, isa, gid) 
      
      if(!result.success){
        return res.status(400).json(result)
      }
      return res.status(200).json(result)

    } catch(error){
      console.log("Error en el controlador " + error)
      return res.status(500).json(error)
    }
  }
}

export default GroupController;