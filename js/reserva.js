fetch('https://modulo-reservaciones.vercel.app/reservaciones')
    .then(response => response.json())
    .then(reservas => {
        const datos = reservas.data;

        const contenedorTabla = document.getElementById('contenidoTablaReservaciones');
        contenedorTabla.innerHTML = '';

        console.log(datos);

        datos.forEach(reservacion => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${reservacion.nameCliente}</td>
                <td>${reservacion.mesa}</td>
                <td>${new Date(reservacion.fechaReservacion).toLocaleString()}</td>
                <td>${reservacion.numeroPersonas}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarReservacion('${reservacion.id}')"> <i class="fas fa-edit"></i> </button> <button class="btn btn-danger btn-sm" onclick="eliminarReservacion('${reservacion.id}')"> <i class="fas fa-trash-alt"></i> </button>
                </td>
            `;
            contenedorTabla.appendChild(fila);
        });
    })
    .catch(error => {
        console.error('Error al cargar los datos:', error);
        alert('No se pudo cargar la información');
    });

    // Mostrar modal Crear Proveedor
document.getElementById('crear').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'flex';
  });
  
  // Cerrar modal Crear Proveedor
  document.getElementById('close-crear').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
  });
  

  document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 1); // Fecha límite de un mes a partir de hoy

    flatpickr("#fechaReservacion", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: today,
        maxDate: maxDate,
        time_24hr: true, // Usar formato 24 horas
        minTime: "10:00",
        maxTime: "22:00",
        altInput: true,
        altFormat: "F j, Y (H:i)"
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el calendario con Flatpickr
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 1);

    flatpickr("#fechaReservacion", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: today,
        maxDate: maxDate,
        time_24hr: true,
        minTime: "10:00",
        maxTime: "22:00",
        altInput: true,
        altFormat: "F j, Y (H:i)",
        position: "above"
});

    // Validar los campos de número de mesa y número de personas
    document.getElementById('btnSend').addEventListener('click', function(event) {
        const mesa = document.getElementById('mesa').value;
        const numeroPersonas = document.getElementById('numeroPersonas').value;

        if (mesa < 1 || mesa > 12) {
            alert('Por favor ingrese un número de mesa entre 1 y 12.');
            event.preventDefault(); // Prevenir el envío del formulario
        }

        if (numeroPersonas < 1 || numeroPersonas > 12) {
            alert('Por favor ingrese un número de personas entre 1 y 12.');
            event.preventDefault(); // Prevenir el envío del formulario
        }
    });
});

