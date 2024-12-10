// IIFE para obtener todas las entradas de dinero
(() => {
    fetch('http://localhost:3030/dinero')
      .then(response => response.json())
      .then(data => console.log(data))   
      .catch(err => console.log(err));
  })();
  
  // Evento click para enviar una nueva entrada de dinero
  document.querySelector("#btnSend").addEventListener('click', () => {
    const id = document.querySelector('#id').value;
    const description = document.querySelector('#description').value;
    const value = document.querySelector('#value').value;
  
    // Creando el objeto con los datos de la entrada de dinero
    const data = {
      id: id,
      description: description,
      value: value
    };
  
    const URL = "https://modulo-fianciero.vercel.app/dineros";
  
    // Enviando la nueva entrada con POST
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
  });
  