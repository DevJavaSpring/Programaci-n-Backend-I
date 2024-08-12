import {Router} from 'express';

const {default : CarManager} = await import ('../../manager/CarManager.js');
const {default : ProductManager} = await import ('../../manager/ProductManager.js');
const carRouter = Router();

/**
 * ENDPONINT DE CARRITO
 */
carRouter.post("/",  (req, res)=>{
    CarManager.crearNuevoCarrito()
    .then((carObject) => {
        return res.status(200).send({status:"Exito", message:"Se ha creado un nuevo carrito de compras con id: "+ carObject._id , carrito:carObject});
    })
    .catch((error) => {
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta", message:error});
    });
});

carRouter.get("/:cid",  (req, res)=>{
    CarManager.buscarCarritoPorId(req.params.cid)
    .then((carObject) => {
        if(carObject === null){
            return res.status(404).send({error: 404, status:"Carrito No encontrado", message:("No existe un carrito con la id "+ req.params.cid)})
        }
        
        return res.status(200).json(carObject);
    })
    .catch((error) => {
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la busqueda de carrito", message:error});
    });
});

carRouter.post("/:cid/product/:pid",  (req, res)=>{
    ProductManager.buscarProductoPorId(req.params.pid)
    .then((productObject) => {
        if(productObject === null){
            return res.status(404).send({error: 404, status:"Producto No encontrado", message:"No existe un producto con la id "+ req.params.pid})
        }
        
        CarManager.buscarCarritoPorId(req.params.cid)
        .then((carObject) => {
            if(carObject === null){
                return res.status(404).send({error: 404, status:"Carrito No encontrado", message:"No existe un carrito con la id "+ req.params.pid})
            }

            CarManager.actualizarProductosPorCarritoId(req.params.cid, req.params.pid)
            .then((result) => {
                return res.status(200).send({
                    status:"Exito", 
                    message:"Se ha uagregado un producto con id: "+ req.params.pid +" en el carrito con id: "+ req.params.cid, 
                    result: result,
                });
            })
            .catch((error) => {
                return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error al intentar agregar el producto en el carrito", message:error});
            });

            return res.status(200).json(productObject);
        })
        .catch((error) => {
            return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta", message:error});
        });
    })
    .catch((error) => {
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta", message:error});
    });
});

carRouter.delete("/:cid/product/:pid",  (req, res)=>{
    if(isNaN(req.params.cid) || isNaN(req.params.pid) ){
        return res.status(400).send({error: 400, status:"Parametro desconocido", message:"Parametro desconocido, los parametros debn ser numerico"})
    }



    let productos = ProductManager.buscarProductoPorId(Number(req.params.pid));

    if(productos.length === 0){
        return res.status(404).send({error: 404, status:"Producto No encontrado", message:"No existe un producto con la id ingresada"})
    }

    if(productos.length >= 2){
        return res.status(500).send({error: 500, status:"Ambiguedad", message:"Existen mas de un producto con la misma id, comuniquese con el administrador de la bd"})
    }



    let carritos = CarManager.buscarCarritoPorId(Number(req.params.cid));

    if(carritos.length === 0){
        return res.status(404).send({error: 404, status:"Carrito No enecontrado", message:"No existe un carrito con la id ingresada"})
    }

    if(carritos.length >= 2){
        return res.status(500).send({error: 500, status:"Ambiguedad", message:"Existen mas de un carrito con la misma id, comuniquese con el administrador de la bd"})
    }




    carritos[0].products =carritos[0].products.filter((p) => p.product !== Number(req.params.pid));

    carritos[0].products.sort(((a, b) => a.product - b.product));

    CarManager.actualizarProductosPorCarritoId(Number(req.params.cid), carritos[0].products);

    return res.status(200).send({
        status:"Exito", 
        message:"Se ha actualizado los productos de carrito con ID: "+ Number(req.params.cid), 
        carritoActualizado: CarManager.buscarCarritoPorId(Number(req.params.cid))[0]
    });
});

export default carRouter;
