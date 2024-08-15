const {default : express} = await import ('express');
const {default : handlebars} = await import ('express-handlebars');
const {default : __dirname} = await import ('./utils.js');
const {Server } = await import ('socket.io');

const app = express();
const PORT = 8088;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * CREACION DE SERVIDOR
 */
const httpServer = app.listen(PORT, console.log(`Servidor backend corriendo en el puerto ${PORT}`));



/**
 * CONEXION CON LA DB
 */
const {default : mongoose} = await import ('mongoose');

mongoose.connect("mongodb+srv://DevJavaSpring:2DkcRVg5zymMG9UC@cluster0.9juxmmh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("Conectado a la base de datos")
})
.catch(error => {
    console.error("Error al conectar con la base de datos", error)
})







/**
 * ENDPOINT DE PRODUCTOS
 */
import routerProductos from './routes/product.router.js';
app.use('/api/products', routerProductos);

/**
 * ENDPOINT DE CARRITO
 */
import routerCarritos from './routes/car.router.js';
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
const socketServer = new Server(httpServer);
const {default : http} = await import ('http');


socketServer.on('connection', socketServer => {
    console.log("Nuevo cliente conectado")
    

    socketServer.on('messageSERVER', data => {
        console.log("PETICION RECIBIDA DEL CLIENTE POR WEBSOCKET: Actualizar carrito con un producto")

        const endpoint = {
            hostname: '127.0.0.1',
            port: 8080,
            path: `/api/carts/${data.idCarrito}/product/${data.idProducto}`,
            method: 'POST',
        };

        const req = http.request(endpoint, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    socketServer.emit('messageCLIENT', responseData);
                    //const parsedData = JSON.parse(responseData);
                    //socket.emit('messageCLIENT', parsedData);
                } catch (error) {
                    console.error('Error al analizar los datos:', error);
                    socketServer.emit('messageCLIENT', { error: 'Error al analizar los datos' });
                }
            });
        });

        req.on('error', (error) => {
            console.error('Error en la solicitud HTTP:', error);
            socketServer.emit('messageCLIENT', { error: 'Error en la solicitud HTTP' });
        });

        req.end();
    })


    socketServer.on('messageQuitarProductSERVER', data => {
        console.log("PETICION RECIBIDA DEL CLIENTE POR WEBSOCKET: Quitar porducto del carrito")

        const endpoint = {
            hostname: '127.0.0.1',
            port: 8080,
            path: `/api/carts/${data.idCarrito}/product/${data.idProducto}`,
            method: 'DELETE',
        };

        const req = http.request(endpoint, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    socketServer.emit('messageQuitarProductCLIENT', responseData);
                } catch (error) {
                    console.error('Error al analizar los datos:', error);
                    socketServer.emit('messageQuitarProductCLIENT', { error: 'Error al analizar los datos' });
                }
            });
        });

        req.on('error', (error) => {
            console.error('Error en la solicitud HTTP:', error);
            socketServer.emit('messageQuitarProductCLIENT', { error: 'Error en la solicitud HTTP' });
        });

        req.end();
    })
});

