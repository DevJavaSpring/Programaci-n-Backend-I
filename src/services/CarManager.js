const {default : CarModel} = await import ('../persistence/models/car.model.js');
const {default : ProductModel} = await import ('../persistence/models/Product.model.js');

export default class CarManager{

    /**
     * SERVICIOS DE CARRITOS
     * @returns
     */

    static async obtenerInventario(){
        try {
            let carArray = await CarModel.find().lean().exec();
            return carArray;
        } catch (error) {
            console.error("Error al buscar carritos,", error);
            throw error;
        }
    }

    static async crearNuevoCarrito(){
        try {
            let carObject = await CarModel.create({  });
            console.log("Se agrego un nuevo carrito de compras con id: "+ carObject._id);
            return carObject;
        } catch (error) {
            console.error("Error al agregar un nuevo carrito,", error);
            throw error;
        }
    }

    static async buscarCarritoPorId(carritoId){
        try {
            let carObject = await CarModel.findOne({ _id: carritoId }).populate('products.product');
            console.log("Busqueda de carrito por id ejecutada correctamente");
            return carObject;
        } catch (error) {
            console.error("Error al obtener el producto con id:", error);
            throw error;
        }
    }


    static async agregarProductosPorCarritoId(carId, productId, cant){
        try {
            let carObject = await CarModel.findOne({ _id: carId });

            let productoCargado =  carObject.products.find(p => p.product.equals(productId));
            if (productoCargado) {
                productoCargado.cantidad += cant;
            } else {
                carObject.products.push({ product:productId, cantidad:cant });
            }
            
            let productObject = await ProductModel.findOne({ _id: productId });

            if (productObject.stock < cant) {
                throw new Error('Stock insuficiente del producto: '+ productId +". Existen "+ productObject.stock +' unidades disponibles y se quiere llevar '+ cant);
            }

            let updateCar     = await CarModel.updateOne({ _id: carId }, carObject);
            let updateProduct = await ProductModel.updateOne({ _id: productId }, {stock: (productObject.stock - cant)});
        
            console.log("Se agrego "+ cant +" unidades del producto con id: "+ productId +" en el carrito con id: "+ carId);
            return {
                "resultUpdateCar": updateCar, 
                "resultUpdateProduct": updateProduct,
                "carrito Actualizado": await CarModel.findOne({ _id: carId }).populate('products.product'),
            };
        } catch (error) {
            console.error("Error al agregar producto a carrito", error);
            throw error;
        }
    }


    static async borrarProductoIdPorCarritoId(carId, productId){
        try {
            let carObject = await CarModel.findOne({ _id: carId });

            const deleteProduct = carObject.products.find(p => p.product.equals(productId));
            if (deleteProduct === undefined) {
                console.log('');
                throw new Error('Producto no encontrado en el carrito, el producto con id: '+ productId +", no existe en el carrito con id: "+ carId);
            }
        
            carObject.products = carObject.products.filter(p => !p.product.equals(productId));

            let updateCar     = await CarModel.updateOne({ _id: carId }, carObject);
            let updateProduct = await ProductModel.updateOne({ _id: productId }, {$inc: {stock: deleteProduct.cantidad} });


            console.log("Se borro el producto con id: "+ productId +" del carrito con id: "+ carId);
            return {
                "resultUpdateCar": updateCar, 
                "resultUpdateProduct": updateProduct,
                "carrito Actualizado": await CarModel.findOne({ _id: carId }).populate('products.product'),
            };
        } catch (error) {
            console.error("Error al agregar producto a carrito", error);
            throw error;
        }
    }

    static async borrarTodosProductoPorCarritoId(carId){
        try {
            let carObject = await CarModel.findOne({ _id: carId });

            for (const p of carObject.products) {
                await ProductModel.updateOne({ _id: p.product }, {$inc: {stock: p.cantidad} });
            }

            carObject.products = [];

            let updateCar     = await CarModel.updateOne({ _id: carId }, carObject);

            console.log("Se borraron todos los productos del carrito con id: "+ carId);
            return {
                "resultUpdateCar": updateCar, 
                "carrito Actualizado": await CarModel.findOne({ _id: carId }).populate('products.product'),
            };
        } catch (error) {
            console.error("Error al agregar producto a carrito", error);
            throw error;
        }
    }
   
}
