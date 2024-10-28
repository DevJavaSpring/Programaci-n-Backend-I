import {mongoose} from 'mongoose';

const productCollection = "productos"

const productSchema = new mongoose.Schema({
    title:       { type: String,   required: true,  maxlength: 200 },
    description: { type: String,   required: true,  maxlength: 200 },
    code:        { type: String,   required: true,  maxlength: 100 },
    price:       { type: Number,   required: true,  min: 0, max: 1000000 },
    status:      { type: Boolean,  required: true, default: true },
    stock:       { type: Number,   required: true,  min: 0, max: 100000 },
    category:    { type: String,   required: true,  maxlength: 100, default: 'cateoria sin definir',
                   enum: { values:['verduleria', 'carniceria', 'almacen', 'limpieza', 'fiambres', 'lacteos', 'cateoria sin definir'], 
                           message: 'categoria que ingreso no es valida.'}, },
    thumbnails:  { type: [String], required: false,  default: ['thumbnails 1', 'thumbnails 2']}
})

const productModel = mongoose.model(productCollection, productSchema)

export default productModel;