document.querySelector("#btnSend").addEventListener('click', () => {
    const email = document.querySelector('#email').value; 
    const password = document.querySelector('#password').value; 

    const data = { email: email, password: password };

    const URL = "https://api-users-cors.onrender.com/api/user/login";

    errorMessage.style.display = 'none';
    loader.style.display = 'flex';

    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(responseData => {
        if (responseData.message) {
            loader.style.display = 'none';

            alert(responseData.message); // Muestra el mensaje de bienvenida
            if (responseData.data && responseData.data.token) {
                localStorage.setItem('authToken', responseData.data.token); // Almacena el token
                if (responseData.data.userId) {
                    localStorage.setItem('userId', responseData.data.userId);
                    mostrarUserId(); // Llama al método para mostrar el ID en la consola
                }
                
                if (email === 'attimeforlunch@gmail.com') {
                    window.location.href = 'reserva.html';
                    return; // Detenemos la ejecución del resto del código
                } else {
                    window.location.href = 'reservaCliente.html'; // Redirige a la página protegida
                } 
            }
        } else {
            loader.style.display = 'none';
            errorMessage.style.display = 'flex';
        }
    })
    .catch(err => {
        console.error(err);
        loader.style.display = 'none';
        errorMessage.style.display = 'flex';
        alert("Ocurrió un error. Intenta nuevamente.");
    });
});

function mostrarUserId() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        console.log(`El ID de usuario almacenado es: ${userId}`);
    } else {
        console.log('No se encontró ningún ID de usuario en localStorage.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    mostrarUserId(); // Llama al método al cargar la página
});
