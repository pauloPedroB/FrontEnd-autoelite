import { buscarUsuario } from '../middleware/auth.js';

const API_URL = "http://localhost:3001/lojas/";
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
        const cnpj = document.getElementById('cnpj').value;
        const Nome = document.getElementById('Nome').value;
        const razao = document.getElementById('razao').value;
        const Telefone = document.getElementById('Telefone').value;
        const Celular = document.getElementById('Celular').value;
        const Abertura = document.getElementById('Abertura').value;

        if (!isValidCnpj(cnpj)) {
            event.preventDefault(); // Bloqueia o envio do formulário
            alert('CNPJ inválido');
            return;
        }
        
        const [userData, message] = await cadastro(cnpj, Nome, razao, Telefone, Celular, Abertura);
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
        alert("Algo deu errado, tente novamente" + error)
    }
    
});

async function cadastro(cnpj, nomeFantasia, razaoSocial, telefone, celular, abertura) {
    const dadosUsuario = {
        cnpj: cnpj,
        nomeFantasia: nomeFantasia,
        razaoSocial: razaoSocial,
        telefone: telefone,
        celular: celular,
        abertura: abertura,
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


function isValidCnpj(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

  if (cnpj.length !== 14) return false;

  // Elimina CNPJs com todos os dígitos iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  // Primeiro dígito verificador
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  // Segundo dígito verificador
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
}
