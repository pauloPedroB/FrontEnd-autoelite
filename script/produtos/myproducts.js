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

      div_caixa_produto.setAttribute('class', 'card-linked')

      img.setAttribute('src', produto.produto.img)
      img.setAttribute('alt', produto.produto.nome_produto)
      img.setAttribute('title', produto.produto.nome_produto)
      
      div_produtos.appendChild(div_caixa_produto)
      div_caixa_produto.appendChild(h2_caixa_produto)
      div_caixa_produto.appendChild(img)
      const formulario = document.createElement('form');
      formulario.id = 'formulario';
      const botaoID = document.createElement('input');
      botaoID.type = 'text';
      botaoID.value = produto.id_produto_loja;
      botaoID.name = "id";


      botaoID.style.display = 'none';
      const botaoEnviar = document.createElement('input');
      botaoEnviar.type = 'submit';
      botaoEnviar.value = 'Desvincular';

      
      
      div_caixa_produto.appendChild(formulario)
      formulario.appendChild(botaoID)

      formulario.appendChild(botaoEnviar)
      formulario.addEventListener("submit", async function(e) {
        e.preventDefault();
        const mensagem = await excluirProduto(botaoID.value);
        alert(mensagem)
        window.location.reload();

      });

      h2_caixa_produto.innerText = produto.produto.nome_produto;

  }

}

const excluirProduto = async function(id){
  const token = sessionStorage.getItem('token');
  const token_dados = sessionStorage.getItem('token_dados');

  const resposta = await fetch('http://localhost:3001/produtos_loja/excluir/', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              "authorization": "Bearer "+token,
              "token_dados": token_dados
          },
          body: JSON.stringify({ id_produto_loja: id })
        });
        const respostaJson = await resposta.json();
  
        const mensagem = respostaJson.message;
        return mensagem
}


