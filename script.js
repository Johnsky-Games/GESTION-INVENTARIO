/**
 * Script para gestionar el inventario: obtener, crear, actualizar y eliminar productos.
 * Se comunica con una API en http://localhost:3000/api/inventory.
 * 
 * @author 
 * @version 1.0
 */
document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const inventoryList = document.getElementById('inventory').querySelector('tbody');
    const addProductForm = document.getElementById('product-form');
    const productNameInput = document.getElementById('product-name');
    const productDescriptionInput = document.getElementById('product-description');
    const productPriceInput = document.getElementById('product-price');
    const productQuantityInput = document.getElementById('product-quantity');
    const addProductBtn = document.getElementById('add-product');
    
    // Variables para el manejo de estado de edición
    let currentProductId = null;  // ID del producto en edición
    let updateProductBtn = null;  // Botón "Actualizar" creado dinámicamente

    /**
     * Obtiene los productos desde la API y actualiza la tabla.
     */
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/inventory');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const products = await response.json();
            inventoryList.innerHTML = ''; // Limpia la lista existente

            if (products.length === 0) {
                showNoProductsMessage();
            } else {
                products.forEach(product => {
                    inventoryList.appendChild(createProductRow(product));
                });
            }
        } catch (error) {
            console.error('Error al obtener los productos', error);
        }
    }

    /**
     * Crea y retorna una fila de la tabla para un producto dado.
     * @param {Object} product - Objeto con los datos del producto.
     * @returns {HTMLTableRowElement} Fila de la tabla.
     */
    function createProductRow(product) {
        const row = document.createElement('tr');

        // Crea las celdas con la información del producto
        row.appendChild(createCell(product.name));
        row.appendChild(createCell(product.description));
        row.appendChild(createCell(`$ ${product.price}`));
        row.appendChild(createCell(product.quantity));

        // Crea la celda de acciones: editar y eliminar
        const actionsCell = document.createElement('td');
        actionsCell.appendChild(createEditButton(product));
        actionsCell.appendChild(createDeleteButton(product));
        row.appendChild(actionsCell);

        return row;
    }

    /**
     * Crea y retorna una celda para una tabla.
     * @param {string|number} text - Texto o número a mostrar en la celda.
     * @returns {HTMLTableCellElement} Celda creada.
     */
    function createCell(text) {
        const cell = document.createElement('td');
        cell.textContent = text;
        return cell;
    }

    /**
     * Crea y retorna un botón de editar con su evento asociado.
     * @param {Object} product - Objeto del producto.
     * @returns {HTMLButtonElement} Botón de editar.
     */
    function createEditButton(product) {
        const btn = document.createElement('button');
        btn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        btn.classList.add('edit-product');
        btn.addEventListener('click', () => {
            fillForm(product);
            currentProductId = product._id;
            toggleButtons(true);
        });
        return btn;
    }

    /**
     * Crea y retorna un botón de eliminar con su evento asociado.
     * @param {Object} product - Objeto del producto.
     * @returns {HTMLButtonElement} Botón de eliminar.
     */
    function createDeleteButton(product) {
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        btn.classList.add('delete-product');
        btn.addEventListener('click', () => {
            currentProductId = product._id;
            deleteProduct();
        });
        return btn;
    }

    /**
     * Muestra un mensaje en la tabla indicando que no hay productos.
     */
    function showNoProductsMessage() {
        const noProductRow = document.createElement('tr');
        const noProductCell = document.createElement('td');
        noProductCell.colSpan = 5;
        noProductCell.textContent = 'No se han agregado productos aún...';
        noProductCell.classList.add('no-list');
        noProductRow.appendChild(noProductCell);
        inventoryList.appendChild(noProductRow);
    }

    /**
     * Manejador del evento submit del formulario para añadir o actualizar un producto.
     * @param {Event} event - Evento submit.
     */
    async function addProduct(event) {
        event.preventDefault();

        const newProduct = {
            name: productNameInput.value,
            description: productDescriptionInput.value,
            price: parseFloat(productPriceInput.value),
            quantity: parseFloat(productQuantityInput.value)
        };

        if (currentProductId) {
            await updateProduct(newProduct);
        } else {
            await createProduct(newProduct);
        }
    }

    /**
     * Envía una solicitud POST a la API para crear un nuevo producto.
     * @param {Object} product - Datos del nuevo producto.
     */
    async function createProduct(product) {
        try {
            const response = await fetch('http://localhost:3000/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            await fetchProducts();
            addProductForm.reset();
            toggleButtons(false);
        } catch (error) {
            console.error('Error al añadir el producto:', error);
        }
    }

    /**
     * Envía una solicitud PUT a la API para actualizar un producto existente.
     * @param {Object} product - Datos actualizados del producto.
     */
    async function updateProduct(product) {
        try {
            const response = await fetch(`http://localhost:3000/api/inventory/${currentProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            await fetchProducts();
            addProductForm.reset();
            currentProductId = null;
            toggleButtons(false);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    }

    /**
     * Elimina un producto tras confirmar la acción.
     */
    async function deleteProduct() {
        const confirmation = confirm('¿Estás seguro de que quieres eliminar este producto?');
        if (!confirmation) return;

        try {
            const response = await fetch(`http://localhost:3000/api/inventory/${currentProductId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            await fetchProducts();
            currentProductId = null;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }

    /**
     * Alterna la visibilidad de los botones de "Añadir" y "Actualizar".
     * @param {boolean} isEditing - Indica si se encuentra en modo edición.
     */
    function toggleButtons(isEditing) {
        if (isEditing) {
            addProductBtn.style.display = 'none';
            if (!updateProductBtn) {
                updateProductBtn = document.createElement('button');
                updateProductBtn.textContent = 'Actualizar';
                updateProductBtn.classList.add('update-product');
                addProductForm.appendChild(updateProductBtn);
                updateProductBtn.addEventListener('click', addProduct);
            }
            updateProductBtn.style.display = 'inline-block';
        } else {
            addProductBtn.style.display = 'inline-block';
            if (updateProductBtn) updateProductBtn.style.display = 'none';
        }
    }

    /**
     * Rellena el formulario con los datos del producto a editar.
     * @param {Object} product - Producto cuyos datos se cargarán en el formulario.
     */
    function fillForm(product) {
        productNameInput.value = product.name;
        productDescriptionInput.value = product.description;
        productPriceInput.value = product.price;
        productQuantityInput.value = product.quantity;
    }

    // Asocia el evento submit del formulario y carga inicial de productos
    addProductForm.addEventListener('submit', addProduct);
    fetchProducts();
});
