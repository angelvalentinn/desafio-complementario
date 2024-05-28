import ProductDao from '../dao/productDao.js';

class ProductService {

    constructor() {
        this.productDao = new ProductDao();
    }

    async getProducts() {
        try {
            return await this.productDao.getProducts();
        } catch (error) {
            throw new Error("Error al traer los productos!");
        }
    }    

    async getProductById(pid) {
        try {        
            return await this.productDao.getProductByID(pid);
        } catch (error) {
            throw new Error(`Producto con ${pid} no existe!`);
        }
    }

    async addProducts(product) {
        try {
            return await this.productDao.addProducts(product);
        } catch (error) {
            throw new Error("Error al agregar el producto");
        }
    }

    async updateProduct(pid, productUpdate) {
        try {
            return await this.productDao.updateProduct(pid, productUpdate);
        } catch(error) {
            throw new Error('Error al actualizar el producto!');
        }
    }

    async deleteProduct(pid) {
        try {
            return await this.productDao.deleteProduct(pid);
        } catch(error) {
            throw new Error(`Error al borrar el producto con id: ${pid}`);
        }
    }
}

export default ProductService;