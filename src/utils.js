import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export default __dirname

//const {default : bcrypt} = await import ('bcrypt');
import bcrypt from 'bcrypt';
// Hashear la contraseña
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// Validar la contraseña
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)