import User from "../models/User.js"
import Result from "../utils/Result.js"

class UserService {

  getUserList = async () => {
    try{
      const data = await User.getUserList()
      return data
    }catch(error){
      return error
    }
  }
  updateUser = async (name, lastname, password, id) => {
    try {
        const [data] = await User.updateUser(name, lastname, password, id)
        return data ? Result.success(data) : Result.fail()
    } catch (error) {
        return error
    }
  }


}

export default UserService