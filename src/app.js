const {default : express} = await import ('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CREACION DE SERVIDOR
 * @returns
 */
app.listen(8080,console.log("Servidor backend corriendo en el puerto 8080"))

/**
 * ENDPONINT DE PRODUCTOS
 */
import routerProductos from './routes/productos.router.js';
app.use('/api/products', routerProductos);

/**
 * ENDPONINT DE CARRITO
 */
import routerCarritos from './routes/carritos.router.js';
app.use('/api/carts', routerCarritos);
