import { Router } from 'express';
import { CartManagerDB } from '../dao/cartManagerDB.js';

const carts = Router();

const PERSISTENT_CART = new CartManagerDB();

carts.post('/', async (req, res) => {

    try {
        const result = await PERSISTENT_CART.createCart();
        res.send({
            status: "success",
            payload: result,
        });
    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message,
        });
    }
})

carts.get("/:cid", async (req, res) => {

    try {
        const result = await PERSISTENT_CART.getCartByID(req.params.cid);
        res.send({
            status: "success",
            payload: result,
        });
    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message,
        });
    }
})


carts.post("/:cid/product/:pid", async (req, res) => {

    try {
        const result = await PERSISTENT_CART.addProductByID(req.params.cid, req.params.pid);
        res.send({
            status: "success",
            payload: result,
        });
    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message,
        });
    }
})

export default carts;