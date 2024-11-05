const {default : Car} = await import ('../models/Car.model.js');

class CarDAO {
  // Obtener todos los carritos
  async getAllCars() {
    try {
    //return await Car.find({});
      return await Car.find().lean().exec();
    } catch (error) {
      throw new Error(`Error al obtener carritos: ${error.message}`);
    }
  }

  // Buscar carrito por su id
  async getCarById(id) {
    try {
      return await Car.findOne({ _id: id });
    } catch (error) {
      throw new Error(`Error al buscar carrito: ${error.message}`);
    }
  }

  // Buscar carrito por su id
  async getCarByIdProjectingProducts(id) {
    try {
    //return await Car.findOne({ _id: id });
      return await Car.findOne({ _id: id }).populate('products.product');
    } catch (error) {
      throw new Error(`Error al buscar carrito: ${error.message}`);
    }
  }

  // Crear un nuevo carrito
  async createCar(carData) {
    try {
      //const car = new Car(carData);
      //return await car.save();
      return await Car.create(carData);
    } catch (error) {
      throw new Error(`Error al crear carrito: ${error.message}`);
    }
  }

  // Actualizar carrito por su ID
  async updateCarById(carId, updateData) {
    try {
      //return await Car.findByIdAndUpdate(carId, updateData, {
      //  new: true, // Retorna el documento actualizado
      //  runValidators: true, // Aplica las validaciones del esquema
      //});
      await Car.updateOne({ _id: carId }, updateData);
    } catch (error) {
      throw new Error(`Error al actualizar carrito: ${error.message}`);
    }
  }

  // Borrar carrito por su ID
  async deleteCarById(carId) {
    try {
    //return await Car.findByIdAndDelete(carId);
      return await Product.deleteOne({ _id: carId });
    } catch (error) {
      throw new Error(`Error al borrar carrito: ${error.message}`);
    }
  }
}

export default new CarDAO();