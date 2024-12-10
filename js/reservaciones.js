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
});
