     // Borra todo el contenido de localStorage cuando se carga la página
        window.onload = function() {
            localStorage.clear();

            // Verifica si el valor de localStorage corresponde al correo esperado o está vacío
            const storedEmail = localStorage.getItem("email");

            if (storedEmail !== "attimeforlunch@gmail.com" || storedEmail === null || storedEmail === "") {
                // Redirige a la página de login si el correo no coincide o está vacío
                window.location.href = "login.html";
            }
        };

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const openModalButton = document.getElementById('crear');
  const closeModal = document.getElementById('close-crear');
  const tableBody = document.querySelector('#contenidoTablaReservaciones');
  const form = document.querySelector('form');

  // Mostrar el modal
  openModalButton.addEventListener('click', () => {
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
          renderTable(data);
      } catch (error) {
          console.error('Error al cargar transacciones:', error);
      }
  }
  
  // Renderizar la tabla
  function renderTable(transactions) {
      tableBody.innerHTML = '';
      transactions.data.forEach(transaction => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${transaction.id}</td>
              <td>${transaction.description}</td>
              <td>${transaction.value}</td>
          `;
          tableBody.appendChild(row);
      });
  }

  // Enviar datos al servidor (POST)
  async function saveTransaction(event) {
      event.preventDefault(); // Evitar el envío predeterminado del formulario

      const formData = new FormData(form);
      const transaction = {
          id: formData.get('id'),
          description: formData.get('description'),
          value: formData.get('value')
      };

      try {
          const response = await fetch('https://modulo-fianciero.vercel.app/dineros', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(transaction)
          });

          if (!response.ok) throw new Error('Error al guardar la transacción');
          
          // Cerrar el modal y actualizar la tabla tras un guardado exitoso
          modal.style.display = 'none';
          fetchTransactions(); // Volver a cargar las transacciones
          form.reset(); // Limpiar el formulario
      } catch (error) {
          console.error('Error al guardar la transacción:', error);
      }
  }

  // Asociar el evento de envío del formulario
  form.addEventListener('submit', saveTransaction);

  // Cargar transacciones al inicio
  fetchTransactions();
});
