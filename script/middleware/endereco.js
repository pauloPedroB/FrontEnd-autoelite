import { buscarUsuario } from '../middleware/auth.js';
import { buscarDados } from './dados.js';

export async function buscarEndereco() {
    const usuario = buscarUsuario()
    const dados = buscarDados()
    const token = sessionStorage.getItem('token');

    const token_dados = sessionStorage.getItem('token_dados');

    let API_URL = "http://localhost:3001/enderecos/";
    if(usuario && dados){
        const response = await fetch(API_URL + "id_user/", {
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
            return null;
        }
        const dados = jwt_decode(respostaJson.token_endereco);
        const agora = Math.floor(Date.now() / 1000);
    
        if (dados.exp && dados.exp < agora) {
            sessionStorage.clear();
            alert("Sessão expirada, entre novamente")
            window.location.href = "/view/login.html";
            return null;
        }
        return dados.endereco;
    }
    else{
        return null
    }


}
    