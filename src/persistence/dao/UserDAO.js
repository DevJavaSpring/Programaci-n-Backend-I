const {default : User} = await import ('../models/User.model.js');

class UserDAO {
  // Obtener todos los usuarios
  async getAllUsers() {
    try {
      return await User.find({});
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  // Buscar un usuario por su id
  async getUserById(id) {
    try {
      return await User.findOne({ _id: id });
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  // Crear un nuevo usuario
  async createUser(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  // Actualizar un usuario por su ID
  async updateUserById(userId, updateData) {
    try {
      return await User.findByIdAndUpdate(userId, updateData, {
        new: true, // Retorna el documento actualizado
        runValidators: true, // Aplica las validaciones del esquema
      });
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  // Borrar un usuario por su ID
  async deleteUserById(userId) {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(`Error al borrar usuario: ${error.message}`);
    }
  }
  
  // Buscar un usuario por su email
  async getUserByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  // Obtener todos los usuarios proyectado como un DTO
  async getAllDTO(DTO) {
    try {
      let selectedFields = DTO.getAttributesProjected.join(' ');
      return (await User.find({}, selectedFields)).map(u => new DTO(u));
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }
  
  // Buscar un usuario ,por su email, proyectado como DTO
  async getByEmailDTO(email, DTO) {
    try {
      let selectedFields = DTO.getAttributesProjected().join(' ');
      return new DTO(await User.findOne({ email }, selectedFields));
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }
}

export default new UserDAO();