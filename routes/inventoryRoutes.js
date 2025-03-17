import express from 'express';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../controllers/inventoryController.js';

const router = express.Router();

// Ruta para obtener todos los productos en el inventario
router.get('/', getAllProducts);

//Ruta para crear un nuevo producto
router.post('/', createProduct);

// Ruta para actualizar el producto
router.put('/:id', updateProduct);

//Ruta para eliminar un producto
router.delete('/:id', deleteProduct);

export default router;