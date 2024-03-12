import {writeFileSync, readFileSync, existsSync} from 'fs'
import { isObject } from 'util';

export default class CartManager {

	constructor(path) {
		this.products = []
		this.path = path
	}

	addCart(products) {

		const cartsOnFile = this.getCarts();

        cartsOnFile.push({id: parseInt(this.#getLastId()) + 1, products});

		writeFileSync(this.path, JSON.stringify(cartsOnFile, null, "\t"));
	}

	getCarts() {
		if( existsSync(this.path) ) return JSON.parse(readFileSync(this.path, 'utf-8'))
		else return this.products
	}

	getCart(id) {
		if( existsSync(this.path) ) {
			const carts = this.getCarts();

			const cart = carts.find(cart => cart.id == id);

			if(!cart) return null

			return cart
		
		} else {
			return null
		}
	}

	addProductOnCart(cartId, productId) {

		const cartsOnFile = this.getCarts();

		const cart = cartsOnFile.find(cart => cart.id == cartId)

		if(cart) {
			
			if(cart.products.some(product => product.productId == productId)) {
				const index = cart.products.findIndex(product => product.productId == productId);
				cart.products[index].quantity++;
			} else {
				cart.products.push({productId: parseInt(productId), quantity: 1})
			}

		}

		writeFileSync(this.path, JSON.stringify(cartsOnFile, null, "\t"));

	}

	#getLastId() {
		if(this.getCarts().length == 0) return 0
		return this.getCarts()[this.getCarts().length - 1].id
	}
}


