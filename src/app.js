import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./util.js";
import viewsRouter from "./routes/views.router.js";
import productRouter from './routes/route.products.js'
import { Server } from "socket.io";
import websocket from '../websocket.js';
import mongoose from 'mongoose';

const app = express();

const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`) );

//MongoDB connect
const uri = "mongodb://localhost:27017";
mongoose.connect(uri, {dbName: "ecommerce"});

//Creamos un servidor para sockets viviendo dentro de nuestro servidor principal
const socketServer = new Server(httpServer);

//Handlebars Config
app.engine("handlebars", handlebars.engine()); //Incializamos el motor de plantillas
app.set("views",`${__dirname}/views`); //Establecemos la ruta de vistas
app.set("view engine", "handlebars"); //Establecemos el motor de renderizado

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(`${__dirname}/public`)); //Establecemos el servidor estático de archivos, nos permite tener archivos css y js en plantillas

//Routes
app.use("/", viewsRouter);
app.use("/api/products", productRouter);
//app.use('/api/carts', cartRouter);

websocket(socketServer);


