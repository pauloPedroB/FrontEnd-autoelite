const API_URL = "http://localhost:3001/usuarios/";

export function buscarUsuario() {
    
    const token = sessionStorage.getItem('token');
    try{
        if (token){
            const dados = jwt_decode(token);
            const agora = Math.floor(Date.now() / 1000);
        
            if (dados.exp && dados.exp < agora) {
                sessionStorage.clear();
                alert("Sessão expirada, entre novamente")
                window.location.href = "/view/login.html";
                return null;
            }
            const usuario = dados.usuario;
            if(usuario.verificado == null){
                window.location.href = "/view/verificEmail.html";
                return null;
            }
            return dados;

        }
        else{
            alert("Faça Login para acessar o sistema")
            window.location.href = "/view/login.html";
            return null;
            //response = await fetch(API_URL + "buscarPorEmail/", {
            //    method: "POST",
            //    headers: {
            //        "Content-Type": "application/json",
            //    },
            //    body: JSON.stringify(dadosUsuario),
            //});

            //const respostaJson = await response.json();

            //const mensagem = respostaJson.message;

            //if (response.status !== 200) {
            //    alert("Usuário não encontrado")
            //    window.location.href = "/view/login.html";
            //    return null, mensagem
            //}

        }
    }
    catch (error){
        sessionStorage.clear();
        alert("Algo deu errado, tente novamente" + error)
        window.location.href = "/view/home.html";
        return;
    }
  }