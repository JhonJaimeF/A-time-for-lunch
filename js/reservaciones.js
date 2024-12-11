document.addEventListener('DOMContentLoaded', function () {
  const btnSend = document.querySelector("#btnSend");

  btnSend.addEventListener('click', function (e) {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario (recarga de página)

    // Captura de datos del formulario
    const idCliente = localStorage.getItem('userId');
    const nameCliente = document.querySelector('#nameCliente').value.trim();
    const mesa = document.querySelector('#mesa').value.trim();
    const fechaReservacion = document.querySelector('#fechaReservacion').value;
    const numeroPersonas = parseInt(document.querySelector('#numeroPersonas').value, 10);

    // Crear el objeto con la estructura esperada
    const data = {
      id: Date.now().toString(), // Generar un ID único para la reserva (puedes ajustarlo según sea necesario)
      nameCliente: nameCliente,
      idCliente: idCliente,
      mesa: mesa,
      fechaReservacion: new Date(fechaReservacion).toISOString(), // Convertir fecha al formato ISO
      numeroPersonas: numeroPersonas,
    };



    // Realizar el POST con fetch
    fetch('https://modulo-reservaciones.vercel.app/reservaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Indicamos que estamos enviando datos en formato JSON
      },
      body: JSON.stringify(data), // Convertir el objeto en formato JSON
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        return response.json();
      })
      .then(responseData => {
        

        // Recargar la página
        window.location.reload();

        // Desplazar automáticamente al final
        
      })
      .catch(error => {
        console.error('Error al enviar la solicitud:', error);
        alert('Ocurrió un error al enviar los datos.');
      });
  });



const mesa = document.querySelector('#mesa').value.trim();
const fechaReservacion = document.querySelector('#fechaReservacion').value;
const numeroPersonas = parseInt(document.querySelector('#numeroPersonas').value, 10);
const email = localStorage.getItem('email');

// Verifica que todos los campos estén llenos
if (!mesa || !fechaReservacion || isNaN(numeroPersonas) || !email) {
  alert("Por favor, completa todos los campos antes de continuar.");
  return;
}

// Crea el objeto de datos para la petición
const data = {
  to: email, // Correo al que se enviará la notificación
  subject: "Confirmación de Reserva",
  html: `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #4CAF50;
                color: #fff;
                padding: 10px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .footer {
                font-size: 12px;
                color: #888;
                text-align: center;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Confirmación de Reserva</h1>
            </div>
            <p>Hola,</p>
            <p>Tu reserva ha sido confirmada con éxito. Aquí están los detalles:</p>
            <ul>
                <li><strong>Mesa:</strong> ${mesa}</li>
                <li><strong>Fecha:</strong> ${fechaReservacion}</li>
                <li><strong>Número de personas:</strong> ${numeroPersonas}</li>
            </ul>
            <p>Por favor, asegúrate de llegar a tiempo para disfrutar de tu reserva.</p>
            <p>Si tienes alguna pregunta o necesitas modificar la reserva, no dudes en contactarnos.</p>
            <div class="footer">
                <p>Gracias,</p>
                <p>El equipo de Time For Lunch</p>
            </div>
        </div>
    </body>
    </html>`
};

// Realiza la petición al backend
fetch('https://notificaciones-hc6i.onrender.com/send-email', {
  method: 'POST', // Tipo de petición
  headers: {
    'Content-Type': 'application/json', // Especifica el tipo de contenido
  },
  body: JSON.stringify(data) // Convierte el objeto a una cadena JSON
})
  .then(response => {
    if (!response.ok) {
      throw new Error("Error al enviar la solicitud al servidor.");
    }
    return response.json(); // Parsea la respuesta del servidor
  })
  .then(result => {
    console.log("Correo enviado con éxito:", result);
    alert("Correo de confirmación enviado con éxito.");
  })
  .catch(error => {
    console.error("Error al enviar el correo:", error);
    alert("Hubo un problema al enviar el correo. Por favor, intenta de nuevo.");
  });










});
