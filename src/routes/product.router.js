import {Router} from 'express';

const {default : productServices} = await import ('../services/ProductServices.js');
const productRouter = Router();


/**
 * ENDPONINT DE PRODUCTOS
 */
productRouter.get('/', async (req, res)=>{
    let {limit, page, sort, query} = req.query;

    productServices.obtenerInventario(limit, page, sort, query)
    .then((productsArray) => {
        return res.status(200).json(productsArray);
    })
    .catch((error) => {
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta", message:error});
    })
});

productRouter.get("/:pid", async (req, res)=>{
    productServices.buscarProductPorId(req.params.pid)
    .then((productObject) => {
        if(productObject === null){
            return res.status(404).send({error: 404, status:"Producto No encontrado", message:("No existe un producto con la id "+ req.params.pid)})
        }
        
        return res.status(200).json(productObject);
    })
    .catch((error) => {
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta", message:error});
    });

  });

productRouter.post("/", async (req, res)=>{
    let producto = req.body;
  
    if(!producto.title || !producto.description || !producto.code || !producto.price || !producto.status || !producto.stock || !producto.category){
        return res.status(400).send({error: "400", status:"error", message:"valores incompletos "})
    }
  
    if(isNaN(Number(producto.price)) || isNaN(Number(producto.stock))){
        return res.status(400).send({error: 400, status:"Parametro desconocido", message:"Parametro desconocido en price o stock, el parametro debe ser numerico"})
    }
  
    producto.price = Number(producto.price);
    producto.stock = Number(producto.stock);
    productServices.agregarProduct(producto)
    .then((productObject) => {
        return res.status(200).send({status:"Nuevo producto agregado correctamente", producto:productObject});
    })
    .catch((error) => {
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta", message:error});
    });
});
  
productRouter.put("/:pid", async (req, res)=>{
    productServices.buscarProductPorId(req.params.pid)  
    .then((productObject) => {
        if(productObject === null){
            return res.status(404).send({error: 404, status:"Producto No encontrado", message:("No existe un producto con la id "+ req.params.pid)})
        }
        
        let paramsUpdated = req.body;
        
        if( paramsUpdated.price ){
            if(isNaN(Number(paramsUpdated.price))){
                return res.status(400).send({error: 400, status:"Valores desconocido", message:"Valores desconocido en price o stock, los valores deben ser numerico"})
            } else {
                paramsUpdated.price = Number(paramsUpdated.price);
            }
        }
    
        if( paramsUpdated.stock ){
            if(isNaN(Number(paramsUpdated.stock))){
                return res.status(400).send({error: 400, status:"Valores desconocido", message:"Valores desconocido en price o stock, los valores deben ser numerico"})
            } else {
                paramsUpdated.stock = Number(paramsUpdated.stock);
            }
        }

        productServices.modificarProduct(req.params.pid, paramsUpdated)
        .then((result) => {
            return res.status(200).send({status: "200 Successful OK",  message:"Se ha modificado el producto con id: " + req.params.pid, result: result});
        })
        .catch((error) => {
            return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta de modificar producto", message:error});
        });
    })
    .catch((error) => {
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta de buscar producto", message:error});
    });
});

productRouter.delete("/:pid",  (req, res)=>{
    productServices.buscarProductPorId(req.params.pid)  
    .then((productObject) => {
        if(productObject === null){
            return res.status(404).send({error: 404, status:"Producto No encontrado", message:("No existe un producto con la id "+ req.params.pid)})
        }
      
        productServices.borrarProduct(req.params.pid)
        .then((result) => {
            return res.status(200).send({status: "200 Successful OK",  message:"Se ha dado de baja el producto con id: " + req.params.pid, result: result});
        })
        .catch((error) => {
            return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta de modificar producto", message:error});
        });
    })
    .catch((error) => {
        return res.status(503).send({error:"Consulta no ejecutada", status:"Ocurrio un error en la consulta de buscar producto", message:error});
    });      
});

export default productRouter;