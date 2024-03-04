// Desafio entregable - Ángel Valentín Altieri
import  express  from 'express';
import  ProductManager from './productManager.js'

const app = express();

const productos = new ProductManager('src/productsManager.txt');


app.use(express.urlencoded({extended:true}))

/* 
    ruta ‘/products’, la cual debe leer el archivo de productos y devolverlos dentro
    de un objeto. Agregar el soporte para recibir por query param el valor ?limit= el
    cual recibirá un límite de resultados. 
*/

app.get("/products", async (req, res) => {

    const limit = req.query.limit;

    const users = await productos.getProducts();

    if(!limit) return res.send({users})

    res.send(users.slice(0, limit));

})


/* 
    ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver
    sólo el producto solicitado, en lugar de todos los productos.  
*/

app.get("/products/:pid", async (req, res) => {

    const id = req.params.pid;

    const users = await productos.getProducts();

    if(isNaN(id)) return res.send({error: 'Solo ids numericos'});

    const prod = users.find(user => user.id == id)

    if(prod) res.send({prod})
    else res.send({error: 'No se encontro el producto'})

})


const PORT = 8080;

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`))