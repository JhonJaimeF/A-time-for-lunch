async function registrarLog(accion) {
    const correo = localStorage.getItem('email');
    
    if (!correo) {
        console.error('No se puede registrar el log: correo no encontrado en localStorage');
        return;
    }

    const logData = {
        correo,
        accion,
        usuario: 'administor',
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    };

    try {
        const response = await fetch('https://logs-d4hu.onrender.com/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logData)
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(`Error ${response.status}: ${errorMsg}`);
        }

        console.log('Log registrado exitosamente:', logData);
    } catch (error) {
        console.error('Error al registrar log:', error.message);
    }
}

// Redirigir a la página de inicio de sesión si no hay token
if (!localStorage.getItem('authToken')) {
    registrarLog('Intento de acceso sin token');
    window.location.href = '/login.html';
}

// Prevenir navegación hacia atrás
window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
    window.location.reload();
};

// Manejo de cierre de sesión
document.getElementById('logoutButton').addEventListener('click', async () => {
    await registrarLog('Cierre de sesión');
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/login.html';
});

// Verificación de correo en carga de página
window.onload = function() {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail !== "attimeforlunch@gmail.com") {
        registrarLog('Intento de acceso con correo no autorizado');
        window.location.href = "/login.html";
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const supplierDataUrl = "https://back-end-atime-for-lunch-git-main-jhonjaimefs-projects.vercel.app/supplier";
    const supplierSelect = document.getElementById('supplierSelect');
    const supplierTableBody = document.getElementById('supplierTableBody');
    const supplierProductsTableBody = document.getElementById('supplierProductsTableBody');

    // Fetch suppliers and populate select
    fetch(supplierDataUrl)
        .then(response => response.json())
        .then(result => {
            if (result.state && Array.isArray(result.data)) {
                result.data.forEach(supplier => {
                    const option = document.createElement('option');
                    option.value = supplier._id;
                    option.textContent = supplier.name;
                    supplierSelect.appendChild(option);
                });

                // Cargar productos del primer proveedor automáticamente
                if (result.data.length > 0) {
                    supplierSelect.value = result.data[0]._id;
                    supplierSelect.dispatchEvent(new Event('change'));
                }

                // Añadir evento change al select
                supplierSelect.addEventListener('change', async function () {
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

                    // Fetch productos del proveedor seleccionado
                    try {
                        await registrarLog(`Consulta de productos para proveedor ID: ${selectedSupplierId}`);
                        const response = await fetch(`https://back-end-atime-for-lunch-git-main-jhonjaimefs-projects.vercel.app/product/supplier/${selectedSupplierId}`);
                        const productsResult = await response.json();

                        if (Array.isArray(productsResult.data)) {
                            let rows = '';
                            productsResult.data.forEach(product => {
                                rows += `
                                    <tr>
                                        <td>${product.name}</td>
                                        <td>${product.description}</td>
                                        <td>${product.price}</td>
                                    </tr>
                                `;
                            });
                            supplierProductsTableBody.innerHTML = rows;
                        } else {
                            supplierProductsTableBody.innerHTML = `<tr><td colspan="3">No products available</td></tr>`;
                        }
                    } catch (error) {
                        await registrarLog(`Error al consultar productos para proveedor ID: ${selectedSupplierId} - ${error.message}`);
                        console.error('Error fetching products:', error);
                        supplierProductsTableBody.innerHTML = `<tr><td colspan="3">Error fetching products</td></tr>`;
                    }
                });
            } else {
                console.error('Error: Expected an array but got', result);
            }
        })
        .catch(async error => {
            await registrarLog(`Error al consultar proveedores: ${error.message}`);
            console.error('Error fetching suppliers:', error);
        });

    // Mostrar modal Crear Proveedor
    document.getElementById('crear').addEventListener('click', async () => {
        await registrarLog('Abrir modal de creación de proveedor');
        document.getElementById('modal').style.display = 'flex';
    });

    // Cerrar modal Crear Proveedor
    document.getElementById('close-crear').addEventListener('click', async () => {
        await registrarLog('Cerrar modal de creación de proveedor');
        document.getElementById('modal').style.display = 'none';
    });

    // Mostrar modal Crear Producto
    document.getElementById('crear-producto').addEventListener('click', async () => {
        await registrarLog('Abrir modal de creación de producto');
        await cargarProveedores();
        document.getElementById('modal-update').style.display = 'flex';
    });

    // Cerrar modal Crear Producto
    document.getElementById('close-update').addEventListener('click', async () => {
        await registrarLog('Cerrar modal de creación de producto');
        document.getElementById('modal-update').style.display = 'none';
    });

    // Cerrar modales al hacer clic fuera
    const modal = document.getElementById('modal');
    const modalUpdate = document.getElementById('modal-update');
    window.addEventListener('click', async (event) => {
        if (event.target === modal) {
            await registrarLog('Cerrar modal de proveedor por clic fuera');
            modal.style.display = 'none';
        } else if (event.target === modalUpdate) {
            await registrarLog('Cerrar modal de producto por clic fuera');
            modalUpdate.style.display = 'none';
        }
    });

    // Función para cargar proveedores en el select
    async function cargarProveedores() {
        try {
            await registrarLog('Carga de lista de proveedores');
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
            await registrarLog(`Error al cargar proveedores: ${error.message}`);
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

        try {
            const response = await fetch('https://back-end-atime-for-lunch-git-main-jhonjaimefs-projects.vercel.app/supplier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                await registrarLog(`Proveedor registrado: ${data.name}`);
                alert('Proveedor registrado correctamente.');
                await cargarProveedores();
                window.location.href = "/supplier.html";
                document.getElementById('modal').style.display = 'none';
            } else {
                const errorMsg = await response.text();
                await registrarLog(`Error al registrar proveedor: ${data.name} - ${errorMsg}`);
                console.error('Error al registrar el proveedor:', errorMsg);
                alert(`Error al registrar el proveedor: ${errorMsg}`);
            }
        } catch (error) {
            await registrarLog(`Error al registrar proveedor: ${data.name} - ${error.message}`);
            console.error('Error al registrar el proveedor:', error);
            alert(`Error al registrar el proveedor: ${error.message}`);
        }
    });

    // Registrar Producto
    document.getElementById('form-crear-producto').addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = {
            externalId: document.getElementById('externalId-product').value,
            name: document.getElementById('nombre-producto').value,
            description: document.getElementById('descripcion-producto').value,
            price: parseFloat(document.getElementById('precio-producto').value),
            category: document.getElementById('categoria-producto').value,
            supplier: document.getElementById('proveedor-producto').value
        };

        try {
            const response = await fetch(`https://back-end-atime-for-lunch-git-main-jhonjaimefs-projects.vercel.app/product/${data.supplier}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                await registrarLog(`Producto registrado: ${data.name}`);
                alert('Producto registrado correctamente.');
                window.location.href = "/supplier.html";
                document.getElementById('modal-update').style.display = 'none';
            } else {
                const errorMsg = await response.text();
                await registrarLog(`Error al registrar producto: ${data.name} - ${errorMsg}`);
                console.error('Error al registrar el producto:', errorMsg);
                alert(`Error al registrar el producto: ${errorMsg}`);
            }
        } catch (error) {
            await registrarLog(`Error al registrar producto: ${data.name} - ${error.message}`);
            console.error('Error al registrar el producto:', error);
            alert(`Error al registrar el producto: ${error.message}`);
        }
    });

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

    categoriaInput.parentNode.replaceChild(categoriaSelect, categoriaInput);

    // Validación del formulario de producto
    const form = document.getElementById('form-crear-producto');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        let esValido = true;

        document.querySelectorAll('.error-mensaje').forEach(el => el.remove());

        // Validar External ID
        const externalId = document.getElementById('externalId-product');
        const externalIdValor = externalId.value.trim();
        if (externalIdValor.length < 4) {
            mostrarError(externalId, 'El ID externo debe tener al menos 4 caracteres');
            esValido = false;
        } else if (!/^[a-zA-Z0-9]+$/.test(externalIdValor)) {
            mostrarError(externalId, 'El ID externo solo puede contener letras y números');
            esValido = false;
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

        if (!esValido) {
            await registrarLog('Intento fallido de registro de producto: validación fallida');
            event.stopPropagation();
            return;
        }

        // Si la validación pasa, el evento submit original continuará
        form.dispatchEvent(new Event('submit', { cancelable: true }));
    });

    // Función para mostrar errores
    function mostrarError(elemento, mensaje) {
        const errorExistente = elemento.nextElementSibling;
        if (errorExistente && errorExistente.classList.contains('error-mensaje')) {
            errorExistente.remove();
        }

        const mensajeError = document.createElement('div');
        mensajeError.textContent = mensaje;
        mensajeError.classList.add('error-mensaje');
        mensajeError.style.color = 'red';
        mensajeError.style.fontSize = '0.8em';
        mensajeError.style.marginTop = '5px';
        elemento.parentNode.insertBefore(mensajeError, elemento.nextSibling);
    }
});