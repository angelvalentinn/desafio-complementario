import { Router } from 'express';
import { ProductManagerDB } from '../dao/productManagerDB.js';

const products = Router();

const PERSISTENT_PRODUCTS = new ProductManagerDB();

products.get('/', async (req, res) => {

    const result = await PERSISTENT_PRODUCTS.getProducts();

    res.send({
        status: "success",
        payload: result,
    });

})

products.get('/:pid', async (req, res) => {

    try {
        const result = await PERSISTENT_PRODUCTS.getProductByID(req.params.pid);
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

products.post('/', async (req, res) => {

    try {
        const result = await PERSISTENT_PRODUCTS.createProduct(req.body);

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

products.put('/:pid', async (req, res) => {

    try {
        const result = await PERSISTENT_PRODUCTS.updateProduct(req.params.pid, req.body);
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

products.delete("/:pid", async (req, res) => {

    try {
        const result = await PERSISTENT_PRODUCTS.deleteProduct(req.params.pid);
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

export default products;