const {default : express} = await import ('express');
const {default : handlebars} = await import ('express-handlebars');
const {default : __dirname} = await import ('./utils.js');
const {Server } = await import ('socket.io');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * CREACION DE SERVIDOR
 */
const httpServer = app.listen(PORT, console.log(`Servidor backend corriendo en el puerto ${PORT}`))

/**
 * ENDPOINT DE PRODUCTOS
 */
import routerProductos from './routes/productos.router.js';
app.use('/api/products', routerProductos);

/**
 * ENDPOINT DE CARRITO
 */
import routerCarritos from './routes/carritos.router.js';
app.use('/api/carts', routerCarritos);

/**
 * CONFIGURACION DE HANDLEBARS
 */
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

import routerViews from './routes/views.router.js';
app.use('/', routerViews);

/**
 * CONFIGURACION DE SOCKET
 */

const socketServer = new Server(httpServer)

socketServer.on('connection', socketServer => {
    console.log("Nuevo cliente conectado")

    socketServer.on('messageCLIENT', data => {
        console.log('Mensaje RECIBIDO DESDE CLIENTE: '+ data);

        socketServer.emit('messageSERVER', "mensaje enviado desde SERVIDOR");
    })
});