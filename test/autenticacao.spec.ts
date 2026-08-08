import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  bloqueadoAte,
  criarSessao,
  gerarHash,
  limparFalhas,
  registrarFalha,
  senhaConfere,
  sessaoValida,
} from "../server/utils/autenticacao";

describe("senha", () => {
  const hash = gerarHash("senha-correta");

  it("aceita a senha certa", () => {
    expect(senhaConfere("senha-correta", hash)).toBe(true);
  });

  it("recusa a senha errada", () => {
    expect(senhaConfere("senha-errada", hash)).toBe(false);
  });

  it("recusa senha vazia", () => {
    expect(senhaConfere("", hash)).toBe(false);
  });

  it("gera hash diferente para a mesma senha (sal aleatório)", () => {
    expect(gerarHash("igual")).not.toBe(gerarHash("igual"));
  });

  it("não quebra com hash malformado", () => {
    expect(senhaConfere("x", "lixo")).toBe(false);
    expect(senhaConfere("x", "")).toBe(false);
  });
});

describe("sessão", () => {
  const segredo = "segredo-de-teste";

  it("valida a sessão que ela mesma emitiu", () => {
    expect(sessaoValida(criarSessao(segredo), segredo)).toBe(true);
  });

  it("recusa sessão assinada com outro segredo", () => {
    expect(sessaoValida(criarSessao("outro"), segredo)).toBe(false);
  });

  it("recusa cookie ausente ou malformado", () => {
    expect(sessaoValida(undefined, segredo)).toBe(false);
    expect(sessaoValida("", segredo)).toBe(false);
    expect(sessaoValida("semponto", segredo)).toBe(false);
  });

  it("recusa sessão expirada mesmo com assinatura válida", () => {
    // Assinatura correta para um instante no passado: o prazo tem que barrar.
    const passado = String(Date.now() - 1000);
    const assinatura = createHmac("sha256", segredo).update(passado).digest("base64url");
    expect(sessaoValida(`${passado}.${assinatura}`, segredo)).toBe(false);
  });

  it("recusa prazo adulterado — a assinatura não acompanha", () => {
    const assinatura = criarSessao(segredo).split(".")[1];
    const esticado = `${Date.now() + 999_999_999}.${assinatura}`;
    expect(sessaoValida(esticado, segredo)).toBe(false);
  });
});

describe("freio de força bruta", () => {
  it("libera enquanto está abaixo do teto", () => {
    const ip = "1.1.1.1";
    limparFalhas(ip);
    for (let i = 0; i < 4; i++) registrarFalha(ip);
    expect(bloqueadoAte(ip)).toBe(0);
  });

  it("bloqueia ao chegar no teto", () => {
    const ip = "2.2.2.2";
    limparFalhas(ip);
    for (let i = 0; i < 5; i++) registrarFalha(ip);
    expect(bloqueadoAte(ip)).toBeGreaterThan(Date.now());
  });

  it("acerto limpa o bloqueio", () => {
    const ip = "3.3.3.3";
    limparFalhas(ip);
    for (let i = 0; i < 6; i++) registrarFalha(ip);
    limparFalhas(ip);
    expect(bloqueadoAte(ip)).toBe(0);
  });
});
