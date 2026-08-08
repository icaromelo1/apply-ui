import { NOME_COOKIE, sessaoValida } from "~~/server/utils/autenticacao";

export default defineEventHandler((evento) => {
  const cfg = useRuntimeConfig();
  return { autenticado: sessaoValida(getCookie(evento, NOME_COOKIE), cfg.segredoSessao) };
});
