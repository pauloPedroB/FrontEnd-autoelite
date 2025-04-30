const API_URL = "http://localhost:3001/produtos_loja/";

async function listar(nomes = [], categoria = null) {
    const dadosUsuario = {
        nomes: nomes,
        categoria: categoria,
    };

    try {
        const response = await fetch(API_URL + "listar/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosUsuario),
        });
        const respostaJson = await response.json();
        console.log(respostaJson)

        const mensagem = respostaJson.message;

        if (response.status !== 200) {
            return [null, mensagem];
        }
        
        return [respostaJson, mensagem];
    } catch (error) {
        console.error("Erro na requisição:", error);
        return [null, "Erro na requisição"];
    }
}

const getCarregar = function(produtos){
    
    
    let div_produtos = document.getElementById("imgs-top")

    for (const produto_loja of produtos){
        let div_caixa_produto = document.createElement('div')
        let h2_caixa_produto = document.createElement('h3')
        let img = document.createElement('img')
        let link = document.createElement('a')
        let div_estrelas = document.createElement('div')

        

        div_caixa_produto.setAttribute('class', 'opcao')
        div_estrelas.setAttribute('class', 'estrelas')
        div_estrelas.setAttribute('src', produto_loja.produto.img)

        img.setAttribute('src', produto_loja.produto.img)
        img.setAttribute('alt', produto_loja.produto.nome_produto)
        img.setAttribute('title', produto_loja.produto.nome_produto)
        link.setAttribute('href', '/produtoloja/'+produto_loja.id_produto_loja)
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
        link.appendChild(div_estrelas)




        h2_caixa_produto.innerText = produto_loja.produto.nome_produto.substring(0, 30)+"...";

    }

}

window.addEventListener('load', async function() {
  let dados = await listar();
  getCarregar(dados[0].produtos_loja)
  // Aqui você pode fazer algo com os dados recebidos, se necessário
});
