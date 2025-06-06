// Función reutilizable para enviar logs
function enviarLog(accion) {
    const correo = localStorage.getItem('email');
    if (!correo) return;

    fetch('https://logs-d4hu.onrender.com/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, accion }),
    }).catch(error => console.error('Error al enviar log:', error));
}

// Redirigir a la página de inicio de sesión si no hay token
if (!localStorage.getItem('authToken')) {
    window.location.href = './login.html';
}

// Prevenir navegación hacia atrás
window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
    window.location.reload();
};

// Manejo de cierre de sesión
document.getElementById('logoutButton').addEventListener('click', () => {
    enviarLog("Cierre de sesión");

    sessionStorage.clear();
    localStorage.clear();
    window.location.href = './login.html';
});

// Validación de correo al cargar la página
window.onload = function () {
    const storedEmail = localStorage.getItem("email");

    if (storedEmail !== "attimeforlunch@gmail.com") {
        window.location.href = "login.html";
    } else {
        enviarLog("Inicio de sesión");
    }
};

// Cargar reservaciones
fetch('https://modulo-reservaciones.vercel.app/reservaciones')
    .then(response => response.json())
    .then(reservas => {
        const datos = reservas.data;
        const contenedorTabla = document.getElementById('contenidoTablaReservaciones');
        contenedorTabla.innerHTML = '';

        datos.forEach(reservacion => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${reservacion.nameCliente}</td>
                <td>${reservacion.mesa}</td>
                <td>${new Date(reservacion.fechaReservacion).toLocaleString()}</td>
                <td>${reservacion.numeroPersonas}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarReservacion('${reservacion.id}')"> <i class="fas fa-edit"></i> </button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarReservacion('${reservacion.id}')"> <i class="fas fa-trash-alt"></i> </button>
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

// Inicialización y validación de reservación
document.addEventListener('DOMContentLoaded', function () {
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

    document.getElementById('btnSend').addEventListener('click', function (event) {
        const mesa = document.getElementById('mesa').value;
        const numeroPersonas = document.getElementById('numeroPersonas').value;
        const fechaReservacion = document.getElementById('fechaReservacion').value;

        if (mesa < 1 || mesa > 12) {
            alert('Por favor ingrese un número de mesa entre 1 y 12.');
            event.preventDefault();
            return;
        }

        if (numeroPersonas < 1 || numeroPersonas > 12) {
            alert('Por favor ingrese un número de personas entre 1 y 12.');
            event.preventDefault();
            return;
        }

        const idCliente = localStorage.getItem('userId');
        const email = localStorage.getItem('email');
        const nameCliente = localStorage.getItem('name');

        const reservaData = {
            id: Date.now().toString(),
            nameCliente,
            idCliente,
            mesa,
            fechaReservacion: new Date(fechaReservacion).toISOString(),
            numeroPersonas,
        };

        fetch('https://modulo-reservaciones.vercel.app/reservaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservaData),
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al guardar la reserva');
                return response.json();
            })
            .then(() => {
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

                return fetch('https://notificaciones-hc6i.onrender.com/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emailData),
                });
            })
            .then(response => {
                if (!response.ok) throw new Error('Error al enviar el correo');
                
                // Enviar log de creación de reserva
                enviarLog("Reserva creada");

                alert("Reserva confirmada y correo enviado con éxito.");
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al procesar la solicitud.');
            });
    });
});

