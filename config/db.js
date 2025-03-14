import mongoose from "mongoose";

const dbURI = 'mongodb://localhost:27017/gestion_inventario';

// Función para conectarse a la base de datos

const connectDB = async () => {
    try {
        // Intenta conectarse a la base de datos usando mongoose.connect
        await mongoose.connect(dbURI);
        console.log('Conección a MongoDB establecida correctamente');
    } catch (error) {
        console.log('Error al conectar con MongoDB: ', error.message);
        process.exit(1); // Sale del proceso con 1 error
    }
};

export default connectDB; // Esporta la función connectDB para que pueda ser utilizada en otros archivos