const {default : userRepository} = await import ('../persistence/repositories/UserRepository.js');
const {default : UserDTO} = await import ('../persistence/dto/UserDTO.js');

class UserService{
    /**
     * SERVICIOS DE USER
     * @returns
     */
    async obtenerUserArray(){
        try {
            let userArray = await userRepository.findAll();
            console.log("Servicio \"obtenerUserArray()\", obtencion de usuarios ejecutado correctamente, ");
            return userArray;
        } catch (error) {
            console.error("Error al obtener usuarios en el servicio \"obtenerUserArray()\":", error);
            throw error;
        }
    }

    async buscarUser(userId){
        try {
            let userObject = await userRepository.findById();
            console.log("Servicio \"buscarUser(userId)\", buscar usuario por id ejecutado correctamente");
            return userObject;
        } catch (error) {
            console.error("Error al buscar usuario por id en el servicio \"buscarUser(userId)\":", error);
            throw error;
        }
    }

    async agregarUser(user){
        try {
            let userObject = await userRepository.save(user);
            console.log("Servicio \"agregarUser(user)\", se agrego un nuevo usuario con id: "+ userObject._id);
            return carObject;
        } catch (error) {
            console.error("Error al agregar usuario en el servicio \"agregarUser(user)\":", error);
            throw error;
        }
    }

    async actualizarUser(user){
        try {
            let userObject = await userRepository.update(user._id, user);
            console.log("Servicio \"actualizarUser(user)\", se actualizo usuario con id: "+ user._id);
            return userObject;
        } catch (error) {
            console.error("Error al actualizar usuario en el servicio \"actualizarUser(user)\":", error);
            throw error;
        }
    }

    async borrarUser(userId){
        try {
            await userRepository.deleteById(userId);
            console.log("Servicio \"borrarUser(userId)\", se borro usuario con id: "+ userId);
        } catch (error) {
            console.error("Error al borrar usuario en el servicio \"borrarUser(userId)\": ", error);
            throw error;
        }
    }

    async buscarUserPorEmail(email){
        try {
            let userObject = await userRepository.findByEmail(email);
            console.log("Servicio \"buscarUserPorEmail(email)\", se encontro usuario un con el email: "+ email);
            return userObject;
        } catch (error) {
            console.error("Error al buscar usuario por email en el servicio \"buscarUserPorEmail(email)\": ", error);
            throw error;
        }
    }

    //DTO
    async obtenerUserDTOArray(){
        try {
            let userArray = await userRepository.findAllDTO(UserDTO);
            console.log("Servicio \"obtenerUserArray()\", obtencion de usuarios ejecutado correctamente, ");
            return userArray;
        } catch (error) {
            console.error("Error al obtener usuarios en el servicio \"obtenerUserArray()\":", error);
            throw error;
        }
    }
    
    async buscarUserDTOPorEmail(email){
        try {
            let userDTO = await userRepository.findByEmailDTO(email, UserDTO);
            console.log("Servicio \"buscarUserDTOPorEmail(email)\", se encontro usuario un con el email: "+ email);
            return userDTO;
        } catch (error) {
            console.error("Error al buscar usuario por email en el servicio \"buscarUserDTOPorEmail(email)\": ", error);
            throw error;
        }
    }
}

export default new UserService();