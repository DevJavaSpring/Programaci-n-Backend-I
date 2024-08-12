const {default : ProductModel} = await import ('../src/models/product.model.js');

export default class ProductManager{

    /**
     * SERVICIOS DE PRODUCTOS
     * @returns
     */

    static async obtenerInventarioTotal(){
        try {
            let productArray = await ProductModel.find().exec();
            console.log("Inventarios de productos obtenido correctamente:", productArray.length);
            return productArray;
        } catch (error) {
            console.error("Error al obtener el inventario de productos:", error);
            throw error;
        }
    }

    static async obtenerInventario(limit){
        try {
            let productArray = await ProductModel.find().limit(limit).exec();
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
            console.error("Error al obtener el producto con id:", error);
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