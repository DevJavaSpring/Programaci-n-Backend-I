const {default : ProductModel} = await import ('../src/models/product.model.js');

export default class ProductManager{

    /**
     * SERVICIOS DE PRODUCTOS
     * @returns
     */

    static async obtenerInventarioTotal(){
        try {
            let productArray = await ProductModel.find().lean().exec();
            console.log("Inventarios de productos obtenido correctamente:", productArray.length);
            return productArray;
        } catch (error) {
            console.error("Error al obtener el inventario de productos:", error);
            throw error;
        }
    }

    static async obtenerInventario(limitParam, pageParam, sortParam, queryParam){
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
                productArray = await ProductModel.find(query)
                                                     .sort({"price": sort})
                                                     .skip((page - 1) * limit)
                                                     .limit(limit)
                                                     .exec();         
            }

            if((sort === undefined) && (query !== undefined)){
                query = JSON.parse(query);
                productArray = await ProductModel.find(query)
                                                     .skip((page - 1) * limit)
                                                     .limit(limit)
                                                     .exec();                                             
            }

            if((sort !== undefined) && (query === undefined)){
                productArray = await ProductModel.find()
                                                     .sort({"price": sort})
                                                     .skip((page - 1) * limit)
                                                     .limit(limit)
                                                     .exec();                                            
            }

            if((sort === undefined) && (query === undefined)){
                productArray = await ProductModel.find()
                                                     .skip((page - 1) * limit)
                                                     .limit(limit)
                                                     .exec();         
            }
            
            console.log("Inventarios de productos obtenido correctamente:", productArray.length);
            return productArray;
        } catch (error) {
            console.error("Error al obtener el inventario de productos:", error);
            throw error;
        }
    }

    static async buscarProductoPorId(id){
        try {
            let productObject = await ProductModel.findOne({ _id: id });
            console.log("Busqueda de producto por id ejecutada correctamente");
            return productObject;
        } catch (error) {
            console.error("Error al obtener el producto con id: "+ id +". ERROR: "+ error);
            throw error;
        }
    }

    static async agregarProducto(title, description, code, price, status, stock, category){
        try {
            let productObject = await ProductModel.create({ title, description, code, price, status, stock, category });
            console.log("Se agrego un nuevo producto con la id: "+ productObject._id);
            return productObject;
        } catch (error) {
            console.error("Error al agregar el producto,", error);
            throw error;
        }
    }

    static async modificarProducto(productId, paramsUpdated){
        try {   
            let result = await ProductModel.updateOne({ _id: productId }, paramsUpdated);
            console.log("Se modifico el producto con id: "+ productId);
            return result;
        } catch (error) {
            console.error("Error al modificar el producto,", error);
            throw error;
        }
    }

    static async borrarProducto(productId){
        try {   
            let result = await ProductModel.deleteOne({ _id: productId });
            console.log("Se elimino el producto con id: "+ productId);
            return result;
        } catch (error) {
            console.error("Error al eliminar el producto,", error);
            throw error;
        }
    }
}