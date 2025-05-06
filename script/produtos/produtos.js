import { buscarUsuario } from '../middleware/auth.js';
const API_URL = "http://localhost:3001/produtos/";


window.addEventListener('load', async function() {
  const params = new URLSearchParams(window.location.search);

  const usuario = buscarUsuario()
  const termo = params.get("pesquisa");
  
  if (usuario) {
    if(usuario.typeUser != 3){
      console.log("Usuário autenticado. Carregando dashboard...");
      if(usuario.typeUser == 1){
        const elemento = document.getElementById('myProducts');
        elemento.remove();
      }
      let palavras = []
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
      const [produtos, message] = await listar(palavras);

      
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
  const usuario = buscarUsuario()

  for (const produto of produtos){
      let div_caixa_produto = document.createElement('div')
      let h2_caixa_produto = document.createElement('h3')
      let img = document.createElement('img')

      div_caixa_produto.setAttribute('class', 'card-not-linked')

      img.setAttribute('src', produto.img)
      img.setAttribute('alt', produto.nome_produto)
      img.setAttribute('title', produto.nome_produto)
      
      div_produtos.appendChild(div_caixa_produto)
      div_caixa_produto.appendChild(h2_caixa_produto)
      div_caixa_produto.appendChild(img)

      h2_caixa_produto.innerText = produto.nome_produto;
      if(usuario.typeUser == 2){

        let button = document.createElement('button')

        div_caixa_produto.appendChild(button)
        button.innerText = "vincular";
      }
      else if(usuario.typeUser == 1){
        let button1 = document.createElement('button')
        div_caixa_produto.appendChild(button1)
        button1.innerText = "Editar";

        let button2 = document.createElement('button')
        div_caixa_produto.appendChild(button2)
        button2.innerText = "Excluir";

      }

  }

}


