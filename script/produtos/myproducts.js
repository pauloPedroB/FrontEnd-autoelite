import { buscarUsuario } from '../middleware/auth.js';
import { buscarDados } from '../middleware/dados.js';



window.addEventListener('load', async function() {
  const usuario = buscarUsuario()
  
  if (usuario) {
    if(usuario.typeUser == 2){
        console.log("Usuário autenticado. Carregando dashboard...");
      
        const dados = await buscarDados()
        if(dados == null){
          alert("Não encontramos uma Loja vinvulada ao seu usuário")
          window.location.href = "/view/home.html";
        }
        const [produtos,mensagem] = await listar()
        console.log(produtos)
        getCarregar(produtos)
        // Carregar dados, exibir conteúdo, etc.
    }
    else{
        alert("Seu usuário não possuí acesso a essa tela")
        window.location.href = "/view/home.html";
    }
  }
// Aqui você pode fazer algo com os dados recebidos, se necessário
});

async function listar(){
  const API_URL = "http://localhost:3001/produtos_loja/";
  
  try{
    const token = sessionStorage.getItem('token');
    const token_dados = sessionStorage.getItem('token_dados');

    const response = await fetch(API_URL + "listarProdutosLoja/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer "+token,
            "token_dados": token_dados
        },
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

const getCarregar = function(produtos){

  let div_produtos = document.getElementById("cards-linked")

  for (const produto of produtos){
      let div_caixa_produto = document.createElement('div')
      let h2_caixa_produto = document.createElement('h3')
      let img = document.createElement('img')
      let button = document.createElement('button')

      div_caixa_produto.setAttribute('class', 'card-linked')

      img.setAttribute('src', produto.produto.img)
      img.setAttribute('alt', produto.produto.nome_produto)
      img.setAttribute('title', produto.produto.nome_produto)
      
      div_produtos.appendChild(div_caixa_produto)
      div_caixa_produto.appendChild(h2_caixa_produto)
      div_caixa_produto.appendChild(img)
      div_caixa_produto.appendChild(button)

      h2_caixa_produto.innerText = produto.produto.nome_produto;
      button.innerText = "desvincular";

  }

}


