const {default : carDAO} = await import ('../dao/CarDAO.js');

class CarRepository {
    async findAll() {
        return await carDAO.getAllCars();
    }

    async findById(carId) {
        return await carDAO.getCarById(carId);
    }

    async findByIdWithProjectionInProducts(carId) {
        return await carDAO.getCarByIdProjectingProducts(carId);
    }

    async save(carData) {
        return await carDAO.createCar(carData);
    }

    async update(carId, carData) {
        return await carDAO.updateCarById(carId, carData);
    }

    async deleteById(carId) {
        return await carDAO.deleteCarById(carId);
    }
}

const carRepository = new CarRepository();
export default carRepository;