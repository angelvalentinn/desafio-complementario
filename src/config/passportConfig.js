import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';
import jwt, { ExtractJwt } from 'passport-jwt';

import userModel from "../models/userModel.js";
import { createHash, isValidPassword } from "../utils/functionsUtil.js";
import dotenv from 'dotenv';

dotenv.config();

const localStratergy = local.Strategy;
const JWTStrategy = jwt.Strategy;

const initializatePassport = () => {

    passport.use(
        'github',
        new GitHubStrategy({
            clientID: process.env.CLIENT_ID, //Iv1.3a911b2da9af524a
            clientSecret: process.env.CLIENT_SECRET, //59feb048b8361c945511f2000478ecead0377c75
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {

            let user = await userModel.findOne({username: profile._json.login})
            if(!user) {
                let newUser = {
                    username: profile._json.login,
                    name: profile._json.name,
                    password: '',
                    avatar: profile._json.avatar_url
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
            const { name, last_name, email, age} = req.body;
            console.log(req.body);
            try {
                let user = await userModel.findOne({ email: username});
                if (user) {
                    console.log("Usuario ya existente!");
                    return done(null, false);
                }

                const newUser = { name, last_name, email, age, password: createHash(password)}
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

    passport.use(
        "jwt",
        new JWTStrategy({

            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: "secretKey"
        
        }, async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (error) {
                return done(error)
            }
        })
    )

    passport.serializeUser((user, done) => done(null, user._id));

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    })

}

const cookieExtractor = (req) => {
    let token = null;
    
    if (req && req.cookies) {
        token = req.cookies.auth ?? null;
    }

    return token;
}

export default initializatePassport;
