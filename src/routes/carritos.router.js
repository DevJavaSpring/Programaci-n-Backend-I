import {Router} from 'express';

const {default : ManagerCarritos} = await import ('../../manager/ManagerCarritos.js');
const {default : ManagerProductos} = await import ('../../manager/ManagerProductos.js');
const routerCarritos = Router();

/**
 * ENDPONINT DE CARRITO
 */
routerCarritos.post("/",  (req, res)=>{
    let carritoId = ManagerCarritos.crearNuevoCarrito();

    return res.status(200).send({status:"Exito", message:"Se ha creado un nuevo carrito de compras con id: "+ carritoId +"."});
});

routerCarritos.get("/:cid",  (req, res)=>{
    if(isNaN(req.params.cid)){
        return res.status(400).send({error: 400, status:"Parametro desconocido", message:"Parametro desconocido, el parametro debe ser numerico"})
    }

    let carritos = ManagerCarritos.buscarCarritoPorId(Number(req.params.cid));

    if(carritos.length === 0){
        return res.status(404).send({error: 404, status:"Carrito No enecontrado", message:"No existe un carrito con la id ingresada"})
    }

    if(carritos.length >= 2){
        return res.status(500).send({error: 500, status:"Ambiguedad", message:"Existen mas de un carrito con la misma id, comuniquese con el administrador de la bd"})
    }

    if(carritos[0].products.length === 0){
      return res.status(200).send({status:"Carrito Encontrado", message:"El carrito seleccionado, no contiene ningun producto."});
    }

    return res.status(200).send(carritos[0].products);
});

routerCarritos.post("/:cid/product/:pid",  (req, res)=>{
    if(isNaN(req.params.cid) || isNaN(req.params.pid) ){
        return res.status(400).send({error: 400, status:"Parametro desconocido", message:"Parametro desconocido, los parametros debn ser numerico"})
    }



    let productos = ManagerProductos.buscarProductoPorId(Number(req.params.pid));

    if(productos.length === 0){
        return res.status(404).send({error: 404, status:"Producto No enecontrado", message:"No existe un producto con la id ingresada"})
    }

    if(productos.length >= 2){
        return res.status(500).send({error: 500, status:"Ambiguedad", message:"Existen mas de un producto con la misma id, comuniquese con el administrador de la bd"})
    }



    let carritos = ManagerCarritos.buscarCarritoPorId(Number(req.params.cid));

    if(carritos.length === 0){
        return res.status(404).send({error: 404, status:"Carrito No enecontrado", message:"No existe un carrito con la id ingresada"})
    }

    if(carritos.length >= 2){
        return res.status(500).send({error: 500, status:"Ambiguedad", message:"Existen mas de un carrito con la misma id, comuniquese con el administrador de la bd"})
    }



    let nuevoProducto = true;

    carritos[0].products.forEach((p) => {
        if(p.product === Number(req.params.pid)){
            p.quantity = (p.quantity + 1);
            nuevoProducto = false;
        }
    });

    if(nuevoProducto){
      carritos[0].products.push(
          {
            "product": Number(req.params.pid),
            "quantity": 1
          }
      );
    }

    carritos[0].products.sort(((a, b) => a.product - b.product));

    ManagerCarritos.actualizarProductosPorCarritoId(Number(req.params.cid), carritos[0].products);

    return res.status(200).send({
        status:"Exito", 
        message:"Se ha actualizado los productos de carrito con ID: "+ Number(req.params.cid), 
        carritoActualizado: ManagerCarritos.buscarCarritoPorId(Number(req.params.cid))[0]
    });
});

routerCarritos.delete("/:cid/product/:pid",  (req, res)=>{
    if(isNaN(req.params.cid) || isNaN(req.params.pid) ){
        return res.status(400).send({error: 400, status:"Parametro desconocido", message:"Parametro desconocido, los parametros debn ser numerico"})
    }



    let productos = ManagerProductos.buscarProductoPorId(Number(req.params.pid));

    if(productos.length === 0){
        return res.status(404).send({error: 404, status:"Producto No encontrado", message:"No existe un producto con la id ingresada"})
    }

    if(productos.length >= 2){
        return res.status(500).send({error: 500, status:"Ambiguedad", message:"Existen mas de un producto con la misma id, comuniquese con el administrador de la bd"})
    }



    let carritos = ManagerCarritos.buscarCarritoPorId(Number(req.params.cid));

    if(carritos.length === 0){
        return res.status(404).send({error: 404, status:"Carrito No enecontrado", message:"No existe un carrito con la id ingresada"})
    }

    if(carritos.length >= 2){
        return res.status(500).send({error: 500, status:"Ambiguedad", message:"Existen mas de un carrito con la misma id, comuniquese con el administrador de la bd"})
    }




    carritos[0].products =carritos[0].products.filter((p) => p.product !== Number(req.params.pid));

    carritos[0].products.sort(((a, b) => a.product - b.product));

    ManagerCarritos.actualizarProductosPorCarritoId(Number(req.params.cid), carritos[0].products);

    return res.status(200).send({
        status:"Exito", 
        message:"Se ha actualizado los productos de carrito con ID: "+ Number(req.params.cid), 
        carritoActualizado: ManagerCarritos.buscarCarritoPorId(Number(req.params.cid))[0]
    });
});

export default routerCarritos;
