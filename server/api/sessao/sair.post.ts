import { NOME_COOKIE } from "~~/server/utils/autenticacao";

export default defineEventHandler((evento) => {
  deleteCookie(evento, NOME_COOKIE, { path: "/" });
  return { ok: true };
});
