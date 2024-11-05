import {Router} from 'express';

const {default : carServices} = await import ('../services/CarServices.js');
const {default : productServices} = await import ('../services/ProductServices.js');
const carRouter = Router();

/**
 * ENDPONINT DE CARRITO
 */
carRouter.post("/",  (req, res)=>{
    carServices.agregarCarrito({})
    .then((carObject) => {
        return res.status(200).send({status:"Exito", message:"Se ha creado un nuevo carrito de compras con id: "+ carObject._id , carrito:carObject});
    })
    .catch((error) => {
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta", message:error.message});
    });
});

carRouter.get("/:cid",  (req, res)=>{
    carServices.buscarCarritoPorId(req.params.cid)
    .then((carObject) => {
        if(carObject === null){
            return res.status(404).send({error: 404, status:"Carrito No encontrado", message:("No existe un carrito con la id "+ req.params.cid)})
        }
        
        return res.status(200).json(carObject);
    })
    .catch((error) => {
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la busqueda de carrito", message:error.message});
    });
});

carRouter.post("/:cid/product/:pid",  (req, res)=>{
    console.log("INICIO DE SERVICIO DE AGREGAR PRODUCTO A CARRITO");
    productServices.buscarProductPorId(req.params.pid)
    .then((productObject) => {
        if(productObject === null){
            return res.status(404).send({error: 404, status:"Producto No encontrado", message:"No existe un producto con la id "+ req.params.pid})
        }
        
        carServices.buscarCarritoPorId(req.params.cid)
        .then((carObject) => {
            if(carObject === null){
                return res.status(404).send({error: 404, status:"Carrito No encontrado", message:"No existe un carrito con la id "+ req.params.pid})
            }

            carServices.agregarProductosPorCarritoId(req.params.cid, req.params.pid, 1)
            .then((result) => {
                console.log("TERMINO EL SERVICIO DE AGREGAR PRODUCTO A CARRITO CORRECTAMENTE");
                console.log(" ");
                
                return res.status(200).send({
                    status:"Exito", 
                    message:"Se agrego 1 unidades del producto con id: "+ req.params.pid +" en el carrito con id: "+ req.params.cid, 
                    result: result,
                });
            })
            .catch((error) => {
                console.log("TERMINO EL SERVICIO DE AGREGAR PRODUCTO A CARRITO CON ERROR");
                console.log(" ");
                return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error al intentar agregar el producto en el carrito", message:error.message});
            });

        })
        .catch((error) => {
            console.log("TERMINO EL SERVICIO DE AGREGAR PRODUCTO A CARRITO CON ERROR");
            console.log(" ");
            return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta", message:error.message});
        });
    })
    .catch((error) => {
        console.log("TERMINO EL SERVICIO DE AGREGAR PRODUCTO A CARRITO CON ERROR");
        console.log(" ");
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta", message:error.message});
    })
});

carRouter.delete("/:cid/product/:pid",  (req, res)=>{
    console.log("INICIO DE SERVICIO BORRAR PRODUCTO DEL CARRITO");
    productServices.buscarProductPorId(req.params.pid)
    .then((productObject) => {
        if(productObject === null){
            return res.status(404).send({error: 404, status:"Producto No encontrado", message:"No existe un producto con la id "+ req.params.pid})
        }
        
        carServices.buscarCarritoPorId(req.params.cid)
        .then((carObject) => {
            if(carObject === null){
                return res.status(404).send({error: 404, status:"Carrito No encontrado", message:"No existe un carrito con la id "+ req.params.pid})
            }

            carServices.borrarProductoIdPorCarritoId(req.params.cid, req.params.pid, 1)
            .then((result) => {
                console.log("TERMINO EL SERVICIO BORRAR PRODUCTO DEL CARRITO CORRECTAMENTE");
                console.log(" ");
                
                return res.status(200).send({
                    status:"Exito", 
                    message:"Se borro el producto con id: "+ req.params.pid +" del carrito con id: "+ req.params.cid, 
                    result: result,
                });
            })
            .catch((error) => {
                console.log("TERMINO EL SERVICIO CON ERROR");
                console.log(" ");
                return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error al intentar borrar el producto en el carrito", message:error.message});
            });

        })
        .catch((error) => {
            console.log("TERMINO EL SERVICIO CON ERROR");
            console.log(" ");
            return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta", message:error.message});
        });
    })
    .catch((error) => {
        console.log("TERMINO EL SERVICIO CON ERROR");
        console.log(" ");
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta", message:error.message});
    })
});

carRouter.delete("/:cid",  (req, res)=>{
    console.log("INICIO DE SERVICIO BORRAR PRODUCTO DEL CARRITO");
    carServices.buscarCarritoPorId(req.params.cid)
    .then((carObject) => {
        if(carObject === null){
            return res.status(404).send({error: 404, status:"Carrito No encontrado", message:"No existe un carrito con la id "+ req.params.pid})
        }

        carServices.borrarTodosProductoPorCarritoId(req.params.cid)
        .then((result) => {
            console.log("TERMINO EL SERVICIO BORRAR TODOS PRODUCTOS DEL CARRITO CORRECTAMENTE");
            console.log(" ");
                
            return res.status(200).send({
                status:"Exito", 
                message:"Se borraron todos los productos del carrito con id: "+ req.params.cid, 
                result: result,
            });
        })
        .catch((error) => {
            console.log("TERMINO EL SERVICIO CON ERROR");
            console.log(" ");
            return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error al intentar borrar todos los productos del carrito", message:error.message});
        });
    })
    .catch((error) => {
        console.log("TERMINO EL SERVICIO CON ERROR");
        console.log(" ");
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta", message:error.message});
    }); 
});








export default carRouter;
