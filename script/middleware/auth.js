const API_URL = "http://localhost:3001/usuarios/";

export async function  buscarUsuario() {
    
    const token = sessionStorage.getItem('token');
    try{
        if (token) {
            console.log(typeof(token))
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
            sessionStorage.setItem('user_id', usuario.id_usuario);

            
            return usuario;
        }
        else{
            const id_usuario = sessionStorage.getItem('user_id');

            const dadosUsuario = {
                id_user: id_usuario,
            };
            try {
                const response = await fetch(API_URL + "buscarPorEmail/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dadosUsuario),
                });
                const respostaJson = await response.json();

                const mensagem = respostaJson.message;
            
                if (response.status !== 200) {
                    return [false, mensagem];
                }
                sessionStorage.setItem('token', respostaJson.token); 

                return [respostaJson, mensagem];

            } 
            catch (error) {
                console.error("Erro na requisição:", error);
                return [null, "Erro na requisição"];
            }

        }
    }
    catch (error){
        sessionStorage.clear();
        alert("Algo deu errado, tente novamente" + error)
        window.location.href = "/view/home.html";
        return;
    }
  }