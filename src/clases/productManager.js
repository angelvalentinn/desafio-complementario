import {writeFileSync, readFileSync, existsSync} from 'fs'

export default class ProductManager {

	constructor(path) {
		this.products = []
		this.path = path
	}

	addProduct({title, description, price, thumbnail, code, stock, status, category}) {

		const productsOnFile = this.getProducts();

		if (title && description && price && code && stock && category) {

			if (productsOnFile.some(product => product.code == code)) return console.error('error, código ya existente');
	
			else {

				productsOnFile.push({title, description, price, thumbnail, code, stock, status: true, category , id:parseInt(this.#getLastId()) + 1})

				writeFileSync(this.path, JSON.stringify(productsOnFile, null, "\t"));

			}

		} else return console.error('error, todos los campos son obligatorios');

	}

	getProducts() {
		if( existsSync(this.path) ) return JSON.parse(readFileSync(this.path, 'utf-8'))
		else return this.products
	}

	getProductById(id) {
		if(this.getProducts().some(prod => prod.id === id)) {
			return this.getProducts().find(prod => prod.id === id)
		} else {
			return console.error(`Producto con el id:${id} no encontrado`);
		}
	}

	updateProduct(id, updatedObject) {
	
		let productosOnFile = this.getProducts();

		let idProd = productosOnFile.findIndex(prod => prod.id == id);

		if(idProd) {
			productosOnFile[idProd] = {...updatedObject, id}
		} else {
			console.error(`No se encontro el producto con id ${id} a actualizar`);
		}


		writeFileSync(this.path, JSON.stringify(productosOnFile, null, "\t"));
	}

	deleteProduct(id) {
		const products = this.getProducts().filter(prod => prod.id != id);
		writeFileSync(this.path, JSON.stringify(products, null,  "\t"));
	}

	#getLastId() {
		if(this.getProducts().length == 0) return 0
		return this.getProducts()[this.getProducts().length - 1].id
	}
}


