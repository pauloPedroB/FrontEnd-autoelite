import { buscarUsuario } from '../middleware/auth.js';

if (buscarUsuario()) {
  console.log("Usuário autenticado. Carregando dashboard...");
  // Carregar dados, exibir conteúdo, etc.
}