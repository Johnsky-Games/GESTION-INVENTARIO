import express from 'express';

const router = express.Router();

// Ruta para obtener todos los productos en el inventario
router.get('/', (req, res) => {
    res.json({ message: 'Aquí estarán los productos del inventario' });
});

export default router;