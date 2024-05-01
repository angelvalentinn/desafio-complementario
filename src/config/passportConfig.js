import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';
import userModel from "../dao/models/userModel.js";
import { createHash, isValidPassword } from "../utils/functionsUtil.js";

/*
App ID: 889464
Client ID: 
Client Secret: 
*/

const localStratergy = local.Strategy;

const initializatePassport = () => {

    passport.use(
        'github',
        new GitHubStrategy({
            clientID: 'Iv1.3a911b2da9af524a',
            clientSecret: '59feb048b8361c945511f2000478ecead0377c75',
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            
            let user = await userModel.findOne({username: profile._json.login})
            if(!user) {
                let newUser = {
                    username: profile._json.login,
                    name: profile._json.name,
                    password: ''
                }
                let result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch(error) {
            return done(error);
        }
    }));

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
