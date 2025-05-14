import User from "../models/User.js"
import Result from "../utils/Result.js"
class UserService {

  updateUser = async (name, lastname, password, id) => {
    try {
        const data = User.updateUser(name, lastname, password, id)
        return data ? Result.success() : Result.fail()
    } catch (error) {
        return error
    }
  }


}

export default UserService