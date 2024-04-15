import { Router } from "express";
import { ProductManagerDB } from '../dao/productManagerDB.js';
import { CartManagerDB } from "../dao/cartManagerDB.js";
import { MessageManagerDB } from '../dao/messageManagerDB.js'
import productModel from "../dao/models/productModel.js";

const router = Router();

const PERSISTENT_PRODUCTS = new ProductManagerDB();
const PERSISTENT_CART = new CartManagerDB()
const messages = new MessageManagerDB();

router.get("/", async (req, res) => {
    
    try {
        const { limit, page, query, sort } = req.query;
        
        const sortOrder = (sort == "desc" || sort == -1) ? -1 : (sort == "asc" || sort == 1) ? 1 : null;

        const options = {
            sort: sortOrder ? {price: sortOrder} : {},
            page: page ? parseInt(page) : 1, 
            limit: limit ? parseInt(limit) : 10,
            lean: true
        }

        let q = {};
        if(query) {
            if(query != 'false' && query != 'true') {
                q = {category: query}
            } else {
                if(query == 'true') {
                    q = {status: true}
                } else if(query == 'false') {
                    q = {status: false}
                }
            }
        }

        const result = await productModel.paginate(q, options);

        const baseURL = "http://localhost:8080";
        result.prevLink = result.hasPrevPage ? `${baseURL}?${sortOrder ? `sort=${sortOrder}&` : ''}page=${result.prevPage}&limit=${limit}` : "";
        result.nextLink = result.hasNextPage ? `${baseURL}?${sortOrder ? `sort=${sortOrder}&` : ''}page=${result.nextPage}&limit=${limit}` : "";
        result.isValid = !(page <= 0 || page > result.totalPages);
        result.status = 'success';
        result.payload = result.docs;

        res.render(
            "home",
            {
                style: 'style.css',
                result: result
            }
        )
    }
    catch(e) {
        res.status(500).send({
            status: 'error',
            message: e.message
        })
    }

});

router.get("/chat", async (req, res) => {

    res.render("chat", {
        style: "chat.css",
        mesagges: await messages.getMessages(),
    });

});

router.get("/carts/:cid", async (req, res) => {

    try {
        const result = await PERSISTENT_CART.getCartByID(req.params.cid);

        let products = [];

        for(let product of result.products) {
            products.push({
                title: product.productId.title,
                description: product.productId.description,
                price: product.productId.price,
                code: product.productId.code,
                category: product.productId.category,
                id: product.productId.id
            })
        }

        res.render( 
            "detailCart",
            {
                style: 'style.css',
                products
            }
        )
    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message,
        });

    }
})

router.get('/products/:pid', async (req, res) => {

    try {
        const result = await PERSISTENT_PRODUCTS.getProductByID(req.params.pid);
        
        const product = {
            title: result.title,
            description: result.description,
            price: result.price,
            code: result.code,
            id: result.id,
            category: result.category
        }
        res.render(
            "detailProduct",
            {
                style: 'style.css',
                product
                
            }
        )

    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message,
        });
    }



})

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