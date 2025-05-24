import { buscarUsuario } from '../middleware/auth.js';
import { buscarDados } from '../middleware/dados.js';
import { buscarEndereco } from '../middleware/endereco.js';


const API_URL = "http://localhost:3001/enderecos/";
const token = sessionStorage.getItem('token');
const token_dados = sessionStorage.getItem('token_dados');

window.addEventListener('load', async function() {
    if(token){
        const usuario = await buscarUsuario()
        if(usuario.typeUser == null){
            window.location.href = "/view/storeOrClient.html";
        }
        const endereco = await buscarEndereco()
        if(endereco != null || usuario.typeUser == 1){
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
        var cep = document.getElementById('CEP').value;
        var rua = document.getElementById('Rua').value;
        var bairro = document.getElementById('Bairro').value;
        var cidade = document.getElementById('Cidade').value;
        var uf = document.getElementById('UF').value;
        var nmr = document.getElementById('Numero').value;
        var complemento = document.getElementById('Complemento').value;


        
        const [userData, message] = await cadastro(cep, rua, bairro, cidade, uf, nmr, complemento);
        console.log(userData)
        if(userData == false){
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

async function cadastro(cep, rua, bairro, cidade, uf, nmr, complemento = null) {
    const dadosUsuario = {
        rua: rua,
        bairro: bairro,
        cidade: cidade,
        cep: cep,
        complemento: complemento,
        uf: uf,
        nmr: nmr,
    };

    try {
        const response = await fetch(API_URL + "criar/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer "+token,
                "token_dados": token_dados
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
        console.error("Erro na requisição:" + error);
        return [null, "Erro na requisição"];
    }
}

