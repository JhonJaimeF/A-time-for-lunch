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

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const openModalButton = document.getElementById('openModalButton');
    const closeModal = document.getElementById('close-crear');
    const tableBody = document.querySelector('#transactionTable tbody');
    const form = document.getElementById('transactionForm');

    let transactionsData = [];

    // Mostrar el modal para crear una nueva transacción
    openModalButton.addEventListener('click', async () => {
        await registrarLog('Abrir modal de creación de transacción');
        form.reset();
        form.removeAttribute('data-edit-id');
        modal.style.display = 'flex';
    });

    // Cerrar el modal
    closeModal.addEventListener('click', async () => {
        await registrarLog('Cerrar modal de creación de transacción');
        modal.style.display = 'none';
    });

    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', async (event) => {
        if (event.target === modal) {
            await registrarLog('Cerrar modal de transacción por clic fuera');
            modal.style.display = 'none';
        }
    });

    // Obtener datos para la tabla
    async function fetchTransactions() {
        try {
            await registrarLog('Carga de lista de transacciones');
            const response = await fetch('https://modulo-fianciero.vercel.app/dineros');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.message || 'Error al obtener datos'}`);
            }
            const data = await response.json();
            transactionsData = data.data;
            renderTable(transactionsData);
        } catch (error) {
            await registrarLog(`Error al cargar transacciones: ${error.message}`);
            console.error('Error al cargar transacciones:', error);
            alert(`Error al cargar transacciones: ${error.message}`);
        }
    }

    // Renderizar la tabla
    function renderTable(transactions) {
        tableBody.innerHTML = '';
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.description}</td>
                <td>${transaction.value}</td>
                <td>
                    <button class="btn btn-primary edit-btn" data-id="${transaction._id}">Editar</button>
                    <button class="btn btn-danger delete-btn" data-id="${transaction._id}">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Asociar eventos a los botones de edición y eliminación
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEdit);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }

    // Validación del formulario
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        let esValido = true;

        document.querySelectorAll('.error-mensaje').forEach(el => el.remove());

        // Validar ID
        const id = form.elements['id'];
        const idValor = id.value.trim();
        if (idValor.length < 1) {
            mostrarError(id, 'El ID es obligatorio');
            esValido = false;
        } else if (!/^[a-zA-Z0-9]+$/.test(idValor)) {
            mostrarError(id, 'El ID solo puede contener letras y números');
            esValido = false;
        }

        // Validar Descripción
        const description = form.elements['description'];
        if (!description.value.trim()) {
            mostrarError(description, 'La descripción es obligatoria');
            esValido = false;
        }

        // Validar Valor
        const value = form.elements['value'];
        const valueValor = parseFloat(value.value);
        if (isNaN(valueValor) || valueValor <= 0) {
            mostrarError(value, 'El valor debe ser un número mayor a cero');
            esValido = false;
        }

        if (!esValido) {
            await registrarLog('Intento fallido de guardar transacción: validación fallida');
            event.stopPropagation();
            return;
        }

        // Si la validación pasa, ejecutar saveTransaction
        await saveTransaction(event);
    });

    // Guardar o actualizar transacción (POST o PUT)
    async function saveTransaction(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const transaction = {
            id: formData.get('id'),
            description: formData.get('description'),
            value: parseFloat(formData.get('value'))
        };

        const editId = form.getAttribute('data-edit-id');

        if (editId) {
            // Actualizar transacción existente
            try {
                await registrarLog(`Actualizar transacción ID: ${transaction.id}`);
                const response = await fetch(`https://modulo-fianciero.vercel.app/dineros/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        description: transaction.description,
                        value: transaction.value
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error ${response.status}: ${errorData.message || 'Error al actualizar'}`);
                }

                await registrarLog(`Transacción actualizada: ${transaction.id}`);
                alert('Transacción actualizada correctamente');
                modal.style.display = 'none';
                fetchTransactions();
                form.reset();
                form.removeAttribute('data-edit-id');
            } catch (error) {
                await registrarLog(`Error al actualizar transacción ID: ${transaction.id} - ${error.message}`);
                console.error('Error al actualizar la transacción:', error);
                alert(`Error: ${error.message}`);
            }
        } else {
            // Crear nueva transacción
            try {
                await registrarLog(`Crear transacción ID: ${transaction.id}`);
                const response = await fetch('https://modulo-fianciero.vercel.app/dineros', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(transaction)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error ${response.status}: ${errorData.message || 'Error al guardar'}`);
                }

                await registrarLog(`Transacción creada: ${transaction.id}`);
                alert('Transacción guardada correctamente');
                modal.style.display = 'none';
                fetchTransactions();
                form.reset();
            } catch (error) {
                await registrarLog(`Error al crear transacción ID: ${transaction.id} - ${error.message}`);
                console.error('Error al guardar la transacción:', error);
                alert(`Error: ${error.message}`);
            }
        }
    }

    // Editar transacción (PUT)
    async function handleEdit(event) {
        const transactionId = event.target.getAttribute('data-id');
        const transaction = transactionsData.find(t => t._id === transactionId);

        if (transaction) {
            await registrarLog(`Editar transacción ID: ${transaction.id}`);
            form.elements['id'].value = transaction.id;
            form.elements['description'].value = transaction.description;
            form.elements['value'].value = transaction.value;
            form.setAttribute('data-edit-id', transactionId);
            modal.style.display = 'flex';
        } else {
            await registrarLog(`Error al editar: Transacción ID ${transactionId} no encontrada`);
            console.error('Transacción no encontrada');
            alert('Transacción no encontrada');
        }
    }

    // Eliminar transacción (DELETE)
    async function handleDelete(event) {
        const transactionId = event.target.getAttribute('data-id');
        const transaction = transactionsData.find(t => t._id === transactionId);

        if (confirm('¿Estás seguro de eliminar esta transacción?')) {
            try {
                await registrarLog(`Eliminar transacción ID: ${transaction ? transaction.id : transactionId}`);
                const response = await fetch(`https://modulo-fianciero.vercel.app/dineros/${transactionId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error ${response.status}: ${errorData.message || 'Error al eliminar'}`);
                }

                await registrarLog(`Transacción eliminada: ${transaction ? transaction.id : transactionId}`);
                alert('Transacción eliminada correctamente');
                fetchTransactions();
            } catch (error) {
                await registrarLog(`Error al eliminar transacción ID: ${transaction ? transaction.id : transactionId} - ${error.message}`);
                console.error('Error al eliminar la transacción:', error);
                alert(`Error: ${error.message}`);
            }
        }
    }

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

    // Cargar transacciones al inicio
    fetchTransactions();
});