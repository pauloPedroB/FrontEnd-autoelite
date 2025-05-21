const API_URL = "http://localhost:3001/produtos/";
const urlParams = new URLSearchParams(window.location.search);
const idProduto = urlParams.get('id_produto_loja');

async function buscar(nomes = [], categoria = null) {
    
    const dadosUsuario = {
        id_produto: idProduto
    };

    try {
        const response = await fetch(API_URL + "buscar/", {
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
const getCarregar = function(produto){
    
    let div_imagens = document.getElementById("box-imgs")
    let titulo = document.getElementById("title-product-main")

    let img = document.createElement('img')
    let div_estrelas = document.createElement('div')
    

    

    div_estrelas.setAttribute('class', 'estrelas')

    img.setAttribute('src', produto.img)
    img.setAttribute('alt', produto.nome_produto)
    img.setAttribute('title', produto.nome_produto)

    div_estrelas.innerHTML = `
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star-half-stroke"></i>
        <i class="fa-regular fa-star"></i>
    `;

    div_imagens.appendChild(img)
    



    titulo.innerText = produto.nome_produto;

    

}
window.addEventListener('load', async function() {
    let dado = await buscar();
    getCarregar(dado[0].produto)
    const [produtos, message] = await listar();
    getCarregarProdutos(produtos)
  });

const getCarregarProdutos = async function(produtos){
    let div = document.getElementById("containertop")

    for(const produto of produtos){
        let div_caixa_produto = document.createElement('a')
        let titulo = document.createElement('p')
        let img = document.createElement('img')

        div_caixa_produto.setAttribute('class', 'box-produt')
        div_caixa_produto.setAttribute('href', `/view/productViewClient.html?id_produto_loja=${produto.id_produto_loja}`);
        
        titulo.innerText = produto.produto.nome_produto.slice(0,20)+"..."
        img.src = produto.produto.img
        div.appendChild(div_caixa_produto)
        div_caixa_produto.appendChild(titulo)
        div_caixa_produto.appendChild(img)
    }

}



async function listar(nomes = [], categoria = null){
    const dadosUsuario = {
        nomes: nomes,
        categoria: categoria,
    };
    try{
      const token = sessionStorage.getItem('token');
        const API_URL2 = "http://localhost:3001/produtos_loja/";

      const response = await fetch(API_URL2 + "listar/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosUsuario),
      });
      const respostaJson = await response.json();
    
      const mensagem = respostaJson.message;
    
      if (response.status !== 200) {
          return [null, mensagem];
      }
      return [respostaJson.produtos_loja, mensagem];
    }
    catch (error){
      return [null, "Erro na requisição"];
    } 
}  
