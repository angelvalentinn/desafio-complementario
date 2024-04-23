import { Router } from "express";
import { ProductManagerDB } from '../dao/productManagerDB.js';
import { CartManagerDB } from "../dao/cartManagerDB.js";
import { MessageManagerDB } from '../dao/messageManagerDB.js'
import productModel from "../dao/models/productModel.js";
import  { auth } from '../middlewars/auth.js';

const router = Router();

const PERSISTENT_PRODUCTS = new ProductManagerDB();
const PERSISTENT_CART = new CartManagerDB()
const messages = new MessageManagerDB();

router.get("/products", async (req, res) => {

    try {


        const { limit = '10', page = '1', query, sort } = req.query;

        const sortOrder = (sort === "desc" || sort === "-1") ? -1 : 1;

        const options = {

            sort: { price: sortOrder },

            page: parseInt(page),

            limit: parseInt(limit),

            lean: true

        };

        let q = {};

        if (query) {

            q = query === 'true' ? { status: true } :

            query === 'false' ? { status: false } :

            { category: query };

        }

        const result = await productModel.paginate(q, options);

        const baseURL = "http://localhost:8080/products";

        result.prevLink = result.hasPrevPage ? `${baseURL}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}` : "";

        result.nextLink = result.hasNextPage ? `${baseURL}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}` : "";

        result.isValid = page > 0 && page <= result.totalPages;

        result.status = 'success';

        result.payload = result.docs;

        
        res.render("home", {

            style: 'style.css',
            result: result,
            user: req.session.user,
            rol: req.session.user?.admin ? 'Admin' : 'User'

        })

    }

    catch (e) {

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

        for (let product of result.products) {
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

router.get("/login", (req, res) => {
    res.render(
        'login',
        {
            title: 'Login',
            style: 'style.css',
            failLogin: req.session.failLogin ?? false
        }
    )
});

router.get("/register", (req, res) => {
    res.render(
        'register',
        {
            title: 'Register',
            style: 'style.css',
            failRegister: req.session.failRegister ?? false
        }
    )
});

export default router;