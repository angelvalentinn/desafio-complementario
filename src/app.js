import  express  from 'express';
import productsRouter from './routes/route.products.js';
import cartsRouter from './routes/route.carts.js';

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const PORT = 8080;

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`))