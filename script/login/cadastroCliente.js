import { buscarUsuario } from '../middleware/auth.js';

const API_URL = "http://localhost:3001/clientes/";
const token = sessionStorage.getItem('token');



window.addEventListener('load', async function() {
    console.log(token)
    if(token){
        const usuario = await buscarUsuario()
        if(usuario.typeUser != null){
            window.location.href = "/view/home.html";
        }
    }
    else{
        window.location.href = "/view/home.html";
    }

    

});
const form = document.querySelector('form');

form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita o envio padrão do formulário
    try{
        const cpf = document.getElementById('CPF').value;
        const Nome = document.getElementById('Nome').value;
        const genero = document.getElementById('Genero').value;
        const Telefone = document.getElementById('Telefone').value;
        const dtNascimento = document.getElementById('DataNasc').value;

        if (!validarCPF(cpf)) {
            event.preventDefault(); // Bloqueia o envio do formulário
            alert('cpf inválido');
            return;
        }
        
        const [userData, message] = await cadastro(cpf, Nome, genero, Telefone, dtNascimento);
        if(userData == false){
            event.preventDefault();
            alert(message);
        }
        else{
            form.submit();
        }
    }
    catch (error){
        event.preventDefault();
        console.log(error)
        alert("Algo deu errado, tente novamente" + error)
    }
    
});

async function cadastro(cpf, Nome, genero, Telefone, dtNascimento) {
    const dadosUsuario = {
        cpf: cpf,
        nome: Nome,
        dtNascimento: dtNascimento,
        telefone: Telefone,
        genero: 1,
        carro: 1,
    };

    try {
        const response = await fetch(API_URL + "criar/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer "+token,

            },
            body: JSON.stringify(dadosUsuario),
        });
        const respostaJson = await response.json();

        const mensagem = respostaJson.message;
        if (response.status !== 201) {
            return [false, mensagem];
        }
        sessionStorage.setItem('token_dados', respostaJson.token_dados);
        sessionStorage.removeItem('token');
        const usuario = await buscarUsuario()

        return [respostaJson, mensagem];

    } catch (error) {
        console.error("Erro na requisição:", error);
        return [null, "Erro na requisição"];
    }
}

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, ''); // Remove tudo que não for número
    
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false; // CPF com todos os dígitos iguais é inválido
        }
    
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
    
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;
    
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
    
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
    
        return resto === parseInt(cpf.charAt(10));
    }


