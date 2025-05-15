import { buscarUsuario } from '../middleware/auth.js';

const API_URL = "http://localhost:3001/produtos_loja/";

document.getElementById("SelectIMG").addEventListener("change", function (event) {
            let preview = document.getElementById("preview");
            let previewContainer = document.getElementById("preview-container");
            let file = event.target.files[0];

            if (file) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    preview.src = e.target.result;
                    previewContainer.style.display = "block"; // Mostrar a prévia
                };
                reader.readAsDataURL(file);
            }
        });

window.addEventListener('load', async function() {
    const formulario = document.getElementById('form');
    const token = sessionStorage.getItem('token');

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
        else{
            formulario.addEventListener("submit", async function(e) {
                e.preventDefault();
                const nome_campo = document.getElementById('Nome');
                const categoria_campo = document.getElementById('Categoria');
                const img_campo = document.getElementById('SelectIMG');
                
                const response = await fetch('http://localhost:3001/produtos/buscar', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "authorization": "Bearer "+token,
                        },
                        body: JSON.stringify({  nome_produto: nome_campo,
                                                img: img_campo,
                                                categoria: categoria_campo
                                            })
                });
                window.location.reload();

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


