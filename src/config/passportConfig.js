import passport from "passport";
import local from "passport-local";

import userModel from "../dao/models/userModel.js";
import { createHash, isValidPassword } from "../utils/functionsUtil.js";

const localStratergy = local.Strategy;
const initializatePassport = () => {
    passport.use('register', new localStratergy(
        {
            passReqToCallback: true, //Permite que se pueda acceder al objeto req como cualquier otro middlewar
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age} = req.body;

            try {
                let user = await userModel.findOne({ email: username});
                if (user) {
                    console.log("Usuario ya existente!");
                    return done(null, false);
                }

                const newUser = { first_name, last_name, email, age, password: createHash(password)}
                const result = await userModel.create(newUser);
                
                return done(null, result); //Si todo sale bien 
            } catch (error) {
                return done(error.message); //Si hay error mandamos el error
            }
        }
    ))

    passport.use('login', new localStratergy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                
                if (!user) {
                    const errorMessage = "Usuario no existe";
                    console.log(errorMessage);
                    return done(errorMessage)
                }
                
                if (!isValidPassword(user, password)) {
                    return done(null, false);
                }

                return done(null, user);
            } catch(error) {
                console.log(error.message);
                return done(error.message);
            }
        }
    ));

    passport.serializeUser((user, done) => done(null, user._id));

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    })
}

export default initializatePassport;
