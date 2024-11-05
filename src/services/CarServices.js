const {default : carRepository} = await import ('../persistence/repositories/CarRepository.js');
const {default : productRepository} = await import ('../persistence/repositories/ProductRepository.js');

class CarServices{

    /**
     * SERVICIOS DE CARRITOS
     * @returns
     */

    async obtenerInventario(){
        try {
            let carArray = await carRepository.findAll();
            return carArray;
        } catch (error) {
            console.error("Error al buscar carritos,", error);
            throw error;
        }
    }

    async buscarCarritoPorId(id){
        try {
            let carObject = await carRepository.findById(id);
            console.log("Busqueda de carrito por id ejecutada correctamente");
            return carObject;
        } catch (error) {
            console.error("Error al obtener el carrito con id: "+ id +". ERROR: "+ error);
            throw error;
        }
    }

    async agregarCarrito(car){
        try {
            let carObject = await carRepository.save(car);//await CarModel.create({  });
            console.log("Se agrego un nuevo carrito de compras con id: "+ carObject._id);
            return carObject;
        } catch (error) {
            console.error("Error al agregar un nuevo carrito,", error);
            throw error;
        }
    }

    async buscarCarritoPorIdConProyeccionEnProducts(carritoId){
        try {
            let carObject = await carRepository.findByIdWithProjectionInProducts(carritoId);
            console.log("Busqueda de carrito por id ejecutada correctamente");
            return carObject;
        } catch (error) {
            console.error("Error al obtener el producto con id:", error);
            throw error;
        }
    }


    async agregarProductosPorCarritoId(carId, productId, cant){
        try {
            let carObject = await carRepository.findById(carId);

            let productoCargado =  carObject.products.find(p => p.product.equals(productId));
            if (productoCargado) {
                productoCargado.cantidad += cant;
            } else {
                carObject.products.push({ product:productId, cantidad:cant });
            }
            
            let productObject = await productRepository.findById(productId);

            if (productObject.stock < cant) {
                throw new Error('Stock insuficiente del producto: '+ productId +". Existen "+ productObject.stock +' unidades disponibles y se quiere llevar '+ cant);
            }

            let updateCar     = await carRepository.update(carId, carObject);
            let updateProduct = await productRepository.update(productId, {stock: (productObject.stock - cant)});
        
            console.log("Se agrego "+ cant +" unidades del producto con id: "+ productId +" en el carrito con id: "+ carId);
            return {
                "resultUpdateCar": updateCar, 
                "resultUpdateProduct": updateProduct,
                "carrito Actualizado": await carRepository.findByIdWithProjectionInProducts(carId),
            };
        } catch (error) {
            console.error("Error al agregar producto a carrito", error);
            throw error;
        }
    }


    async borrarProductoIdPorCarritoId(carId, productId){
        try {
            let carObject = await carRepository.findById(carId);

            const deleteProduct = carObject.products.find(p => p.product.equals(productId));
            if (deleteProduct === undefined) {
                console.log('');
                throw new Error('Producto no encontrado en el carrito, el producto con id: '+ productId +", no existe en el carrito con id: "+ carId);
            }
        
            carObject.products = carObject.products.filter(p => !p.product.equals(productId));

            let updateCar     = await carRepository.update(carId, carObject);
            let updateProduct = await productRepository.update(productId, {$inc: {stock: deleteProduct.cantidad} });


            console.log("Se borro el producto con id: "+ productId +" del carrito con id: "+ carId);
            return {
                "resultUpdateCar": updateCar, 
                "resultUpdateProduct": updateProduct,
                "carrito Actualizado": await carRepository.findByIdWithProjectionInProducts(carId),
            };
        } catch (error) {
            console.error("Error al agregar producto a carrito", error);
            throw error;
        }
    }

    async borrarTodosProductoPorCarritoId(carId){
        try {
            let carObject = await carRepository.findById(carId);//await CarModel.findOne({ _id: carId });

            for (const p of carObject.products) {
                await productRepository.update(p.product, {$inc: {stock: p.cantidad} });
            }

            carObject.products = [];

            let updateCar = await carRepository.update(carId, carObject);

            console.log("Se borraron todos los productos del carrito con id: "+ carId);
            return {
                "resultUpdateCar": updateCar, 
                "carrito Actualizado": await carRepository.findByIdWithProjectionInProducts(carId),
            };
        } catch (error) {
            console.error("Error al agregar producto a carrito", error);
            throw error;
        }
    }
   
}
export default new CarServices();