import { Router } from 'express';
import CartController from '../controllers/cartController.js';

const PERSISTENT_CART = new CartController();
const carts = Router();

carts.get('/', PERSISTENT_CART.getProducts);
carts.get('/:cid', PERSISTENT_CART.getProductsFromCart);
carts.post('/', PERSISTENT_CART.addCart);
carts.post('/:cid/products/:pid', PERSISTENT_CART.addProduct);
carts.delete('/:cid/products/:pid', PERSISTENT_CART.deleteProduct);
carts.put('/:cid', PERSISTENT_CART.updateProduct);
carts.put('/:cid/products/:pid', PERSISTENT_CART.updateProductById);

export default carts;