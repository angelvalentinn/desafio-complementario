import { Router } from "express";
import { PERSISTENT_PRODUCTS } from '../routes/route.products.js';

const router = Router();

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