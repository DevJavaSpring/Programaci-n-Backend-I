import {mongoose} from 'mongoose';

const userCollection = "usuarios"

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true },
    last_name: {
        type: String,
        required: true },
    email: {
        type: String,
        required: true,
        unique: true, // Asegura que el email sea único
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }, // Validación básica de email
    age: {
        type: Number,
        required: true },
    password: {
        type: String,
        required: true },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carritos', 
        default: null  },
    role: {
        type: String,
        default: 'user', // Valor predeterminado para el rol
        enum: ['user', 'admin'] } // Opciones válidas para role
})

const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel;