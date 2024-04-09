import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./util.js";
import viewsRouter from "./routes/views.router.js";
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

//Incializamos el motor de plantillas
app.engine("handlebars", handlebars.engine());

//Establecemos la ruta de vistas
app.set("views",`${__dirname}/views`)

//Establecemos el motor de renderizado
app.set("view engine", "handlebars");

//Establecemos el servidor estático de archivos, nos permite tener archivos css y js en plantillas
app.use(express.static(`${__dirname}/public`));

app.use("/", viewsRouter);

websocket(socketServer);


