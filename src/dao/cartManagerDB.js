import cartModel from './models/cartmodel.js'
import productModel from './models/productModel.js';

class CartManagerDB {
    async getCarts() {
        try {
            return await cartModel.find();
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al obtener los carritos");
        }
    }


    async getCartByID(cid) {
        try {
            const cart = await cartModel.findOne({ _id: cid });
            if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado :(`);
            return cart;
        } catch (error) {
            console.error(error.message);
            throw new Error("El carrito no existe");
        }
    }

    async createCart() {
        try {
            const newCart = await cartModel.create({ products: [] });
            return newCart;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al crear carrito");
        }
    }
    //implementar
    async addProductByID(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);

            if (!cart) {
                throw new Error(`Cart ${cid} no encontrado`);
            }

            const product = await productModel.findOne({ _id: pid });

            if (product) {
                const existingProduct = cart.products.find((cartProduct) => cartProduct.product === pid);

                if (existingProduct) {
                    existingProduct.quantity++;
                } else {
                    cart.products.push({ productId: pid, quantity: 1 });
                }

                await cart.save();

                return "Producto añadido correctamente";
            } else {
                return `Producto con ID ${pid} no encontrado`;
            }
        } catch (error) {
            console.log(error);
            throw new Error("Error al añadir el producto al carrito");
        }
    }
}

export { CartManagerDB };