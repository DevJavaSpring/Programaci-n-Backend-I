const {default : productRepository} = await import ('../persistence/repositories/ProductRepository.js');

class ProductServices{
    /**
     * SERVICIOS DE PRODUCTOS
     * @returns
     */
    async obtenerInventarioTotal(){
        try {
            let productArray = await productRepository.findAll();
            console.log("Servicio \"obtenerProductArray()\", obtencion de produtos ejecutado correctamente, ");
            return productArray;
        } catch (error) {
            console.error("Error al obtener productos en el servicio \"obtenerProductArray()\":", error);
            throw error;
        }
    }

    async obtenerInventario(limitParam, pageParam, sortParam, queryParam){
        let limit = (limitParam === undefined)? 10 : limitParam ;
        let page = (pageParam === undefined) ? 1 : pageParam;
        let sort = sortParam; 
        let query = queryParam;
        
        try {
            let productArray;

            if(sort !== undefined) {
                if(sort === "asc") {
                    sort = 1;
                } else if (sort === "desc"){
                    sort = -1;
                } else {
                    throw new Error('No existe esa forma de ordenamiento');  
                }
            }
            
            
            if((sort !== undefined) && (query !== undefined)){
                query = JSON.parse(query);
                productArray = await productRepository.findByOrderAndPagination(query, {"price": sort, _id: 1}, page, limit);
              //productArray = await ProductModel.find(query)
              //                                     .sort({"price": sort})
              //                                     .skip((page - 1) * limit)
              //                                     .limit(limit)
              //                                     .exec();         
            }

            if((sort === undefined) && (query !== undefined)){
                query = JSON.parse(query);
                productArray = await productRepository.findByOrderAndPagination(query, {}, page, limit);
                //productArray = await ProductModel.find(query)
                //                                     .skip((page - 1) * limit)
                //                                     .limit(limit)
                //                                     .exec();                                             
            }

            if((sort !== undefined) && (query === undefined)){
                productArray = await productRepository.findByOrderAndPagination(query, {"price": sort, _id: 1}, page, limit);
                //productArray = await ProductModel.find()
                //                                 .sort({"price": sort})
                //                                 .skip((page - 1) * limit)
                //                                 .limit(limit)
                //                                 .exec();                                            
            }

            if((sort === undefined) && (query === undefined)){
                productArray = await productRepository.findByOrderAndPagination(query, {}, page, limit);
                //productArray = await ProductModel.find()
                //                                 .skip((page - 1) * limit)
                //                                 .limit(limit)
                //                                 .exec();         
            }
            
            console.log("Inventarios de productos obtenido correctamente:", productArray.length);
            return productArray;
        } catch (error) {
            console.error("Error al obtener el inventario de productos:", error);
            throw error;
        }
    }

    async buscarProductPorId(id){
        try {
            let productObject = await productRepository.findById(id);
            console.log("Busqueda de producto por id ejecutada correctamente");
            return productObject;
        } catch (error) {
            console.error("Error al obtener el producto con id: "+ id +". ERROR: "+ error);
            throw error;
        }
    }

    async agregarProduct(product){
        try {
            let productObject = await productRepository.save(product);
            console.log("Se agrego un nuevo producto con la id: "+ productObject._id);
            return productObject;
        } catch (error) {
            console.error("Error al agregar el producto,", error);
            throw error;
        }
    }

    async modificarProduct(productId, productUpdated){
        try {   
            let result = await productRepository.update(productId, productUpdated);
            console.log("Se modifico el producto con id: "+ productId);
            return result;
        } catch (error) {
            console.error("Error al modificar el producto,", error);
            throw error;
        }
    }

    async borrarProduct(productId){
        try {   
            let result = await productRepository.deleteById(productId);
            console.log("Se elimino el producto con id: "+ productId);
            return result;
        } catch (error) {
            console.error("Error al eliminar el producto,", error);
            throw error;
        }
    }
}

export default new ProductServices();