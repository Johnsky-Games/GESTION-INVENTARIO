// Espera a que el dom este completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    const inventoryList = document.getElementById('inventory');
    const addProductForm = document.getElementById('product-form');
    const productNameInput = document.getElementById('product-name');
    const productDescriptionInput = document.getElementById('product-description');
    const productPriceInput = document.getElementById('product-price');
    const productQuantityInput = document.getElementById('product-quantity');
    const AddProductBtn = document.getElementById('add-product');

    // Función para obtener y mostrar todos los productos desde la API

    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/inventory');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const products = await response.json();

            inventoryList.innerHTML = ''; // Limpia la lista

            // Recorre los productos y crea elementos para cadda uno 
            products.forEach(product => {
                const productElement = document.createElement('li');
                productElement.textContent = `${product.name} - ${product.price} - Cantidad ${product.quantity} - Descripción: ${product.description}`;
                inventoryList.appendChild(productElement); // Añade el producto a la lista

                const editProductBtn = document.createElement('button');
                editProductBtn.textContent = 'Editar';
                editProductBtn.classList.add('edit-product');
                const deleteProductBtn = document.createElement('button');
                deleteProductBtn.textContent = 'Eliminar';
                deleteProductBtn.classList.add('delete-product');

                productElement.appendChild(editProductBtn);
                productElement.appendChild(deleteProductBtn);
            });
        } catch (error) {
            console.log('Error al obtener los productos', error); // Maneja los errores de la solicitud
        }
    }

    // Función para añadir un nuevo producto a través de la API
    async function addProduct(event) {
        event.preventDefault();

        const newProduct = {
            name: productNameInput.value,
            description: productDescriptionInput.value,
            price: parseFloat(productPriceInput.value),
            quantity: parseFloat(productQuantityInput.value)
        };

        // Consumimos la API
        try {
            const response = await fetch('http://localhost:3000/api/inventory', {
                method: 'POST', // Método POST para crear un nuevo producto
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct) // Convierte al nuevo producto en una cadena JSON
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchProducts();
            addProductForm.reset(); // Restea el formulario despúes de enviar los datos
        } catch (error) {
            console.log('Error al añadir el producto: ', error); // Maneja errores de la solicitud
        }
    }

    addProductForm.addEventListener('submit', addProduct);

    fetchProducts();

    //Función para actualiza (editar) producto

    async function addProduct(event, productId) {
        event.preventDefault();

        const products =
    }
});