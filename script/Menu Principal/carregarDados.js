const API_URL = "http://localhost:3001/produtos_loja/";
const token = sessionStorage.getItem('token');



async function listar(nomes = [], categoria = null) {
    const dadosUsuario = {
        nomes: nomes,
        categoria: categoria,
    };

    try {
        let response = undefined;
        if(token){
            response = await fetch(API_URL + "listar/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer "+token
                },
                body: JSON.stringify(dadosUsuario),
            });
        }
        else{
            response = await fetch(API_URL + "listar/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosUsuario),
            });
            
        }
        
        const respostaJson = await response.json();

        const mensagem = respostaJson.message;

        if (response.status !== 200) {
            return [null, mensagem];
        }
        console.log(respostaJson)
        return [respostaJson, mensagem];
    } catch (error) {
        console.error("Erro na requisição:", error);
        return [null, "Erro na requisição"];
    }
}

const gerenciarBotoes = function(){
    if(token){
        //const itens = document.querySelectorAll('.decoration-text');
        //for (let i = 0; i < itens.length; i++) {
          //  itens[i].remove();
          //}
        const elemento = document.getElementById('elite-button');
        elemento.remove();
        const elemento2 = document.getElementById('elite-button2');
        elemento2.remove();
    }
    else{
        const itens = document.querySelectorAll('.decoration-text-token');
        for (let i = 0; i < itens.length; i++) {
            itens[i].remove();
        }
        const elemento = document.getElementById('encerrarSessao');
        elemento.remove();
    }
}

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
        if(token){
            link.setAttribute('href', `/view/productViewClient.html?id_produto_loja=${produto_loja.id_produto_loja}`);
        }
        else{
            link.setAttribute('href', `/view/productNotRegister.html?id_produto_loja=${produto_loja.produto.id_produto}`);
        }

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


        if(token){
            distancia.innerText = 'Distancia: '+produto_loja.distancia + 'KM';
        }
        h2_caixa_produto.innerText = produto_loja.produto.nome_produto.substring(0, 30)+"...";

    }

}

window.addEventListener('load', async function() {
    const params = new URLSearchParams(window.location.search);
    const termo = params.get("pesquisa");
    let palavras = [];
    if(termo){
        const resposta = await fetch('http://localhost:5000/limpar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto: termo })
        });

        const dados = await resposta.json();
        palavras = dados.palavras;
    }

    
    let dados = await listar(palavras);
    gerenciarBotoes()
    getCarregar(dados[0].produtos_loja)
    const form = document.getElementById('encerrarSessao');
    if(form){
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Evita o envio padrão do formulário
            sessionStorage.clear();
            form.submit();
        });
    }
    
  // Aqui você pode fazer algo com os dados recebidos, se necessário
});
