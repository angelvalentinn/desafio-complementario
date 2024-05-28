import CartService from "../services/cartService.js";

const cartServices = new CartService();

class CartController {
    constructor() {}

    async getProducts(_req, res) {
        const carts = await cartServices.getCarts();
        res.send({status: 'success', payload: carts});
    };
    
    async getProductsFromCart(req, res) {
        try {
            const results = await cartServices.getProductsFromCart(req.params.cid);
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async addCart(_req, res) {
        try {
            const results = await cartServices.addCart();
            
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async addProduct(req, res) {
        console.log(req.params.cid, req.params.pid);
        try {
            const results = await cartServices.addProduct(req.params.cid, req.params.pid);

            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async deleteProduct(req, res) {
        try {
            const results = await cartServices.deleteProduct(req.params.cid, req.params.pid);
            
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async updateProduct(req, res) {
        try {

            const results = await cartServices.updateProduct(req.params.cid, req.body);
            
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async updateProductById(req, res) {
        try {
            
            const results = await cartServices.updateProductById(req.params.cid, req.params.pid, req.body.quantity);
            
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async deleteAllProducts(req, res) {
        try {
            const results = await cartServices.deleteAllProducts(req.params.cid);
    
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
}

export default CartController;
