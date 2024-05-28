import CartDao from '../dao/cartDao.js';

class CartService {

    constructor() {
        this.cartDAO = new CartDao();
    }

    async getCarts() {
        try {
            return await this.cartDAO.getCarts();
        } catch (error) {
            throw new Error("Error al buscar los carritos!");
        }
    }

    async getProductsFromCart(cartId) {
        const cart = await this.cartDAO.getCartByID(cartId);
        if (!cart) {
            throw new Error(`Carrito ${cartId} no encontrado!`);
        }
        return cart;
    }

    async addCart() {
        try {
            const cart = await this.cartDAO.addCart();
            return cart;
        } catch (error) {
            throw new Error("Error al crear carrito");
        }
    }

    async addProduct(cartId, productId) {
        try {
            const cart = await this.cartDAO.addProductByID(cartId, productId);
            return cart;
        } catch (error) {
            throw new Error("Error al añadir carrito");
        }
    }

    async deleteProduct(cartId, productId) {
        try {
            return await this.cartDAO.deleteProductOnCart(cartId, productId);
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(cartId, updateProduct) {
        try {
            const cart = await this.cartDAO.updateProduct(cartId, updateProduct);
            return cart;
        } catch (error) {
            throw new Error("Error al actualizar carrito");
        }
    }

    async updateProductById(cartId, productId, quantity) {
        try {
            const cart = await this.cartDAO.updateProductQuantityOnCart(cartId, productId, quantity);
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar el carrito ${cartId}` + error.message);
        }
    }
}

export default CartService;