import { buscarUsuario } from '../middleware/auth.js';

export async function buscarDados() {
    
    const token_dados = sessionStorage.getItem('token_dados');
    const usuario = await buscarUsuario()

    try{
        if (token_dados){
            const dados = jwt_decode(token_dados);
            const agora = Math.floor(Date.now() / 1000);
        
            if (dados.exp && dados.exp < agora) {
                sessionStorage.clear();
                alert("Sessão expirada, entre novamente")
                window.location.href = "/view/login.html";
                return null;
            }
            const loja = dados.loja;

            if(loja){
                return loja;
            }

            const cliente = dados.cliente;
            if(cliente){
                return cliente;
            }
            return null;
        }
        else if (usuario.typeUser !=1 && usuario.typeUser != null){
            if(usuario == null){
                return null
            }
            
            let API_URL = "http://localhost:3001/";
            if(usuario.typeUser == 2){
                API_URL += "lojas/"
            }
            else if (usuario.typeUser == 3){
                API_URL += "clientes/"
            }
            const token = sessionStorage.getItem('token');
            const dadosUsuario = {
                id_usuario: usuario.id_usuario
            };
            const response = await fetch(API_URL + "id_user/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer "+token,


            },
            body: JSON.stringify(dadosUsuario),
            });
            if (response.status !== 200) {
                return null;
            }
            const respostaJson = await response.json();
            const mensagem = respostaJson.message;

            
            sessionStorage.setItem('token_dados', respostaJson.token_dados);

            const dados = jwt_decode(respostaJson.token_dados);
            const agora = Math.floor(Date.now() / 1000);
        
            if (dados.exp && dados.exp < agora) {
                sessionStorage.clear();
                alert("Sessão expirada, entre novamente")
                window.location.href = "/view/login.html";
                return null;
            }

            return dados;
        }
        else{
            return null;
        }
    }
    catch (error){
        sessionStorage.clear();
        alert("Algo deu errado, tente novamente" + error)
        window.location.href = "/view/home.html";
        return;
    }
  }