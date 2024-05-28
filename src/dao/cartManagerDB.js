import cartModel from '../models/cartModel.js'
import productModel from '../models/productModel.js';

class CartManagerDB {

    async getCarts() {
        try {
            const result =  await cartModel.find().populate('products.productId');
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al obtener los carritos");
        }
    }

    async getCartByID(cid) {
        try {
            const cart = await cartModel.findOne({ _id: cid }).populate('products.productId');
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
    
    async addProductByID(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);

            if (!cart) {
                throw new Error(`Cart ${cid} no encontrado`);
            }

            const product = await productModel.findOne({ _id: pid });

            if (product) {
                const existingProduct = cart.products.find((cartProduct) => cartProduct.productId == pid);

                if (existingProduct) {
                    existingProduct.quantity = existingProduct.quantity + 1;
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

    async deleteProductOnCart(cid, pid) {

        try {
        
            const cart = await this.getCartByID(cid);

            const product = await productModel.findOne({ _id: pid });

            if(product) {
                
                const i = cart.products.findIndex(cartProduct => cartProduct.productId == pid);
                
                if (i !== -1) {

                    cart.products.splice(i, 1);
                    
                    await cart.save();
                    
                    return "Producto eliminado correctamente del carrito";
                
                } else {
                    throw new Error(`Producto con ID ${pid} no encontrado en el carrito`);
                }

            } else {
                throw new Error (`Producto con ID ${pid} no encontrado`);
            }

        } catch(e) {
            console.log(error);
            throw new Error("Error al eliminar un producto en un carrito", e.message);
        }
    }

    async updateCart(cid, productsUpdate) {

        try {
            const cart = await this.getCartByID(cid);

            //Validamos que los productos tengan el id del producto y quantity obligatoriamente, si tienen propiedades demas se actualiza igual pero en la DB no se ingresan
            for (const product of productsUpdate) {
                if(!product.productId || !product.quantity) {
                    throw new Error("El esquema de los productos debe tener quantity y el id del producto!");
                }
            }

            cart.products = productsUpdate;

            cart.save();

            return `Productos actualizados correctamente del carrito ${cid}`;
        
        } catch(e) {
            throw new Error('Error al actualizar los productos del carrito ', cid, e.message);
        }

    }

    async updateProductQuantityOnCart(cid, pid, quantityUpdate) {

        try {

            const cart = await this.getCartByID(cid);

            const product = await productModel.findOne({ _id: pid });
            if(product) {

                const p = cart.products.find(cartProduct => cartProduct.productId == pid);
                
                if(p) {
                    p.quantity = quantityUpdate;

                    cart.save();

                    return `Cantidad del producto ${pid} actualizada correctamente`;
                } else {
                    throw new Error(`No se encontro el producto ${pid} dentro del carrito ${cid}`);
                }

            } else {
                throw new Error('No se encontro el producto');
            }

        } catch (e) {
            throw new Error(`Error al actualizar la cantidad del producto ${pid}, ${e.message}`);
        }

    }

    async deleteProductsOnCart(cid) {
        
        try {
            const cart = await this.getCartByID(cid);

            cart.products = [];

            cart.save();

            return `Productos eliminados correctamente del carrito ${cid}`

        } catch(e) {
            throw new Error(`Error al eliminar los productos en el carrito ${cid}`);
        }
    }

}

export { CartManagerDB };