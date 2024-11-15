import {Router} from 'express';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const {default : carServices} = await import ('../services/CarServices.js');
const {default : productServices} = await import ('../services/ProductServices.js');
const routerViews = Router();


routerViews.get('/', (req, res) => {
    carServices.obtenerInventario()
    .then((carArray) => {
        res.render('home', {
            user: "admin",
            carritosArray: carArray
        });
    })
    .catch((error) => {
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta", message:error});
    })
})

routerViews.get('/realTimeProducts', (req, res) => {
    carServices.obtenerInventario()
    .then((carArray) => {
        productServices.obtenerInventarioTotal()
        .then((productArray) => {
            res.render('realTimeProducts', {
                carritosArray: carArray,
                productosArray: productArray,
            });
        })
        .catch((error) => {
            return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta de productos", message:error});
        })
    })
    .catch((error) => {
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta de carritos", message:error});
    })
})

routerViews.get("/obtenerProductosPorCarrito/:cid",  (req, res)=>{
    carServices.buscarCarritoPorIdConProyeccionEnProducts(req.params.cid)
    .then((carrito) => {
        let productos = carrito.products;
        res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
        return  res.json(productos);

    })
    .catch((error) => {
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta de productos para el carrito "+ req.params.cid, message:error});
    })
});

routerViews.get('/login', isNotAuthenticated, (req, res) => {
    if(!req.query.nuevoUsuario){
        res.render('login', { alertNewUser: false });
    } else {
        res.render('login', { alertNewUser: true });
    }
})

const {default : User} = await import ('../persistence/models/User.model.js');
routerViews.get('/register', isNotAuthenticated, (req, res) => {
    const roleENUMArray = User.schema.path('role').enumValues;
    res.render('register', {roleENUMArray: roleENUMArray});
});

routerViews.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});

export default routerViews;
