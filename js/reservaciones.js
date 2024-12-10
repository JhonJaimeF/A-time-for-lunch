// IIFE para obtener las reservaciones
(() => {
    fetch('http://localhost:3030/reservaciones')
      .then(data => data.json())
      .then(data => console.log(data))   
      .catch(err => console.log(err));
  })();
  
  // Evento click para enviar una nueva reservación
  document.querySelector("#btnSend").addEventListener('click', () => {
    const id = document.querySelector('#id').value;
    const nameCliente = document.querySelector('#nameCliente').value;
    const idCliente = document.querySelector('#idCliente').value;
    const mesa = document.querySelector('#mesa').value;
    const fechaReservacion = document.querySelector('#fechaReservacion').value;
    const numeroPersonas = document.querySelector('#numeroPersonas').value;
    const estadoReservacion = document.querySelector('#estadoReservacion').value;
  
    // Creando el objeto con los datos de la reservación
    const data = {
      id: id,
      nameCliente: nameCliente,
      idCliente: idCliente,
      mesa: mesa,
      fechaReservacion: fechaReservacion,
      numeroPersonas: numeroPersonas,
      estadoReservacion: estadoReservacion
    };
  
    const URL = "http://localhost:3030/reservaciones";
  
    // Enviando la reservación con POST
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
  });
  