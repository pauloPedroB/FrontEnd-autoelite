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
            console.log(produto)
        }
        
    }
    else{
        alert("Seu usuário não possuí acesso a essa tela")
        window.location.href = "/view/home.html";
    }


});

const getCarregar = function(produtos){
    
    
    let div_produtos = document.getElementById("imgs-top")

    for (const produto_loja of produtos){
        let div_caixa_produto = document.createElement('div')
        let h2_caixa_produto = document.createElement('h3')
        let img = document.createElement('img')
        let link = document.createElement('a')
        let distancia = document.createElement('p')
        let div_estrelas = document.createElement('div')

        

        div_caixa_produto.setAttribute('class', 'opcao')
        div_estrelas.setAttribute('class', 'estrelas')
        div_estrelas.setAttribute('src', produto_loja.produto.img)

        img.setAttribute('src', produto_loja.produto.img)
        img.setAttribute('alt', produto_loja.produto.nome_produto)
        img.setAttribute('title', produto_loja.produto.nome_produto)
        link.setAttribute('href', `/view/productNotRegister.html?id_produto_loja=${produto_loja.produto.id_produto}`);

        div_estrelas.innerHTML = `
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star-half-stroke"></i>
            <i class="fa-regular fa-star"></i>
        `;

        div_produtos.appendChild(div_caixa_produto)
        div_caixa_produto.appendChild(link)
        link.appendChild(h2_caixa_produto)
        link.appendChild(img)
        link.appendChild(distancia)
        link.appendChild(div_estrelas)



        distancia.innerText = 'Distancia: '+produto_loja.distancia + 'KM';
        h2_caixa_produto.innerText = produto_loja.produto.nome_produto.substring(0, 30)+"...";

    }

}


