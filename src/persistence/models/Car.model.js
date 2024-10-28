import {mongoose} from 'mongoose';

const carCollection = "carritos"

const carSchema = new mongoose.Schema({
    products: [{
        product:  { type: mongoose.Schema.Types.ObjectId, ref: 'productos', required: true },
        cantidad: { type: Number, required: true, default: 1 }
    }],
})

const carModel = mongoose.model(carCollection, carSchema)

export default carModel;