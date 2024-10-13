document.querySelector("#btnSend").addEventListener('click', () => {
	const email = document.querySelector('#email').value; 
	const password = document.querySelector('#password').value; 
  
	const data = { email: email, password: password };
  
	const URL = "https://api-users-rho.vercel.app/api/user/login";
  
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
			alert(responseData.message); // Muestra el mensaje de bienvenida
			if (responseData.data && responseData.data.token) {
				localStorage.setItem('authToken', responseData.data.token); // Almacena el token
				window.location.href = 'reserva.html'; // Redirige a la página protegida
			}
		} else {
			alert("Error en el inicio de sesión. Intenta nuevamente."); // Manejo de errores
		}
	})
	.catch(err => {
		console.error(err);
		alert("Ocurrió un error. Intenta nuevamente.");
	});
  });




