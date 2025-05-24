import { buscarUsuario } from '../middleware/auth.js';
import { buscarDados } from '../middleware/dados.js';
import { buscarEndereco } from '../middleware/endereco.js';


const token = sessionStorage.getItem('token');


const API_URL = "http://localhost:3001/produtos_loja/";
const urlParams = new URLSearchParams(window.location.search);
const idProduto = urlParams.get('id_produto_loja');
const usuario = await buscarUsuario()



window.addEventListener('load', async function() {
  
    if (usuario) {
        const endereco = await buscarEndereco()
        if(!endereco && usuario.typeUser !=1){
            window.location.href = "/view/cadastroEndereco.html";
        }

        let dado = await buscar();
        const [produtos, message] = await listar();
        console.log(produtos)
        getCarregarProdutos(produtos)

        getCarregar(dado[0])
    }
    

  });


async function buscar() {
    
    const dadosUsuario = {
        id_produto_loja: idProduto
    };

    try {
        const response = await fetch(API_URL + "buscar/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer "+token,

            },
            body: JSON.stringify(dadosUsuario),
        });
        const respostaJson = await response.json();

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
const getCarregarProdutos = async function(produtos){
    let div = document.getElementById("container-bottom content-center")
    
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

const getCarregar = async function(produto){
    let div_imagens = document.getElementById("box-imgs")
    let titulo = document.getElementById("title-product-main")
    let nome = document.getElementById("nome")
    let razao = document.getElementById("razao")
    let tel = document.getElementById("tel")
    let cel = document.getElementById("cel")

    let cep = document.getElementById("CEP")
    let rua = document.getElementById("rua")
    let nmr = document.getElementById("nmr")
    let complemento = document.getElementById("complemento")
    let bairro = document.getElementById("bairro")
    let cidade = document.getElementById("cidade")
    let uf = document.getElementById("uf")

    let distancia = document.getElementById("distancia")

    let img = document.createElement('img')
    

    


    img.setAttribute('src', produto.produto_loja.produto.img)
    img.setAttribute('alt', produto.produto_loja.produto.nome_produto)
    img.setAttribute('title', produto.produto_loja.produto.nome_produto)

    

    div_imagens.appendChild(img)
    
    titulo.innerText = produto.produto_loja.produto.nome_produto;

    nome.innerText = produto.produto_loja.loja.nomeFantasia;

    razao.innerText = produto.produto_loja.loja.razaoSocial;

    tel.innerText = produto.produto_loja.loja.telefone;

    cel.innerText = produto.produto_loja.loja.celular;

    cep.innerText = produto.produto_loja.endereco.cep;

    rua.innerText = produto.produto_loja.endereco.rua;

    nmr.innerText = produto.produto_loja.endereco.nmr;

    complemento.innerText = produto.produto_loja.endereco.complemento;

    bairro.innerText = produto.produto_loja.endereco.bairro;

    cidade.innerText = produto.produto_loja.endereco.cidade;
    uf.innerText = produto.produto_loja.endereco.uf;

 
    let iframe = document.getElementById("mapa")
    let encaminhar = document.getElementById("encaminhar")
    if(usuario){
        const dados = await buscarDados()

        const endereco = await buscarEndereco()
        

        encaminhar.href = "https://www.google.com/maps/dir/"+endereco.rua+",+"+endereco.nmr+",+"+endereco.cidade+",+"+endereco.uf+",+"+endereco.cep+"/"+produto.produto_loja.endereco.rua+",+"+produto.produto_loja.endereco.nmr+",+"+produto.produto_loja.endereco.cidade+",+"+produto.produto_loja.endereco.uf+",+"+produto.produto_loja.endereco.cep
        
    }

    iframe.src = "https://www.google.com/maps?q="+produto.produto_loja.endereco.rua+",+"+produto.produto_loja.endereco.nmr+",+"+produto.produto_loja.endereco.cidade+",+"+produto.produto_loja.endereco.uf+",+"+produto.produto_loja.endereco.cep+"&output=embed"

    distancia.innerText = parseFloat(produto.distancia).toFixed(2) + " km"
}

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
      return [respostaJson.produtos_loja, mensagem];
    }
    catch (error){
      return [null, "Erro na requisição"];
    } 
}  
