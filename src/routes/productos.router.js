import {Router} from 'express';

const {default : ManagerProductos} = await import ('../../manager/ManagerProductos.js');
const routerProductos = Router();



/**
 * ENDPONINT DE PRODUCTOS
 */
routerProductos.get('/',  (req, res)=>{
  let {limit} = req.query;
  return res.status(200).send(ManagerProductos.obtenerInventario(limit));
});

routerProductos.get("/:pid",  (req, res)=>{

    if(isNaN(req.params.pid)){
        return res.status(400).send({error: 400, status:"Parametro desconocido", message:"Parametro desconocido, el parmetro debe ser numerico"})
    }

    let productos = ManagerProductos.buscarProductoPorId(Number(req.params.pid));

    if(productos.length === 0){
        return res.status(404).send({error: 404, status:"Producto No enecontrado", message:"No existe un producto con la id ingresada"})
    }

    if(productos.length >= 2){
        return res.status(500).send({error: 500, status:"Ambiguedad", message:"Existen mas de un producto con la misma id, comuniquese con el administrador de la bd"})
    }

    return res.status(200).send(productos[0]);
});

routerProductos.post("/",  (req, res)=>{
    let producto = req.body;

    if(!producto.title || !producto.description || !producto.code || !producto.price || !producto.status || !producto.stock || !producto.category){
        return res.status(400).send({error: "400", status:"error", message:"valores incompletos "})
    }

    if(isNaN(producto.price) || isNaN(producto.stock)){
        return res.status(400).send({error: 400, status:"Parametro desconocido", message:"Parametro desconocido en price o stock, el parametro debe ser numerico"})
    }

    ManagerProductos.agregarProducto(producto.title, producto.description, producto.code, Number(producto.price), Number(producto.stock), producto.category);

    return res.status(200).send({status: "200 Successful OK",  message:"Se ha creado un nuevo producto"});
});

routerProductos.put("/:pid",  (req, res)=>{

    if(isNaN(req.params.pid)){
        return res.status(400).send({error: 400, status:"Parametro desconocido", message:"Parametro desconocido, el parmetro debe ser numerico"})
    }

    let productos = ManagerProductos.buscarProductoPorId(Number(req.params.pid));

    if(productos.length === 0){
        return res.status(404).send({error: 404, status:"Producto No encontrado", message:"No existe un producto con la id ingresada"})
    }

    if(productos.length >= 2){
        return res.status(500).send({error: 500, status:"Ambiguedad", message:"Existen mas de un producto con la misma id, comuniquese con el administrador de la bd"})
    }



    let atributos = req.body;

    ManagerProductos.modificarProducto(
        Number(req.params.pid),
        (atributos.title)? atributos.title : null,
        (atributos.description)? atributos.description : null,
        (atributos.code)? atributos.code : null,
        (atributos.price )? Number(atributos.price) : null,
        (atributos.status)? atributos.status : null,
        (atributos.stock)? Number(atributos.stock) :null,
        (atributos.category)? atributos.category : null
    );
    
    return res.status(200).send({status: "200 Successful OK",  message:"Se ha modificado el producto con id: " + req.params.pid});
});

routerProductos.delete("/:pid",  (req, res)=>{

    if(isNaN(req.params.pid)){
        return res.status(400).send({error: 400, status:"Parametro desconocido", message:"Parametro desconocido, el parmetro debe ser numerico"})
    }

    let productos = ManagerProductos.buscarProductoPorId(Number(req.params.pid));

    if(productos.length === 0){
        return res.status(404).send({error: 404, status:"Producto No encontrado", message:"No existe un producto con la id ingresada"})
    }

    if(productos.length >= 2){
        return res.status(500).send({error: 500, status:"Ambiguedad", message:"Existen mas de un producto con la misma id, comuniquese con el administrador de la bd"})
    }

    ManagerProductos.borrarProducto(Number(req.params.pid));

    return res.status(200).send({status: "200 Successful OK",  message:"Se ha borrado el producto con id: " + req.params.pid});
});

export default routerProductos;
