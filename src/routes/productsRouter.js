import { Router } from 'express';
import ProductController from '../controllers/productController.js';

const products = Router();

const PERSISTENT_PRODUCTS = new ProductController();

products.get('/', PERSISTENT_PRODUCTS.getProducts);
products.get('/:pid', PERSISTENT_PRODUCTS.getProductById);
products.post("/", PERSISTENT_PRODUCTS.addProducts);
products.put("/:pid",PERSISTENT_PRODUCTS.updateProduct);
products.delete("/:pid", PERSISTENT_PRODUCTS.deleteProduct);

export default products;