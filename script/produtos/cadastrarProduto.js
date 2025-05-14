import { buscarUsuario } from '../middleware/auth.js';

const API_URL = "http://localhost:3001/produtos_loja/";
const token = sessionStorage.getItem('token');


window.addEventListener('load', async function() {
    const usuario = buscarUsuario()
    
    const params = new URLSearchParams(window.location.search);
    const produtoUrl = params.get("produto");

    if(usuario.typeUser == 1){
        if(produtoUrl){
            console.log(produtoUrl)
            const resposta = await fetch('http://localhost:3001/produtos/buscar', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "authorization": "Bearer "+token,
                        },
                        body: JSON.stringify({ id_produto: produtoUrl })
                    });

            const produto = await resposta.json();
            getCarregar(produto)
        }
        
    }
    else{
        alert("Seu usuário não possuí acesso a essa tela")
        window.location.href = "/view/home.html";
    }


});

const getCarregar = function(produto){
    let nome = document.getElementById("Nome")
    nome.value = produto.produto.nome_produto
    let categoria = document.getElementById("Categoria")
    categoria.value = produto.produto.categoria


}


