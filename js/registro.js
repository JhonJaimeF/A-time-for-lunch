document.querySelector("#btnSendR").addEventListener('click', (event) => {
    event.preventDefault();

    // Ocultar mensajes de error previos
    document.getElementById('errorMessageName').style.display = 'none';
    document.getElementById('errorMessageEmail').style.display = 'none';
    document.getElementById('errorMessageEmailR').style.display = 'none';
    document.getElementById('errorMessagePassword').style.display = 'none';

    // Obtener valores del formulario
    const nameR = document.querySelector('#nameR').value;
    const emailR = document.querySelector('#emailR').value;
    const passwordR = document.querySelector('#passwordR').value;
    const loader = document.getElementById('loader');

    let isValid = true;

    if (!validateName(nameR)) {
        document.getElementById('errorMessageName').style.display = 'flex';
        isValid = false;
    }

    if (!validateEmail(emailR)) {
        document.getElementById('errorMessageEmail').style.display = 'flex';
        isValid = false;
    }

    if (!validatePassword(passwordR)) {
        document.getElementById('errorMessagePassword').style.display = 'flex';
        isValid = false;
    }

    if (isValid) {
        const data = {
            name: nameR,
            email: emailR,
            password: passwordR
        };

        loader.style.display = 'flex';

        const URL = "https://api-users-cors.onrender.com/api/user/register";

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
            console.log("Registro response:", responseData); // 🔍 LOG DE RESPUESTA

            if (responseData.error === null) {
                const header = document.querySelector('.header');
                header.style.display = 'block';

                

                setTimeout(() => {
                    // ✅ Enviar log de acción
                enviarLog(emailR, "registro");
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                document.getElementById('errorMessageEmailR').style.display = 'flex';
            }
        })
        .catch(err => {
            loader.style.display = 'none';
            console.error("Error en registro:", err);
            alert("Ocurrió un error. Intenta nuevamente.");
        });
    }
});

function enviarLog(correo, accion) {
    const logData = {
        correo: correo,
        accion: accion
    };

    fetch('https://logs-d4hu.onrender.com/logs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
    })
    .then(resp => {
        console.log("Estado del log:", resp.status);
        return resp.text();
    })
    .then(data => {
        console.log("Respuesta del log:", data);
    })
    .catch(err => {
        console.warn(`Error enviando log de acción (${accion}):`, err);
    });
}

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
    document.querySelector('.info__closeName')?.addEventListener('click', () => closeErrorMessage('errorMessageName'));
    document.querySelector('.info__closeEmail')?.addEventListener('click', () => closeErrorMessage('errorMessageEmail'));
    document.querySelector('.info__closeEmailR')?.addEventListener('click', () => closeErrorMessage('errorMessageEmailR'));
    document.querySelector('.info__closePassword')?.addEventListener('click', () => closeErrorMessage('errorMessagePassword'));
});

function validateName(name) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return name.length >= 6 && nameRegex.test(name);
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email.trim() !== '' && emailRegex.test(email);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    return password.trim() !== '' && passwordRegex.test(password);
}

document.addEventListener("DOMContentLoaded", () => {
    const dataConsentCheckbox = document.getElementById("dataConsent");
    const registerButton = document.getElementById("btnSendR");

    dataConsentCheckbox.addEventListener("change", () => {
        registerButton.disabled = !dataConsentCheckbox.checked;
    });
});

function openPrivacyPolicy(event) {
    event.preventDefault();

    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
        "privacy-policy.html",
        "PrivacyPolicy",
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
}
