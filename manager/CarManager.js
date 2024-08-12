const {default : CarModel} = await import ('../src/models/car.model.js');


export default class CarManager{

    /**
     * SERVICIOS DE CARRITOS
     * @returns
     */

    static obtenerInventario(){
        let carritoString = fs.readFileSync('./carritos.json', 'utf-8');

        let carritoArray = (carritoString === "")? [] : JSON.parse(carritoString);

        return carritoArray;
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
            let carObject = await CarModel.findOne({ _id: carritoId });
            console.log("Busqueda de carrito por id ejecutada correctamente");
            return carObject;
        } catch (error) {
            console.error("Error al obtener el producto con id:", error);
            throw error;
        }
    }


    static async actualizarProductosPorCarritoId(carId, productId){
        try {
            let carObject = await CarModel.findOne({ _id: carId });

            carObject.products.push({product:productId})

            let result = await CarModel.updateOne({ _id: carId }, carObject);

            let productObject = await PoductModel.findOne({ _id: productId });
            console.log("Se agrgeo el producto con id: "+ productId +" en el carrito con id: "+ carId);
            return result;
        } catch (error) {
            console.error("Error al obtener el producto con id:", error);
            throw error;
        }
    }
}
