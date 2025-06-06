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
        loader.style.display = 'none';
        if (responseData.message) {
            if (responseData.data && responseData.data.token) {
                localStorage.setItem('authToken', responseData.data.token); // Almacena el token
                if (responseData.data.userId) {
                    localStorage.setItem('userId', responseData.data.userId);
                    localStorage.setItem('email', responseData.data.email);
                    localStorage.setItem('name', responseData.data.name);
                    mostrarUserId();
                }

                // Enviar log de acción
                const logData = {
                    correo: email,
                    accion: "login"
                };

                fetch('https://logs-d4hu.onrender.com/logs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(logData)
                })
                .then(logResp => {
                    if (!logResp.ok) {
                        console.warn('No se pudo enviar el log');
                    }
                    // No bloqueamos la navegación por error en log
                })
                .catch(err => {
                    console.warn('Error enviando log:', err);
                });

                // Redirección según email
                if (email === 'attimeforlunch@gmail.com') {
                    window.location.href = 'reserva.html';
                    return;
                } else {
                    window.location.href = 'reservaCliente.html';
                } 

            } else {
                errorMessage.style.display = 'flex';
            }
        } else {
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
    mostrarUserId();
});
