import { Router } from 'express';
import { CartManagerFS} from '../dao/cartManagerFS.js';

const carts = Router();

const CART_PERSISTENT = new CartManagerFS('src/data/carts.json');

carts.post('/', async (req,res) => {

    try {

        //Si no se pasa el array de productos por body devuelve {}, entonces lo convierto a array
        await CART_PERSISTENT.addCart(Array.from(req.body));

        res.send({message: 'Cart creado correctamente'});
    
    } catch(e) {
        res.send(e);
    }
})

carts.get("/:cid", async (req,res) => {

    try {

        const id = req.params.cid

        const cart = await CART_PERSISTENT.getCart(id);

        if(!cart) throw {status:404, message: 'Cart no encontrado'};

        res.send({cart})

    } catch(e) {
        res.status(e.status).send(e)
    }

})

carts.post("/:cid/product/:pid", async (req,res) => {

    try {

        const { cid, pid } = req.params;

        const cart = await CART_PERSISTENT.getCart(cid);

        if(!cart) throw {status: 404, message: 'Cart no encontrado'}

        await CART_PERSISTENT.addProductOnCart(cid, pid);

        res.send({message: `producto con id ${pid} añadido correctamente al carrito con id ${cid}`})

    
    } catch(e) {
        res.send(e);
    }
})

export default carts;