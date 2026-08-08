import {
  NOME_COOKIE,
  bloqueadoAte,
  criarSessao,
  limparFalhas,
  registrarFalha,
  senhaConfere,
} from "~~/server/utils/autenticacao";

export default defineEventHandler(async (evento) => {
  const cfg = useRuntimeConfig();
  const ip = getRequestIP(evento, { xForwardedFor: true }) ?? "desconhecido";

  const ate = bloqueadoAte(ip);
  if (ate) {
    const minutos = Math.ceil((ate - Date.now()) / 60000);
    throw createError({
      statusCode: 429,
      statusMessage: `Muitas tentativas. Tente de novo em ${minutos} min.`,
    });
  }

  const { senha } = await readBody<{ senha?: string }>(evento);

  if (!senha || !cfg.senhaHash || !senhaConfere(senha, cfg.senhaHash)) {
    registrarFalha(ip);
    throw createError({ statusCode: 401, statusMessage: "Senha incorreta." });
  }

  limparFalhas(ip);

  setCookie(evento, NOME_COOKIE, criarSessao(cfg.segredoSessao), {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return { ok: true };
});
