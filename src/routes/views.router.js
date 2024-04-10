import { Router } from "express";
import { ProductManagerDB } from '../dao/productManagerDB.js';
import { MessageManagerDB } from '../dao/messageManagerDB.js'

const router = Router();

const PERSISTENT_PRODUCTS = new ProductManagerDB("src/data/products.json");
const messages = new MessageManagerDB();

router.get("/", async (req, res) => {

    res.render(
        "home",
        {
            style: 'style.css',
            products: await PERSISTENT_PRODUCTS.getProducts()
        }
    )

});

router.get("/chat", async (req, res) => {

    res.render("chat", {
        style: "chat.css",
        mesagges: await messages.getMessages(),
    });

});

router.get("/realtimeproducts", async (req, res) => {

    res.render(
        "realTimeProducts",
        {
            style: 'style.css',
            products: await PERSISTENT_PRODUCTS.getProducts()
        }
    )

})

export default router;