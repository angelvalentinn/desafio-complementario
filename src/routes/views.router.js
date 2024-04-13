import { Router } from "express";
import { ProductManagerDB } from '../dao/productManagerDB.js';
import { MessageManagerDB } from '../dao/messageManagerDB.js'
import productModel from "../dao/models/productModel.js";

const router = Router();

const PERSISTENT_PRODUCTS = new ProductManagerDB("src/data/products.json");
const messages = new MessageManagerDB();

router.get("/", async (req, res) => {
    
    const { limit, page } = req.query;
    
    const result = await productModel.paginate({}, {page: page ?? 1, limit: limit ?? 2 , lean: true});

    const baseURL = "http://localhost:8080";
    result.prevLink = result.hasPrevPage ? `${baseURL}?page=${result.prevPage}` : "";
    result.nextLink = result.hasNextPage ? `${baseURL}?page=${result.nextPage}` : "";
    result.isValid = !(page <= 0 || page > result.totalPages);
    console.log(result)

    res.render(
        "home",
        {
            style: 'style.css',
            result: result
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