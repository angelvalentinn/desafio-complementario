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
            status: 'success',
            payload: result
        })
        
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

carts.delete("/:cid/product/:pid", async (req,res) => {

    try {
        
        const result = await PERSISTENT_CART.deleteProductOnCart(req.params.cid, req.params.pid);
        res.send({
            status: 'success',
            payload: result
        })

    } catch(e) {

        res.status(400).send({
            status: "error",
            message: e.message,
        });

    }

})

carts.put("/:cid", async (req, res) => {
    
    try {
        const result = await PERSISTENT_CART.updateCart(req.params.cid, req.body);
        res.send({
            status: "success",
            payload: result,
        });

    } catch (e) {
        res.status(400).send({
            status: "error",
            message: e.message,
        });
    }

})

carts.put("/:cid/product/:pid", async (req,res) => {

    try {
        if(!req.body.quantity) throw new Error('Debe ingresar la cantidad en body: {quantity: value}');
        const result = await PERSISTENT_CART.updateProductQuantityOnCart(req.params.cid, req.params.pid, req.body.quantity);
        res.send({
            status: "success",
            payload: result,
        });

    } catch (e) {
        res.status(400).send({
            status: "error",
            message: e.message,
        });
    }

})

//deberá eliminar todos los productos del carrito 
carts.delete("/:cid", async (req,res) => {
    try {
        const result = await PERSISTENT_CART.deleteProductsOnCart(req.params.cid);
        res.send({
            status: "success",
            payload: result,
        });

    } catch (e) {
        res.status(400).send({
            status: 'error',
            message: e.message
        });
    }
})

export default carts;