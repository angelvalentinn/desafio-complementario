import { Router } from 'express';
import ProductManager from '../clases/productManager.js';

const products = Router();

const PERSISTENT_PRODUCTS = new ProductManager('src/data/products.json');

products.get('/', async (req,res) => {

    try {
        const limit = req.query.limit;

        const products = await PERSISTENT_PRODUCTS.getProducts();

        if(!limit) return res.send({products})

        res.send({products: products.slice(0, limit)});
    
    } catch(e) {
        res.send(e)
    }

})

products.get('/:pid', async (req,res) => {

    try {
        const id = req.params.pid;

        const users = await PERSISTENT_PRODUCTS.getProducts();

        const prod = users.find(user => user.id == id)

        if(!prod) throw {status: 404, message: 'Producto no encontrado'}

        res.send({prod})
    
    } catch(e) {
        res.status(e.status).send(e);
    }

})

products.post('/', async (req,res) => {

    try {

        const { title, description, code, price, status, stock, category, thumbnails } = req.body;

        if( !title || !description || !code || !price || !status || !stock || !category ) throw {status: 400, message: 'Faltan datos para crear el producto'}
        
        PERSISTENT_PRODUCTS.addProduct({ title, description, code, price, status, stock, category, thumbnails });

        res.status(201).send({message: 'Producto creado correctamente!'});
    
    } catch(e) {
        res.status(e.status).send(e);
    }

})

products.put('/:pid', async(req,res) => {

    try {
        const {title, description, price, code, stock, status, category} = req.body;

        const id = req.params.pid;

        const products = await PERSISTENT_PRODUCTS.getProducts();

        const prod = products.find(prod => prod.id == id);

        if(!prod) throw {status: 404, message: 'No se encontró el producto'};

        if(!title || !description || !price || !code || !stock || !status || !category) throw {status: 400, message: 'Faltan campos para actualizar el producto'}

        if(req.body.id) throw {status: 404, message: 'No puedes alterar el id del producto'};
        
        await PERSISTENT_PRODUCTS.updateProduct(id, req.body);

        res.status(201).send({message: 'Objeto actualizado correctamente!'});

    } catch(error) {
        res.status(error.status).send(error);
    }

})

products.delete("/:pid", async (req,res) => {

    try {
        const id = req.params.pid;

        const prod = await PERSISTENT_PRODUCTS.getProducts().find(product => product.id == id)

        if(!prod) throw {status: 400, message:'No se encontro el producto!'};

        await PERSISTENT_PRODUCTS.deleteProduct(id);

        res.send({message: 'Producto borrado con exito'})

    } catch(e) {
        res.status(e.status).send(e)
    }

})

export default products;