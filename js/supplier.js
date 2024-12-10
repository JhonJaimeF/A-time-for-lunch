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

// Mostrar modal Crear
document.getElementById('crear').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'flex';
});

// Cerrar modal Crear
document.getElementById('close-crear').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

// Cerrar modal Crear al hacer clic fuera de él
window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
      modal.style.display = 'none';
  }
});


// Mostrar modal Actualizar
document.getElementById('actualizar').addEventListener('click', () => {
  document.getElementById('modal-update').style.display = 'flex';
});

// Cerrar modal Actualizar
document.getElementById('close-update').addEventListener('click', () => {
  document.getElementById('modal-update').style.display = 'none';
});

// Cerrar modal Actualizar al hacer clic fuera de él
window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal-update');
  if (event.target === modal) {
      modal.style.display = 'none';
  }
});


// Mostrar modal Eliminar
document.getElementById('eliminar').addEventListener('click', () => {
  document.getElementById('modal-delete').style.display = 'flex';
});

// Cerrar modal Eliminar
document.getElementById('close-delete').addEventListener('click', () => {
  document.getElementById('modal-delete').style.display = 'none';
});

// Cerrar modal Eliminar al hacer clic fuera de él
window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal-delete');
  if (event.target === modal) {
      modal.style.display = 'none';
  }
});




