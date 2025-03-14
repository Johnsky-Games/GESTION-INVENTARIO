import dotenv from 'dotenv';
dotenv.config(); // Carga las variables de entorno
import express from 'express'; //Importar el módulo express
const app = express(); //Crea una instancia de la aplicación express
import connectDB from './config/db.js'; // Importa la función connectDB desde la carpeta config
const PORT = process.env.PORT || 3000; // Define el puerto donde correra la aplicación

// Conectar a la base de datos
connectDB(); // Lama a la función para conectarse a la base de datos

// Middleware para parsear JSON
app.use(express.json());

// Importar las rutas
import inventoryRoutes from './routes/inventoryRoutes.js';

// Usa las rutas del inventario 
app.use('/api/inventory', inventoryRoutes);

//Define una ruta raíz que responde con un mensaje
app.get('/', (req, res) => {
    res.send('Bienvenido a la aplicación de Gestión de Inventario.');
});

// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});