import { createHash } from "../utils/functionsUtil.js";
import UserDao from '../dao/userDao.js';

export default class UserService {

    constructor () {
        this.userDao = new UserDao();
    }

    async getAll() {
        return await this.userDao.getUsers();
    }

    async getByID(uid) {
        return this.userDao.getUser(uid);
    }

    async register(user) {
        
        const { username, email, password } = user;

        try {
            
            const newUser = {
                username,
                email,
                password: createHash(password),
            };

            await this.userDao.register(username, email, password);
            return newUser;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async login(user) {

        try {
            const {email, password} = user;

            const result = await this.userDao.login(email, password);

            return result;
        } catch(e) {
            throw new Error(error.message);
        }

    }
    
}
