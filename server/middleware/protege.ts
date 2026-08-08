import { NOME_COOKIE, sessaoValida } from "~~/server/utils/autenticacao";

/**
 * Barreira no servidor.
 *
 * O guard de navegação do cliente sozinho não protege nada: bastaria pedir o
 * HTML renderizado direto para ver os dados. Esta é a barreira que vale.
 */

// Assets não carregam dado pessoal e precisam abrir antes do login (a tela de
// login usa os mesmos estilos e o mesmo ícone).
const LIVRES = [
  "/entrar",
  "/api/sessao",
  "/_nuxt",
  "/icons",
  "/splash",
  "/manifest.webmanifest",
  "/sw.js",
  "/sw-avisos.js",
  "/workbox",
  "/favicon.ico",
];

export default defineEventHandler((evento) => {
  const caminho = getRequestURL(evento).pathname;
  if (LIVRES.some((p) => caminho === p || caminho.startsWith(`${p}/`) || caminho.startsWith(`${p}-`))) return;

  const cfg = useRuntimeConfig();
  if (sessaoValida(getCookie(evento, NOME_COOKIE), cfg.segredoSessao)) return;

  // Chamada de dados responde 401; navegação vai para o login com o destino
  // guardado, para voltar ao lugar certo depois — deep link de aviso depende disso.
  if (caminho.startsWith("/api/")) {
    throw createError({ statusCode: 401, statusMessage: "Sessão expirada" });
  }

  return sendRedirect(evento, `/entrar?destino=${encodeURIComponent(caminho)}`, 302);
});
