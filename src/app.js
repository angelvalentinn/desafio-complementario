import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./util.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import { PERSISTENT_PRODUCTS } from './routes/route.products.js';

const app = express();

const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`) );

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

socketServer.on('connection', async (socket) => {

    console.log('Nuevo cliente conectado');

    await updateProducts()

    deleteProduct();

    createProduct();


    function createProduct() {
        socket.on("createProduct", async (product) => {
            await PERSISTENT_PRODUCTS.addProduct(product)
            updateProducts();
        })
    }
    
    function deleteProduct() {
        socket.on("deleteProduct", async (id) => {
            await PERSISTENT_PRODUCTS.deleteProduct(id)
            await updateProducts();
        })
    }

    async function updateProducts() {
        socket.emit("products",  await PERSISTENT_PRODUCTS.getProducts());
    }

})


