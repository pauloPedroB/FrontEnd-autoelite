import { buscarUsuario } from '../middleware/auth.js';

const API_URL = "http://localhost:3001/usuarios/";
const token = sessionStorage.getItem('token');



window.addEventListener('load', async function() {
    if(token){
        const  usuario = await buscarUsuario()
        console.log(usuario)

        if(usuario.typeUser != null){
            window.location.href = "/view/home.html";
        }
    }
    else{
        window.location.href = "/view/home.html";
    }

    const form = document.getElementById('encerrarSessao');
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita o envio padrão do formulário
        sessionStorage.clear();
        form.submit();
    });

});
