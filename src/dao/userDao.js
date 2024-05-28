import userModel from "../models/userModel.js";
import { isValidPassword } from "../utils/functionsUtil.js";
import jwt from "jsonwebtoken";

class UserDao {

    async getUsers() {
        try {
            return await userModel.find().lean();
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al consultar los usuarios!");
        }
    }

    async getUser(uid) {
        try {
            return await userModel.findOne({ _id: uid }).lean();
        } catch (error) {
            console.error(error.message);
            throw new Error("Usuario no encontrado!");
        }
    }

    async register(username, email, password) {
        try {
            const existeUser = await userModel.findOne({ email });
    
            if (existeUser) {
                throw new Error(`Usuario con ${email} ya existe!`);
            } else {
                const newUser = {
                    username,
                    email,
                    password: password
                };
                await userModel.create(newUser);
                return newUser;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async login(email, password) {
        if (!email || !password) {
            throw new Error("Credenciales inválidas!");
        }
        try {
            const user = await userModel.findOne({ email }).lean();

            if (!user) throw new Error('Usuario inválido!');

            if (isValidPassword(user, password)) {
                delete user.password;
                return jwt.sign(user, "secretKey", { expiresIn: "1h" });

            } else {
                throw new Error("Contraseña inválida!");
            }
            
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al loguear usuario!");
        }
    }

}

export default UserDao; 