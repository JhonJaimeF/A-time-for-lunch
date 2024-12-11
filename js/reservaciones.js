document.addEventListener('DOMContentLoaded', function () {
  const btnSend = document.querySelector("#btnSend");

  btnSend.addEventListener('click', function (e) {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario

    // Captura de datos del formulario
    const idCliente = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const nameCliente = document.querySelector('#nameCliente').value.trim();
    const mesa = document.querySelector('#mesa').value.trim();
    const fechaReservacion = document.querySelector('#fechaReservacion').value;
    const numeroPersonas = parseInt(document.querySelector('#numeroPersonas').value, 10);

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
