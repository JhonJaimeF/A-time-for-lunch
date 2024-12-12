document.addEventListener('DOMContentLoaded', function () {
  const supplierDataUrl = "https://back-end-atime-for-lunch-git-main-jhonjaimefs-projects.vercel.app/supplier"; // URI para los proveedores
  const supplierSelect = document.getElementById('supplierSelect');

  const supplierTableBody = document.getElementById('supplierTableBody');
  const supplierProductsTableBody = document.getElementById('supplierProductsTableBody');

  // Fetch suppliers and populate select
  fetch(supplierDataUrl)
    .then(response => response.json())
    .then(result => {
      if (result.state && Array.isArray(result.data)) {
        // Poblar el <select> con los proveedores
        result.data.forEach(supplier => {
          const option = document.createElement('option');
          option.value = supplier._id;
          option.textContent = supplier.name;
          supplierSelect.appendChild(option);
        });

        // Añadir evento change al <select>
        supplierSelect.addEventListener('change', function () {
          const selectedSupplierId = supplierSelect.value;
          const selectedSupplier = result.data.find(supplier => supplier._id === selectedSupplierId);

          // Actualizar tabla de detalles del proveedor
          if (selectedSupplier) {
            supplierTableBody.innerHTML = `
              <tr>
                <td>${selectedSupplier.name}</td>
                <td>${selectedSupplier.phone}</td>
                <td>${selectedSupplier.email}</td>
                <td>${selectedSupplier.address.street}</td>
                <td>${selectedSupplier.address.city}</td>
              </tr>
            `;

          } else {
            supplierTableBody.innerHTML = `<tr><td colspan="5">No supplier selected</td></tr>`;
          }
          // Fetch para obtener productos del proveedor seleccionado

        fetch(`https://back-end-atime-for-lunch-git-main-jhonjaimefs-projects.vercel.app/product/supplier/${selectedSupplierId}`)
            .then(response => response.json())
            .then(productsResult => {
              
                console.log(productsResult.data)

                if (Array.isArray(productsResult.data)) {
                  let rows = ''; // Acumula todas las filas aquí
                  productsResult.data.forEach(product => {
                    rows += `
                      <tr>
                        <td>${product.name}</td>
                        <td>${product.description}</td>
                        <td>${product.price}</td>
                      </tr>
                    `;
                  });
                  supplierProductsTableBody.innerHTML = rows; // Asigna todas las filas al final
                } else {
                  supplierProductsTableBody.innerHTML = `<tr><td colspan="3">No products available</td></tr>`;
                }
              })
            .catch(error => {
              console.error('Error fetching products:', error);
              supplierProductsTableBody.innerHTML = `<tr><td colspan="3">Error fetching products</td></tr>`;
            });
        });
      } else {
        console.error('Error: Expected an array but got', result);
      }
    })
    .catch(error => console.error('Error fetching suppliers:', error));
});

// Mostrar modal Crear Proveedor
document.getElementById('crear').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'flex';
});

// Cerrar modal Crear Proveedor
document.getElementById('close-crear').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

// Mostrar modal Crear Producto
document.getElementById('crear-producto').addEventListener('click', () => {
  cargarProveedores(); // Carga la lista de proveedores antes de mostrar el modal
  document.getElementById('modal-update').style.display = 'flex';
});

// Cerrar modal Crear Producto
document.getElementById('close-update').addEventListener('click', () => {
  document.getElementById('modal-update').style.display = 'none';
});

// Función para cargar proveedores en el select
async function cargarProveedores() {
  try {
    const response = await fetch('https://back-end-atime-for-lunch-git-main-jhonjaimefs-projects.vercel.app/supplier');
    const proveedores = await response.json();
    const select = document.getElementById('proveedor-producto');
    select.innerHTML = '<option value="">-- Selecciona un Proveedor --</option>';
    proveedores.data.forEach(proveedor => {
      const option = document.createElement('option');
      option.value = proveedor._id;
      option.textContent = proveedor.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar los proveedores:', error);
  }
}

// Registrar Proveedor
document.getElementById('form-crear-proveedor').addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = {
    externalId: document.getElementById('externalId').value,
    name: document.getElementById('nombre-proveedor').value,
    phone: document.getElementById('telefono-proveedor').value,
    email: document.getElementById('email-proveedor').value,
    address: {
      street: document.getElementById('direccion-calle').value,
      city: document.getElementById('direccion-ciudad').value
    }
  };

  console.log("datos", data);

  try {
    const response = await fetch('https://back-end-atime-for-lunch-git-main-jhonjaimefs-projects.vercel.app/supplier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      alert('Proveedor registrado correctamente.');
      cargarProveedores
      window.location.href = "/supplier.html";
      document.getElementById('modal').style.display = 'none';
    } else {
      const errorMsg = await response.text();
      console.error('Error al registrar el proveedor:', errorMsg);
      alert(`Error al registrar el proveedor: ${errorMsg}`);
    }
  } catch (error) {
    console.error('Error al registrar el proveedor:', error);
    alert(`Error al registrar el proveedor: ${error.message}`);
  }
  
});

// Registrar Producto
document.getElementById('form-crear-producto').addEventListener('submit', async (event) => {
  event.preventDefault();
const data = {
    externalId: document.getElementById('externalId-product').value, 
    name : document.getElementById('nombre-producto').value, 
    description: document.getElementById('descripcion-producto').value, 
    price: parseInt((document.getElementById('precio-producto').value)), 
    category: document.getElementById('categoria-producto').value,
    supplier : document.getElementById('proveedor-producto').value
  }

  console.log(data);

  try {
    const response = await fetch(`https://back-end-atime-for-lunch-git-main-jhonjaimefs-projects.vercel.app/product/${data.supplier}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      alert('Producto registrado correctamente.');
      window.location.href = "/supplier.html";
      document.getElementById('modal-update').style.display = 'none';
    } else {
      const errorMsg = await response.text();
      
      console.error('Error al registrar el producto:', errorMsg);
      alert(`Error al registrar el producto: ${errorMsg} ${data.externalId}`);
    }
  } catch (error) {
    console.error('Error al registrar el producto:', error);
    alert(`Error al registrar el producto: ${error.message}`);
  }
});

  // Cerrar el modal al hacer clic fuera de él
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});



document.addEventListener('DOMContentLoaded', function() {
  // Cargar categorías en el select de categoría
  const categoriaInput = document.getElementById('categoria-producto');
  const categoriaSelect = document.createElement('select');
  categoriaSelect.id = 'categoria-producto';
  categoriaSelect.name = 'category';
  categoriaSelect.className = 'form-control';
  categoriaSelect.required = true;

  const categorias = ['', 'frutas', 'verduras', 'cristaleria', 'muebles'];
  categorias.forEach(categoria => {
      const option = document.createElement('option');
      option.value = categoria;
      option.textContent = categoria === '' ? '-- Selecciona una Categoría --' : categoria;
      categoriaSelect.appendChild(option);
  });

  // Reemplazar el input de categoría con el select
  categoriaInput.parentNode.replaceChild(categoriaSelect, categoriaInput);

  // Obtener el formulario
  const form = document.getElementById('form-crear-producto');

  // Función de validación
  form.addEventListener('submit', function(event) {
      // Prevenir el envío por defecto
      event.preventDefault();

      // Bandera de validación
      let esValido = true;

      
      document.querySelectorAll('.error-mensaje').forEach(el => el.remove());

      // Validar External ID
      
      const externalId = document.getElementById('externalId-product');
      const externalIdValor = externalId.value.trim();

      // Validaciones específicas para external ID
      if (externalIdValor.length < 4) {
          esValido = false;
      } else if (!/^[a-zA-Z0-9]+$/.test(externalIdValor)) {
          esValido = true;
      }

      // Validar Precio
      const precio = document.getElementById('precio-producto');
      const precioValor = parseFloat(precio.value);
      if (isNaN(precioValor) || precioValor <= 0) {
          mostrarError(precio, 'El precio debe ser un número mayor a cero');
          esValido = false;
      }

      // Validar Categoría
      const categoria = document.getElementById('categoria-producto');
      if (!categoria.value) {
          mostrarError(categoria, 'Debe seleccionar una categoría');
          esValido = false;
      }

      // Si todo es válido, enviar formulario
      if (!esValido) {
        // Prevenir que se cierre el modal
        event.stopPropagation();
        return;
    }
  });

  // Función para mostrar errores
  function mostrarError(elemento, mensaje) {
      // Remover errores previos
      const errorExistente = elemento.nextElementSibling;
      if (errorExistente && errorExistente.classList.contains('error-mensaje')) {
          errorExistente.remove();
      }

      // Crear mensaje de error
      const mensajeError = document.createElement('div');
      mensajeError.textContent = mensaje;
      mensajeError.classList.add('error-mensaje');
      mensajeError.style.color = 'red';
      mensajeError.style.fontSize = '0.8em';
      mensajeError.style.marginTop = '5px';

      // Insertar mensaje después del elemento
      elemento.parentNode.insertBefore(mensajeError, elemento.nextSibling);
  }
});