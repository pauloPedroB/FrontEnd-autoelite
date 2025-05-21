const API_URL = "http://localhost:3001/usuarios/";
const token = sessionStorage.getItem('token');


document.addEventListener('DOMContentLoaded', function () {
    if (token){
        window.location.href = "/view/home.html";
    }
    const form = document.querySelector('form');
    const passwordInput = document.getElementById("password");
    const toggle = document.getElementById("togglePassword1");

    const confirm_passwordInput = document.getElementById("confirm-password");
    const toggle2 = document.getElementById("togglePassword2");

    toggle.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        toggle.textContent = isPassword ? "🙈" : "👁️"; // troca o ícone também
    });

    toggle2.addEventListener("click", () => {
        const isPassword = confirm_passwordInput.type === "password";
        confirm_passwordInput.type = isPassword ? "text" : "password";
        toggle2.textContent = isPassword ? "🙈" : "👁️"; // troca o ícone também
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita o envio padrão do formulário
        try{
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirm_password = document.getElementById('confirm-password').value;

    
            if (!isValidEmail(email)) {
                event.preventDefault(); // Bloqueia o envio do formulário
                alert('Email inválido');
                return;
            }
            if(password != confirm_password){
                event.preventDefault(); // Bloqueia o envio do formulário
                alert('Senha e confirmação de senha devem ser iguais');
                return;
            }
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            if(regex.test(password) == false){
                event.preventDefault(); // Bloqueia o envio do formulário
                alert('Senha deve ter 8 caracteres, sendo pelo menos uma letra maiúscula, uma minuscula, um número e um caracter especial');
                return;
            }
            const [userData, message] = await cadastro(email, password, confirm_password);
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

async function cadastro(email, senha, confirmacao_senha) {
    const dadosUsuario = {
        email_usuario: email,
        pass_usuario: senha,
        confirm_pass: confirmacao_senha,
    };

    try {
        const response = await fetch(API_URL + "criar/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosUsuario),
        });
        const respostaJson = await response.json();

        const mensagem = respostaJson.message;
        if (response.status !== 201) {
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
