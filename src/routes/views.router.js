import {Router} from 'express';

const {default : ManagerCarritos} = await import ('../../manager/ManagerCarritos.js');
const {default : ManagerProductos} = await import ('../../manager/ManagerProductos.js');
const routerViews = Router();


routerViews.get('/', (req, res) => {
    let carritosArray = ManagerCarritos.obtenerInventario();

    res.render('home', {
        user: "admin",
        carritosArray: carritosArray
    })
})

routerViews.get("/obtenerProductosPorCarrito/:cid",  (req, res)=>{
    let carritos = ManagerCarritos.buscarCarritoPorId(Number(req.params.cid));
    let productos = carritos[0].products;

    productos.forEach(p => {
        let producto = ManagerProductos.buscarProductoPorId(Number(p.product));
        p.title = producto[0].title;
        p.description = producto[0].description;
        p.code = producto[0].code;
        p.price = producto[0].price;
        p.category = producto[0].category;   
    });
    
    res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    return  res.json(productos);
});

export default routerViews;
