import { Router } from 'express';
import ProductController from '../controllers/productController.js';

const products = Router();

const PERSISTENT_PRODUCTS = new ProductController();

products.get('/', PERSISTENT_PRODUCTS.getProducts);
products.get('/:pid', PERSISTENT_PRODUCTS.getProductById);
products.post("/", PERSISTENT_PRODUCTS.addProducts);
products.put("/:pid",PERSISTENT_PRODUCTS.updateProduct);
products.delete("/:pid", PERSISTENT_PRODUCTS.deleteProduct);

/* products.get('/', async (req, res) => {

    const result = await PERSISTENT_PRODUCTS.getProducts();

    const { limit, page, query, sort } = req.query;
        
    const sortOrder = (sort == "desc" || sort == -1) ? -1 : (sort == "asc" || sort == 1) ? 1 : 1;

    const options = {
        sort: {price: sortOrder},
        page: page ? parseInt(page) : 1, 
        limit: limit ? parseInt(limit) : 10,
        lean: true
    }

    const resultPaginate = await productModel.paginate({}, options);

    const baseURL = "http://localhost:8080";
    resultPaginate.prevLink = resultPaginate.hasPrevPage ? `${baseURL}?page=${resultPaginate.prevPage}&limit=${limit}` : "";
    resultPaginate.nextLink = resultPaginate.hasNextPage ? `${baseURL}?page=${resultPaginate.nextPage}&limit=${limit}` : "";
    resultPaginate.isValid = !(page <= 0 || page > resultPaginate.totalPages);
    resultPaginate.status = 'success';
    resultPaginate.payload = resultPaginate.docs;

    res.send({
        status: "success",
        payload: result,
        totalPages: resultPaginate.totalPages,
        prevPage: resultPaginate.prevPage,
        nextPage: resultPaginate.nextPage,
        page: resultPaginate.page,
        hasPrevPage: resultPaginate.hasPrevPage,
        hasNextPage: resultPaginate.hasNextPage,
        prevLink: resultPaginate.prevLink ? resultPaginate.prevLink : null,
        nextLink: resultPaginate.nextLink ? resultPaginate.nextLink : null
    });

})

products.get('/:pid', async (req, res) => {

    try {
        const result = await PERSISTENT_PRODUCTS.getProductByID(req.params.pid);

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
 */
export default products;