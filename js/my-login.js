document.querySelector("#btnSend").addEventListener('click', () => {
	const email = document.querySelector('#email').value; 
	const password = document.querySelector('#password').value; 
  
	const data = { email: email, password: password };
  
	const URL = "http://localhost:4081/api/user/login";

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
				}

				alert(`Token: ${responseData.data.token}\nUser ID: ${responseData.data.userId}`);
				window.location.href = 'reserva.html'; // Redirige a la página protegida
			}
		} else {
			loader.style.display = 'none';
			errorMessage.style.display = 'flex';
		//	alert("Error en el inicio de sesión. Intenta nuevamente."); // Manejo de errores
		}
	})
	.catch(err => {
		console.error(err);
		loader.style.display = 'none';
		errorMessage.style.display = 'flex';
		alert("Ocurrió un error. Intenta nuevamente.");
	});
  

});

function closeErrorMessage() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.classList.add('hide'); // Agrega la clase para iniciar la animación

    // Después de un tiempo (300ms), oculta el elemento completamente
    setTimeout(() => {
        errorMessage.style.display = 'none'; // Oculta el elemento
    }, 800); // Este tiempo debe coincidir con la duración de la transición en CSS
	setTimeout(() => {
        errorMessage.classList.remove('hide'); // Elimina la clase de ocultar para mostrar el mensaje
    }, 800); // Retraso de 800 milisegundos
}

document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.querySelector('.info__close');
    closeButton.addEventListener('click', closeErrorMessage);
});
