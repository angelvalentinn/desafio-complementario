// Pre entrega 2 backend - Ángel Valentín Altieri :)
const FS = require('fs');

class ProductManager {

	constructor(path) {
		this.products = []
		this.path = path
	}

	addProduct({title, description, price, thumbnail, code, stock}) {

		const productsOnFile = this.getProducts();

		if (title && description && price && thumbnail && code && stock) {

			if (productsOnFile.some(product => product.code == code)) return console.error('error, código ya existente');
	
			else {

				productsOnFile.push({title, description, price, thumbnail, code, stock, id:this.#getLastId() + 1})

				FS.writeFileSync(this.path, JSON.stringify(productsOnFile));

			}

		} else return console.log('error, todos los campos son obligatorios');

	}

	getProducts() {
		if( FS.existsSync(this.path) ) return JSON.parse(FS.readFileSync(this.path, 'utf-8'))
		else return this.products
	}

	getProductById(id) {
		if(this.getProducts().some(prod => prod.id === id)) {
			return this.getProducts().find(prod => prod.id === id)
		} else {
			return console.error(`Producto con el id:${id} no encontrado`);
		}
	}

	updateProduct(id, {field, value}) {
		
		const productosOnFile = this.getProducts()

		const prod = productosOnFile.find(prod => prod.id === id);

		if(prod) {

			if(prod[field]) prod[field] = value;
			
			else console.error('Campo a actualizar erroneo')

		} else {
			console.error(`No se encontro el producto con id ${id} a actualizar`);
		}

		FS.writeFileSync(this.path, JSON.stringify(productosOnFile));
	}

	deleteProduct(id) {
		const products = this.getProducts().filter(prod => prod.id !== id);
		console.log(products);
		FS.writeFileSync(this.path, JSON.stringify(products));
	}

	#getLastId() {
		if(this.getProducts().length == 0) return 0
		return this.getProducts()[this.getProducts().length - 1].id
	}
}

const productos = new ProductManager('productManager.txt');

productos.addProduct({
	title: 'Vainillin',
	description: 'Vainillin',
	price: 700,
	thumbnail: './vainillin.png',
	code: 110,
	stock:90
});

productos.addProduct({
	title: 'Harina',
	description: 'Harina 0000',
	price: 2100,
	thumbnail: './harina.jpg',
	code: 910,
	stock: 60
});

productos.addProduct({
	title: 'Huevos',
	description: 'Maplet de huevos',
	price: 3200,
	thumbnail: './huevos.webp',
	code: 10,
	stock: 320
});

productos.addProduct({
	title: 'Fernet',
	description: 'Fernet Branca 1L',
	price: 8000,
	thumbnail: './fernet.png',
	code: 450,
	stock: 450
});

//productos.updateProduct(4, {field: 'thumbnail', value: '../fernet_actualizado.png'})

//productos.deleteProduct(5)

console.log(productos.getProducts())

