import UserService from "../services/userService.js";

export default class UserController {

    constructor() {
        this.userService = new UserService();
    }

    async getAllUsers() {
        return await this.userService.getAll();
    }

    async getUserByID(uid) {
        return await this.userService.getByID(uid);
    }

    async createUser(user) {
        const {username, email, password} = user;

        if (!username || !email || !password) {
            throw new Error('Error al crear el usuario');
        }

        return await this.userService.register({username, email, password});
    }

    async loginUser(user) {
        const {email, password} = user;
        
        if(!email || !password) throw new Error('Error al loguear usuario');

        return await this.userService.login({email, password});

    }

}