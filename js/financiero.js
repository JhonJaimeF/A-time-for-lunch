document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const openModalButton = document.getElementById('openModalButton');
    const closeModal = document.getElementById('close-crear');
    const tableBody = document.querySelector('#transactionTable tbody');
    const form = document.getElementById('transactionForm');
  
    let transactionsData = [];
  
    // Mostrar el modal para crear una nueva transacción
    openModalButton.addEventListener('click', () => {
      form.reset();
      form.removeAttribute('data-edit-id');
      modal.style.display = 'flex';
    });
  
    // Cerrar el modal
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  
    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  
    // Obtener datos para la tabla
    async function fetchTransactions() {
      try {
        const response = await fetch('https://modulo-fianciero.vercel.app/dineros');
        if (!response.ok) throw new Error('Error al obtener datos');
        const data = await response.json();
        transactionsData = data.data; // Guardar datos
        renderTable(transactionsData);
      } catch (error) {
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
  
          alert('Transacción actualizada correctamente');
          modal.style.display = 'none';
          fetchTransactions();
          form.reset();
          form.removeAttribute('data-edit-id');
        } catch (error) {
          console.error('Error al actualizar la transacción:', error);
          alert(`Error: ${error.message}`);
        }
      } else {
        // Crear nueva transacción
        try {
          const response = await fetch('https://modulo-fianciero.vercel.app/dineros', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message || 'Error al guardar'}`);
          }
  
          alert('Transacción guardada correctamente');
          modal.style.display = 'none';
          fetchTransactions();
          form.reset();
        } catch (error) {
          console.error('Error al guardar la transacción:', error);
          alert(`Error: ${error.message}`);
        }
      }
    }
  
    // Editar transacción (PUT)
    function handleEdit(event) {
      const transactionId = event.target.getAttribute('data-id');
      const transaction = transactionsData.find(t => t._id === transactionId);
  
      if (transaction) {
        // Llenar el formulario con los datos de la transacción
        form.elements['id'].value = transaction.id;
        form.elements['description'].value = transaction.description;
        form.elements['value'].value = transaction.value;
        // Establecer el ID de edición en el formulario
        form.setAttribute('data-edit-id', transactionId);
        modal.style.display = 'flex';
      } else {
        console.error('Transacción no encontrada');
        alert('Transacción no encontrada');
      }
    }
  
    // Eliminar transacción (DELETE)
    async function handleDelete(event) {
      const transactionId = event.target.getAttribute('data-id');
  
      if (confirm('¿Estás seguro de eliminar esta transacción?')) {
        try {
          const response = await fetch(`https://modulo-fianciero.vercel.app/dineros/${transactionId}`, {
            method: 'DELETE'
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message || 'Error al eliminar'}`);
          }
  
          alert('Transacción eliminada correctamente');
          fetchTransactions();
        } catch (error) {
          console.error('Error al eliminar la transacción:', error);
          alert(`Error: ${error.message}`);
        }
      }
    }
  
    // Asociar evento de envío al formulario
    form.addEventListener('submit', saveTransaction);
  
    // Cargar transacciones al inicio
    fetchTransactions();
  });
  