const {default : Product} = await import ('../models/Product.model.js');

class ProductDAO {
  // Obtener todos los productos
  async getAllProducts() {
    try {
    //return await Product.find({});
      return await Product.find().lean().exec();
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  // Obtener pagina ordenada de  productos
  async getOrderAndPageProducts(queryObj, sortObj, page, limit) {
    try {
      return await Product.find(queryObj)
                          .sort(sortObj)
                          .skip((page - 1) * limit)
                          .limit(limit)
                          .exec();  
    } catch (error) {
      throw new Error(`Error al obtener pagina de productos: ${error.message}`);
    }
  }

  // Buscar producto por su id
  async getProductById(id) {
    try {
      return await Product.findOne({ _id: id });
    } catch (error) {
      throw new Error(`Error al buscar producto: ${error.message}`);
    }
  }

  // Crear un nuevo producto
  async createProduct(productData) {
    try {
      //const product = new Product(productData);
      //return await product.save();
      return await Product.create(productData);
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  // Actualizar producto por su ID
  async updateProductById(productId, updateData) {
    try {
      //return await Product.findByIdAndUpdate(productId, updateData, {
      //  new: true, // Retorna el documento actualizado
      //  runValidators: true, // Aplica las validaciones del esquema
      //});

      return await Product.updateOne({ _id: productId }, updateData);
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  // Borrar producto por su ID
  async deleteProductById(productId) {
    try {
      //return await Product.findByIdAndDelete(productId);
      return await Product.deleteOne({ _id: productId });
    } catch (error) {
      throw new Error(`Error al borrar producto: ${error.message}`);
    }
  }
}

export default new ProductDAO();