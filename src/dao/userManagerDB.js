import userModel from "./models/userModel.js";
import { isValidPassword } from "../utils/functionsUtil.js";
import jwt from "jsonwebtoken";

class UserManager {

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

    async register(user) {
        const { first_name, last_name, email, age, password } = user;

        if (!first_name || !last_name || !email || !age || !password) {
            throw new Error('Error al registrar usuario!');
        }

        const emailExists = await userModel.findOne({ email }).lean();

        if (emailExists) {
            new Error("Usuario ya existente!");
        }

        try {
            await userModel.create({ first_name, last_name, email, age, password });

            return "Usuario creado correctamente!";
        } catch (error) {
            console.error(error.message);
            throw new Error('No se pudo registrar al usuario!');
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

export default UserManager; 