import { Router } from "express";
import { ProductManagerDB } from '../dao/productManagerDB.js';

const router = Router();

const PERSISTENT_PRODUCTS = new ProductManagerDB("src/data/products.json");

router.get("/", async (req, res) => {

    res.render(
        "home",
        {
            style: 'style.css',
            products: await PERSISTENT_PRODUCTS.getProducts()
        }
    )

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