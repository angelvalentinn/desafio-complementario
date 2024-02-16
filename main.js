// Pre entrega 1 backend - Ángel Valentín Altieri

class ProductManager {
	
	#id = 0;
	constructor(){
		this.products = []
	}

	addProduct(title,description,price,thumbanil,code,stock) {

		if(title && description && price && thumbanil && code && stock) {
			
			if(!this.products.some(product => product.code == code)) {

				this.products.push({title,description,price,thumbanil,code,stock,id:this.#id});
				this.#id++;

			}

		}

	}

	getProducts() {
		return this.products
	}

	getProductById(id) {
		if(this.products.some(prod => prod.id === id)) {
			return this.products.find(prod => prod.id === id);
		} else {
			console.log('Not found product');
		}
	}

}

const PRODUCTS = new ProductManager();

PRODUCTS.addProduct('leche','leche descremada',2000,'../leche.png',523,200);
PRODUCTS.addProduct('huevos','maplet de huevos',1200,'../huevos.png',523,200); //No lo agrega porque tienen mismo code
PRODUCTS.addProduct(3000,'../azucar.png',222,100); //No lo agrega porque faltan propiedades
PRODUCTS.addProduct('harina','harina leudante',2300,'../harina.png',456,100);
PRODUCTS.addProduct('yerba','yerba cbc',4000,'../yerba.png',178,70);

console.log(PRODUCTS.getProducts());
console.log(PRODUCTS.getProductById(1));
console.log(PRODUCTS.getProductById(29)); //No lo encuentra