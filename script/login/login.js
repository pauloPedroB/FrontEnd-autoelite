// Espera o carregamento total do DOM
const API_URL = "http://localhost:3001/usuarios/";
const token = sessionStorage.getItem('token');


document.addEventListener('DOMContentLoaded', function () {
    if (token){
        window.location.href = "/view/home.html";
    }
    const form = document.querySelector('form');
    const passwordInput = document.getElementById("password");
    const toggle = document.getElementById("togglePassword");

    toggle.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        toggle.textContent = isPassword ? "🙈" : "👁️"; // troca o ícone também
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita o envio padrão do formulário
        try{
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
    
            if (!isValidEmail(email)) {
                event.preventDefault(); // Bloqueia o envio do formulário
                alert('Email inválido');
                return;
            }
    
            const [userData, message] = await login(email, password);
            if(userData == false){
                event.preventDefault();
                alert(message);
            }
            else{
                sessionStorage.setItem('token', userData.token); 
                form.submit();
            }
        }
        catch (error){
            event.preventDefault();
            alert("Algo deu errado, tente novamente" + error)
        }
        
    });
});

async function login(email, senha) {
    const dadosUsuario = {
        email_usuario: email,
        pass_usuario: senha,
    };

    try {
        const response = await fetch(API_URL + "login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosUsuario),
        });
        const respostaJson = await response.json();

        const mensagem = respostaJson.message;
       
        if (response.status !== 200) {
            return [false, mensagem];
        }
        return [respostaJson, mensagem];

    } catch (error) {
        console.error("Erro na requisição:", error);
        return [null, "Erro na requisição"];
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
