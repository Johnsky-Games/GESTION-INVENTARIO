import Product from '../models/Product.js';

// Controlador para obtener todos los productos
export const getAllProducts = async (req, res) => {
    try {
        // Recupera todos los productos de la base de datos
        const products = await Product.find();

        // Responde con la lista de productos en formato JSON
        res.status(200).json(products);
    } catch (error) {
        console.log('Error al obtener los prodcutos.', error.message);
        res.status(500).json({ message: 'Error al obtener los productos.' });
    }
};

// Controlador para crar un nuevo producto
export const createProduct = async (req, res) => {
    try {
        // Crea un nuevo producto basado en los datos en el cuerpo de la solicitud
        const newProduct = new Product(req.body);

        // Guarda el producto en la base de datos
        await newProduct.save();

        //Responde con el producto creado
        res.status(201).json(newProduct);
    } catch (error) {
        console.log('Error al crear el producto: ', error.message);
        res.status(500).json({ message: 'Error al crear el producto.' });
    }
};

// COntorlador para actualizar un producto existente
export const updateProduct = async (req, res) => {
    const { id } = req.params; // Obtiene el ID del producto desde los parametros  de la URL

    try {
        // Busca el producto por ID y lo actualiza con los datos proporcionados

        const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true, // Devuelve el producto actualizado
            runValidators: true // Asegura que los validadores del modelo se ejecuten
        });

        if (!updateProduct) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        res.status(200).json(updateProduct); // Responde con el producto actualizado
    } catch (error) {
        console.log('Error al actualizar el producto: ', error.message);
        res.status(500).json({ message: 'Errror al actualizar el producto.' });
    }

};

// Controlador para eliminar un producto
export const deleteProduct = async (req, res) => {
    const { id } = req.params; // Obtiene el ID del producto desde los parámetros de la URL

    try {
        const deleteItem = await Product.findByIdAndDelete(id); // Elimina el producto por su ID

        if (!deleteItem) {
            return res.status(404).json({ message: 'Producto no encontrado.' })
        }

        res.status(200).json({ message: 'Producto eliminado correctamente.' })
    } catch (error) {
        console.log('Error al eliminar el producto', error.message);
        res.status(500).json({ message: 'Error al eliminar el producto.' });
    }

};