const {default : userDAO} = await import ('../dao/UserDAO.js');

class UserRepository {
    async findAll() {
        return await userDAO.getAllUsers();
    }

    async findById(userId) {
        return await userDAO.getUserById(userId);
    }

    async save(userData) {
        return await userDAO.createUser(userData);
    }

    async update(userId, userData) {
        return await userDAO.updateUserById(userId, userData);
    }

    async deleteById(userId) {
        return await userDAO.deleteUserById(userId);
    }

    async findByEmail(email) {
        return await userDAO.getUserByEmail(email)
    }

    async findAllDTO(DTO) {
        return await userDAO.getAllDTO(DTO);
    }

    async findByEmailDTO(email, DTO) {
        return await userDAO.getByEmailDTO(email, DTO)
    }
}

const userRepository = new UserRepository();
export default userRepository;