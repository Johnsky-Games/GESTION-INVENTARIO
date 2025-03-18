/**
 * @jest-environment jsdom
 */

describe('Inventory Script', () => {
    // Helper para que se resuelvan todas las promesas pendientes en Jest
    function flushPromises() {
      return new Promise(resolve => setTimeout(resolve, 0));
    }
  
    beforeEach(() => {
      // 1) Mock por defecto: si el código llama a fetch más veces de las previstas,
      //    devolvemos { ok: true, json: [] } para evitar "undefined".
      window.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      });
  
      // 2) Preparamos el DOM que tu script necesita
      document.body.innerHTML = `
        <table id="inventory">
          <tbody></tbody>
        </table>
        <form id="product-form">
          <input id="product-name" />
          <input id="product-description" />
          <input id="product-price" />
          <input id="product-quantity" />
          <button id="add-product" type="submit">Añadir</button>
        </form>
      `;
  
      // Limpia el cache de módulos para que cada test cargue 'script.js' de cero
      jest.resetModules();
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    // Dispara DOMContentLoaded para que script.js ejecute fetchProducts()
    function triggerDOMContentLoaded() {
      document.dispatchEvent(new Event('DOMContentLoaded'));
    }
  
    test('displays "no products" message when API returns an empty array', async () => {
      // Ajustamos la PRIMERA llamada a fetch => []
      window.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });
  
      require('../script.js');
      triggerDOMContentLoaded();
      await flushPromises();
  
      const inventoryList = document.querySelector('#inventory tbody');
      expect(inventoryList.textContent).toContain('No se han agregado productos aún...');
    });
  
    test('displays product rows when API returns products', async () => {
      const products = [
        { _id: '1', name: 'Product 1', description: 'Desc 1', price: 10, quantity: 5 },
        { _id: '2', name: 'Product 2', description: 'Desc 2', price: 20, quantity: 3 },
      ];
  
      // fetchProducts => products
      window.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => products,
      });
  
      require('../script.js');
      triggerDOMContentLoaded();
      await flushPromises();
  
      const inventoryList = document.querySelector('#inventory tbody');
      expect(inventoryList.children.length).toBe(2);
      expect(inventoryList.children[0].textContent).toContain('Product 1');
      expect(inventoryList.children[0].textContent).toContain('Desc 1');
    });
  
    test('fills the form when edit button is clicked', async () => {
      const product = { _id: '1', name: 'Product 1', description: 'Desc 1', price: 10, quantity: 5 };
  
      // 1) fetchProducts => [product]
      window.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [product],
      });
  
      require('../script.js');
      triggerDOMContentLoaded();
      await flushPromises();
  
      // Debe existir un botón .edit-product
      const editButton = document.querySelector('.edit-product');
      expect(editButton).not.toBeNull();
  
      // 2) fillForm => /api/products/1 => product
      window.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => product,
      });
  
      editButton.click();
      await flushPromises();
  
      expect(document.getElementById('product-name').value).toBe('Product 1');
      expect(document.getElementById('product-description').value).toBe('Desc 1');
      expect(document.getElementById('product-price').value).toBe('10');
      expect(document.getElementById('product-quantity').value).toBe('5');
    });
  
    test('calls createProduct on form submit when not editing', async () => {
      const newProduct = { name: 'New Product', description: 'New Desc', price: 15, quantity: 2 };
  
      // 1) fetchProducts => []
      // 2) create => ok
      // 3) fetchProducts => [ { ...newProduct, _id: '123' } ]
      window.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ ...newProduct, _id: '123' }],
        });
  
      require('../script.js');
      triggerDOMContentLoaded();
      await flushPromises();
  
      // Llenar el form
      document.getElementById('product-name').value = newProduct.name;
      document.getElementById('product-description').value = newProduct.description;
      document.getElementById('product-price').value = String(newProduct.price);
      document.getElementById('product-quantity').value = String(newProduct.quantity);
  
      // Enviar
      const form = document.getElementById('product-form');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await flushPromises();
  
      // 3 llamadas => GET inicial, POST create, GET después de crear
      expect(window.fetch).toHaveBeenCalledTimes(3);
  
      // Verificamos que la 2ª llamada es POST a /api/products
      const postCall = window.fetch.mock.calls[1];
      expect(postCall[0]).toBe('/api/products');
      expect(postCall[1].method).toBe('POST');
    });
  
    test('calls updateProduct on form submit when editing an existing product', async () => {
      const existingProduct = { _id: '1', name: 'Old', description: 'Old Desc', price: 5, quantity: 1 };
  
      // 1) fetchProducts => [existingProduct]
      window.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [existingProduct],
      });
  
      require('../script.js');
      triggerDOMContentLoaded();
      await flushPromises();
  
      // .edit-product
      const editButton = document.querySelector('.edit-product');
      expect(editButton).not.toBeNull();
  
      // 2) fillForm => /api/products/1 => existingProduct
      window.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => existingProduct,
      });
      editButton.click();
      await flushPromises();
  
      // Cambiamos el form
      document.getElementById('product-name').value = 'Updated Name';
      document.getElementById('product-description').value = 'Updated Desc';
      document.getElementById('product-price').value = '50';
      document.getElementById('product-quantity').value = '10';
  
      // 3) PUT => /api/products/1
      window.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });
      // 4) fetchProducts => []
      window.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });
  
      // Submit
      const form = document.getElementById('product-form');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await flushPromises();
  
      // Verificamos que una de las llamadas fue PUT a /api/products/1
      const putCall = window.fetch.mock.calls.find(call => call[1]?.method === 'PUT');
      expect(putCall[0]).toBe('/api/products/1');
    });
  
    test('calls deleteProduct on delete button click and confirms deletion', async () => {
      const product = { _id: '1', name: 'Product 1', description: 'Desc 1', price: 10, quantity: 5 };
  
      // 1) fetchProducts => [product]
      window.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [product],
      });
  
      require('../script.js');
      triggerDOMContentLoaded();
      await flushPromises();
  
      const deleteButton = document.querySelector('.delete-product');
      expect(deleteButton).not.toBeNull();
  
      // confirm => true
      window.confirm = jest.fn().mockReturnValue(true);
  
      // 2) DELETE => ok
      window.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });
      // 3) fetchProducts => []
      window.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });
  
      deleteButton.click();
      await flushPromises();
  
      expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de que quieres eliminar este producto?');
  
      const deleteCall = window.fetch.mock.calls.find(call => call[1]?.method === 'DELETE');
      expect(deleteCall[0]).toBe('/api/products/1');
    });
  });
  