// Borra todo el contenido de localStorage cuando se carga la página
window.onload = function() {
    localStorage.clear();

    // Verifica si el valor de localStorage corresponde al correo esperado o está vacío/nulo
    const storedEmail = localStorage.getItem("email");

    if (!storedEmail || storedEmail !== "attimeforlunch@gmail.com") {
        // Redirige a la página de login si el correo no coincide, es nulo o está vacío
        window.location.href = "login.html";
    }
};


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
      document.getElementById('modal').style.display = 'none';
    } else {
      console.error('Error al registrar el proveedor:', await response.text());
    }
  } catch (error) {
    console.error('Error al registrar el proveedor:', error);
  }
});

// Registrar Producto
document.getElementById('form-crear-producto').addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = {
    externalId:document.getElementById('externalId').value,
    name: document.getElementById('nombre-producto').value,
    description: document.getElementById('descripcion-producto').value,
    price: parseFloat(document.getElementById('precio-producto').value),
    category: document.getElementById('categoria-producto').value,
    supplier: document.getElementById('proveedor-producto').value
  };

  console.log(data)

  try {
    const response = await fetch(`https://back-end-atime-for-lunch-git-main-jhonjaimefs-projects.vercel.app/product/${data.supplier}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      alert('Producto registrado correctamente.');
      document.getElementById('modal-update').style.display = 'none';
    } else {
      console.error('Error al registrar el producto:', await response.text());
    }
  } catch (error) {
    console.error('Error al registrar el producto:', error);
  }
});
