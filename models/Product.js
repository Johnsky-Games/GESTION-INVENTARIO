import mongoose from "mongoose"; // Importa mongoose para trabajar con Mongoose

// Define el esquema del producto
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // El nombre es olbligatorio
    },
    description: {
        type: String,
        required: true // La descripción es olbligatoria
    },
    price: {
        type: Number,
        required: true // El precio es obligatorio
    },
    quantity: {
        type: Number,
        required: true // La cantidad es obligatoria
    },
    dateAdded: {
        type: Date,
        default: Date.now // La fecha de adición se establece por defecto al momento actual 
    }
});

// Crea el modelo del prodcuto basado en el esquema

const Product = mongoose.model('Product', productSchema);

export default Product; // Exporta el modelo para su uso en otros archivos