import ProductService from "../services/productService.js";

const productsService = new ProductService();

class ProductController {

    constructor() {}

    async getProducts(_req, res) {
        try {
            const products = await productsService.getProducts();
            res.send({status: 'success', payload: products});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    async getProductById(req, res) {
        try {
            const pid = req.params.pid;
            const products = await productsService.getProductById(pid);
            res.send({status: 'success', payload: products});
        } catch (error) {
            res.status(400).send({status: 'error', message: error.message});
        }
    }

    async addProducts(req, res) {
        try {
            const product = await productsService.addProducts(req.body);
            res.send({ status: 'success', payload: product });
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const pid = req.params.pid;
    
            const existingProduct = await productsService.getProductById(pid);
            
            if (!existingProduct) {
                return res.status(404).send({ message: "Producto no encontrado" }); 
            }
        
            if (req.body.id && req.body.id !== pid) {
                return res.status(400).send({ message: "el id del producto debe coincidir con el id de la url" });
            }

            await productsService.updateProduct(pid, req.body);
            return res.status(200).send({ message: "Producto actualizado correctamente" });
        } catch (error) {
            res.status(500).send('No se pudo actualizar el producto');
        }
    }

    async deleteProduct(req, res) {
        try{
            const pid = req.params.pid;
            const product = await productsService.getProductById(pid);

            if (!product) {
                res.status(404).send({ message: "Producto no encontrado" });
                return;
            }
        
            await productsService.deleteProduct(pid);
            res.status(200).send({ message: "Producto eliminado correctamente" });
        } catch (error) {
            res.status(500).send('No se pudo borrar el producto');
        }
    }
}

export default ProductController;