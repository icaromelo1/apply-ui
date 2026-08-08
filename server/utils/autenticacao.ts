import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Autenticação de sessão do painel.
 *
 * Um único usuário. A senha vive como hash scrypt em variável de ambiente, e a
 * sessão é um cookie assinado — sem estado no servidor, para o container poder
 * reiniciar sem derrubar quem está logado.
 */

const DURACAO_SESSAO_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias: é ferramenta pessoal
export const NOME_COOKIE = "apply_sessao";

/** Gera `salt:hash` para guardar em APPLY_SENHA_HASH. */
export function gerarHash(senha: string): string {
  const sal = randomBytes(16).toString("hex");
  const derivada = scryptSync(senha, sal, 64).toString("hex");
  return `${sal}:${derivada}`;
}

export function senhaConfere(senha: string, guardado: string): boolean {
  const [sal, esperado] = guardado.split(":");
  if (!sal || !esperado) return false;

  const derivada = scryptSync(senha, sal, 64);
  const alvo = Buffer.from(esperado, "hex");

  // Comparação de tempo constante: um `===` vazaria o tamanho do prefixo correto.
  if (derivada.length !== alvo.length) return false;
  return timingSafeEqual(derivada, alvo);
}

function assinar(carga: string, segredo: string): string {
  return createHmac("sha256", segredo).update(carga).digest("base64url");
}

export function criarSessao(segredo: string): string {
  const expira = String(Date.now() + DURACAO_SESSAO_MS);
  return `${expira}.${assinar(expira, segredo)}`;
}

export function sessaoValida(cookie: string | undefined, segredo: string): boolean {
  if (!cookie) return false;

  const [expira, assinatura] = cookie.split(".");
  if (!expira || !assinatura) return false;

  const esperada = Buffer.from(assinar(expira, segredo));
  const recebida = Buffer.from(assinatura);
  if (esperada.length !== recebida.length) return false;
  if (!timingSafeEqual(esperada, recebida)) return false;

  return Number(expira) > Date.now();
}

/**
 * Freio de força bruta.
 *
 * Em memória: o painel é de um usuário só e roda num container. Se virar
 * multi-instância, isto precisa sair para um armazenamento compartilhado.
 */
const tentativas = new Map<string, { contagem: number; ate: number }>();
const TETO = 5;
const CASTIGO_MS = 15 * 60 * 1000;

export function bloqueadoAte(chave: string): number {
  const t = tentativas.get(chave);
  if (!t) return 0;
  if (t.ate <= Date.now()) {
    tentativas.delete(chave);
    return 0;
  }
  return t.contagem >= TETO ? t.ate : 0;
}

export function registrarFalha(chave: string): void {
  const t = tentativas.get(chave) ?? { contagem: 0, ate: 0 };
  t.contagem += 1;
  if (t.contagem >= TETO) t.ate = Date.now() + CASTIGO_MS;
  tentativas.set(chave, t);
}

export function limparFalhas(chave: string): void {
  tentativas.delete(chave);
}
