import { buscarUsuario } from '../middleware/auth.js';
const API_URL = "http://localhost:3001/produtos/";


window.addEventListener('load', async function() {
  const usuario = buscarUsuario()
  
  if (usuario) {
    if(usuario.typeUser != 3){
      console.log("Usuário autenticado. Carregando dashboard...");
      if(usuario.typeUser == 1){
        const elemento = document.getElementById('myProducts');
        elemento.remove();
      }
      const [produtos, message] = await listar();
      getCarregar(produtos);


      // Carregar dados, exibir conteúdo, etc.
    }
    else{
      alert("Seu usuário não possuí acesso a essa tela")
      window.location.href = "/view/home.html";
    }
  }
// Aqui você pode fazer algo com os dados recebidos, se necessário
});

async function listar(nomes = [], categoria = null){
  const dadosUsuario = {
    nomes: nomes,
    categoria: categoria,
};
  try{
    const token = sessionStorage.getItem('token');
    const response = await fetch(API_URL + "listar/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer "+token
        },
        body: JSON.stringify(dadosUsuario),
    });
    const respostaJson = await response.json();
  
    const mensagem = respostaJson.message;
  
    if (response.status !== 200) {
        return [null, mensagem];
    }
    return [respostaJson.produtos, mensagem];
  }
  catch (error){
    return [null, "Erro na requisição"];
  } 
}

const getCarregar = function(produtos){

  let div_produtos = document.getElementById("cards-not-linked")

  for (const produto of produtos){
      let div_caixa_produto = document.createElement('div')
      let h2_caixa_produto = document.createElement('h3')
      let img = document.createElement('img')
      let button = document.createElement('button')

      div_caixa_produto.setAttribute('class', 'card-not-linked')

      img.setAttribute('src', produto.img)
      img.setAttribute('alt', produto.nome_produto)
      img.setAttribute('title', produto.nome_produto)
      
      div_produtos.appendChild(div_caixa_produto)
      div_caixa_produto.appendChild(h2_caixa_produto)
      div_caixa_produto.appendChild(img)
      div_caixa_produto.appendChild(button)

      h2_caixa_produto.innerText = produto.nome_produto;
      button.innerText = "vincular";

  }

}


