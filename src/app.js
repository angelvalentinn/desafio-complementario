import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import passport from "passport";
import mongoStore from 'connect-mongo';
import session from 'express-session';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

import viewsRouter from "./routes/views.router.js";
import __dirname from "./util.js";
import productRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartsRouter.js';
import sessionRouter from './routes/sessionRouter.js';
import initializatePassport from "./config/passportConfig.js";

dotenv.config();

const app = express();

const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`) );

//MongoDB connect
const local = "mongodb://localhost:27017"
const uri = process.env.MONGO_ATLAS; //mongodb+srv://altieriangel:45873351angel@cluster0.3vzafbj.mongodb.net/
mongoose.connect(uri, {dbName: "ecommerce"});

//Creamos un servidor para sockets viviendo dentro de nuestro servidor principal
const io = new Server(httpServer);

//Handlebars Config
app.engine("handlebars", handlebars.engine()); //Incializamos el motor de plantillas
app.set("views",`${__dirname}/views`); //Establecemos la ruta de vistas
app.set("view engine", "handlebars"); //Establecemos el motor de renderizado

// Middlewares
app.use(express.json()); //Nos permite hacer uso de lo que se trae por req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(`${__dirname}/public`)); //Establecemos el servidor estático de archivos, nos permite tener archivos css y js en plantillas
app.use(cookieParser());

//Session Middleware
app.use(session(
    {
        store: mongoStore.create(
            {
                mongoUrl: uri,
                ttl: 50000
            }
        ),
        secret: 'secretPhrase',
        resave: true,
        saveUninitialized: true
    }
));
initializatePassport();
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionRouter);




