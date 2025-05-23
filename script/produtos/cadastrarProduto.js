import { buscarUsuario } from '../middleware/auth.js';

const API_URL = "http://localhost:3001/produtos_loja/";

document.getElementById("ImageURL").addEventListener("input", function () {
    let preview = document.getElementById("preview");
    let previewContainer = document.getElementById("preview-container");
    let url = this.value.trim();

    preview.src = url;
    preview.onload = () => {
        previewContainer.style.display = "block";
    };
    preview.onerror = () => {
        previewContainer.style.display = "none";
    };
});



window.addEventListener('load', async function() {
    const formulario = document.getElementById('form');
    const token = sessionStorage.getItem('token');

    const usuario = await buscarUsuario()
    
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
        else{
            formulario.addEventListener("submit", async function(e) {
                e.preventDefault();
            
                const nome_campo = document.getElementById('Nome').value;
                const categoria_campo = document.getElementById('Categoria').value;
                const img_campo = document.getElementById('ImageURL').value;
            
                const response = await fetch('http://localhost:3001/produtos/criar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "authorization": "Bearer " + token,
                    },
                    body: JSON.stringify({  
                        nome_produto: nome_campo,
                        img: img_campo,
                        categoria: categoria_campo
                    })
                });
                const respostaJson = await response.json();
  
                const mensagem = respostaJson.message;
            
                if (response.status == 201) {
                    alert("Produto Cadastrado com Sucesso");
                    window.location.reload();
                } else {
                    alert("Erro ao cadastrar produto." + mensagem);
                }
            });
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


