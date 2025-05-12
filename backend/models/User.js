import BaseModel from './BaseModel.js'
import bcrypt from 'bcryptjs'

const INSERT_USER = 'INSERT INTO usuarios (email, name, lastname, password) VALUES ($1, $2, $3, $4) RETURNING id, email, name, lastname;'
const SELECT_BY_EMAIL = 'SElECT id, email, name, lastname, password, active FROM usuarios WHERE email LIKE $1;'
const SELECT_1_EMAIL = 'SELECT 1 AS duplicated FROM usuarios WHERE email LIKE $1;'
const SALT_ROUNDS = 10

class User extends BaseModel {

    static findByEmail = async (email) => {
        try {
            return await super.runQuery(SELECT_BY_EMAIL, [email])
        } catch(error){
            console.log("USER MODEL", error)
            return null;
        }
    }
    static newUser = async (email, name, lastname, password) => {
        try {
            const hashPassword = await bcrypt.hash(password, SALT_ROUNDS)
            const result = await super.runQuery(INSERT_USER, [email, name, lastname, hashPassword])

            console.log(password)
            return result
        } catch (error) {
            console.log("USER MODEL: ", error)
            return null;
        }
    }

    static isMailDuplicated = async (email) => {
        try {
            const result = await super.runQuery(SELECT_1_EMAIL, [email])
            return result.length > 0
        } catch (error) {
            console.log("USER MODEL", error)
            return null;
        }
    }

    static validatePassword = async (password, hashPass) => {
        return await bcrypt.compare(password, hashPass)
    }
}

export default User