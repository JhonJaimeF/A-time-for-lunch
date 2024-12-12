// Función para obtener datos de la API y mostrarlos en la tabla filtrando por el idCliente
async function obtenerReservaciones() {
    try {
        const userId = localStorage.getItem('userId'); // Obtener el ID del usuario desde localStorage
        if (!userId) {
            alert('No estás identificado. Por favor, inicia sesión.');
            window.location.href = 'index.html';
            return;
        }

        const response = await fetch('https://modulo-reservaciones.vercel.app/reservaciones');
        const resultado = await response.json();
        const datos = resultado.data;

        const contenedorTabla = document.getElementById('tablaReservaciones');
        contenedorTabla.innerHTML = ''; // Limpiar la tabla antes de llenarla

        // Filtrar los datos para mostrar solo aquellos con el idCliente que coincide con el localStorage
        const datosFiltrados = datos.filter(reservacion => reservacion.idCliente === userId);

        // Recorrer los datos filtrados y agregarlos dinámicamente a la tabla
        datosFiltrados.forEach(reservacion => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${reservacion.nameCliente}</td>
                <td>${reservacion.mesa}</td>
                <td>${new Date(reservacion.fechaReservacion).toLocaleString()}</td>
                <td>${reservacion.numeroPersonas}</td>
            `;
            contenedorTabla.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('No se pudo cargar la información');
    }
}

// Llamar a la función al cargar la página
window.onload = obtenerReservaciones;

// Mostrar modal Crear Proveedor
document.getElementById('crear').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'flex';
});

// Cerrar modal Crear Proveedor
document.getElementById('close-crear').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

// Inicializar el calendario con Flatpickr
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
        altFormat: "F j, Y (H:i)",
        position: "above"
    });

    // Validar los campos de número de mesa y número de personas
    document.getElementById('btnSend').addEventListener('click', function(event) {
        const mesa = document.getElementById('mesa').value;
        const numeroPersonas = document.getElementById('numeroPersonas').value;
        const idCliente = localStorage.getItem('userId');
        const email = localStorage.getItem('email');
        const nameCliente = document.getElementById('nameCliente').value.trim();
        const fechaReservacion = document.getElementById('fechaReservacion').value;

        if (mesa < 1 || mesa > 12) {
            alert('Por favor ingrese un número de mesa entre 1 y 12.');
            event.preventDefault(); // Prevenir el envío del formulario
        }

        if (numeroPersonas < 1 || numeroPersonas > 12) {
            alert('Por favor ingrese un número de personas entre 1 y 12.');
            event.preventDefault(); // Prevenir el envío del formulario
        }

        // Validaciones de campos
        if (!idCliente || !email || !nameCliente || !mesa || !fechaReservacion || isNaN(numeroPersonas)) {
            alert("Por favor, completa todos los campos antes de continuar.");
            return;
        }

        // Crear el objeto de reserva
        const reservaData = {
            id: Date.now().toString(),
            nameCliente,
            idCliente,
            mesa,
            fechaReservacion: new Date(fechaReservacion).toISOString(), // Convertir fecha al formato ISO
            numeroPersonas,
        };

        // Realizar la solicitud para guardar la reserva
        fetch('https://modulo-reservaciones.vercel.app/reservaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservaData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar la reserva: ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            // Crear el objeto para el correo electrónico
            const emailData = {
                to: email,
                subject: "Confirmación de Reserva",
                html: `
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
                            .container { max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
                            .header { background-color: #4CAF50; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
                            .footer { font-size: 12px; color: #888; text-align: center; margin-top: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header"><h1>Confirmación de Reserva</h1></div>
                            <p>Hola,</p>
                            <p>Tu reserva ha sido confirmada con éxito. Aquí están los detalles:</p>
                            <ul>
                                <li><strong>Mesa:</strong> ${mesa}</li>
                                <li><strong>Fecha:</strong> ${fechaReservacion}</li>
                                <li><strong>Número de personas:</strong> ${numeroPersonas}</li>
                            </ul>
                            <p>Por favor, asegúrate de llegar a tiempo para disfrutar de tu reserva.</p>
                            <p>Si tienes alguna pregunta o necesitas modificar la reserva, no dudes en contactarnos.</p>
                            <div class="footer"><p>Gracias,</p><p>El equipo de Time For Lunch</p></div>
                        </div>
                    </body>
                    </html>`,
            };

            // Enviar el correo electrónico
            return fetch('https://notificaciones-hc6i.onrender.com/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailData),
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al enviar el correo: ' + response.statusText);
            }
            alert("Reserva confirmada y correo enviado con éxito.");
            window.location.reload(); // Recargar la página después de que todo se complete
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al procesar la solicitud.');
        });
    });
});
