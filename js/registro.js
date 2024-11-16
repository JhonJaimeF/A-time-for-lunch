document.querySelector("#btnSendR").addEventListener('click', (event) => {
    event.preventDefault(); // Previene el envío del formulario

	document.getElementById('errorMessageName').style.display = 'none';
    document.getElementById('errorMessageEmail').style.display = 'none';
	document.getElementById('errorMessageEmailR').style.display = 'none';
    document.getElementById('errorMessagePassword').style.display = 'none';

    const nameR = document.querySelector('#nameR').value; 
    const emailR = document.querySelector('#emailR').value; 
    const passwordR = document.querySelector('#passwordR').value; 

	let isValid = true;

if (!validateName(nameR)) {
    errorMessageName.style.display = 'flex';
    isValid = false; // Cambia a false si hay un error en el nombre
}

if (!validateEmail(emailR)) {
    errorMessageEmail.style.display = 'flex';
    isValid = false; // Cambia a false si hay un error en el email
}

if (!validatePassword(passwordR)) {
    errorMessagePassword.style.display = 'flex';    
    isValid = false; // Cambia a false si hay un error en la contraseña
}


if (isValid) {

    const data = { 
        name: nameR, 
        email: emailR, 
        password: passwordR 
    }; 

loader.style.display = 'flex';

    const URL = "http://localhost:4081/api/user/register";

    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data) 
    })
    .then(resp => resp.json())
    .then(responseData => {
		if (responseData.error === null) {
        	loader.style.display = 'none';
        const header = document.querySelector('.header');
        header.style.display = 'block'; 
		setTimeout(function() {
    window.location.href = 'index.html';
}, 2000);

        } else {
			loader.style.display = 'none';
			errorMessageEmailR.style.display = 'flex';
           // alert("Error en el registro: " + (responseData.error || "Error desconocido")); // Manejo de error más seguro
        }
    })
    .catch(err => {
        console.error(err);
        alert("Ocurrió un error. Intenta nuevamente.");
    });
    }; 
});


function closeErrorMessage(elementId) {
    const errorMessage = document.getElementById(elementId);
    if (!errorMessage) return; 
    errorMessage.classList.add('hide');
    setTimeout(() => {
        errorMessage.style.display = 'none'; 
    }, 800);
    setTimeout(() => {
        errorMessage.classList.remove('hide'); 
    }, 800);
}

document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.querySelector('.info__closeName');
    closeButton.addEventListener('click', () => closeErrorMessage('errorMessageName'));
});
document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.querySelector('.info__closeEmail');
    closeButton.addEventListener('click', () => closeErrorMessage('errorMessageEmail'));
});
document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.querySelector('.info__closeEmailR');
    closeButton.addEventListener('click', () => closeErrorMessage('errorMessageEmailR'));
});

document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.querySelector('.info__closePassword');
    closeButton.addEventListener('click', () => closeErrorMessage('errorMessagePassword'));
});


function validateName(name) {
    const nameRegex = /^[a-zA-Z\s]+$/; 
    return name.length >= 6 && nameRegex.test(name);
}

function validarNombre(name) {
    const regex = /^[a-zA-Z]{6}$/;
    return regex.test(name);
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email.trim() !== '' && emailRegex.test(email);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    return password.trim() !== '' && passwordRegex.test(password);
}