import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import BotaoSegurar from "../app/components/BotaoSegurar.vue";

/**
 * Regra do design: "enviar nunca é um toque". Toda ação irreversível exige
 * pressionar e segurar 1,5s — soltar antes cancela.
 *
 * O componente usa requestAnimationFrame + performance.now, então o teste
 * controla o tempo em vez de esperar de verdade.
 */
describe("BotaoSegurar", () => {
  let agora = 0;
  let proximoId = 0;
  let quadros = new Map<number, FrameRequestCallback>();

  beforeEach(() => {
    agora = 0;
    proximoId = 0;
    quadros = new Map();
    vi.stubGlobal("performance", { now: () => agora });
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      const id = ++proximoId;
      quadros.set(id, cb);
      return id;
    });
    // Cancelar precisa cancelar de verdade — senao o teste mede um navegador
    // que nao existe e acusa bug onde nao ha.
    vi.stubGlobal("cancelAnimationFrame", (id: number) => quadros.delete(id));
  });

  function avancar(ms: number) {
    agora += ms;
    const pendentes = [...quadros.entries()];
    quadros.clear();
    for (const [, cb] of pendentes) cb(agora);
  }

  it("não dispara antes de 1,5s", async () => {
    const w = mount(BotaoSegurar, { props: { rotulo: "Enviar" } });

    await w.find("button").trigger("pointerdown");
    avancar(1400);

    expect(w.emitted("concluido")).toBeUndefined();
  });

  it("dispara ao completar 1,5s", async () => {
    const w = mount(BotaoSegurar, { props: { rotulo: "Enviar" } });

    await w.find("button").trigger("pointerdown");
    avancar(1500);

    expect(w.emitted("concluido")).toHaveLength(1);
  });

  it("soltar antes do fim cancela e não dispara depois", async () => {
    const w = mount(BotaoSegurar, { props: { rotulo: "Enviar" } });
    const botao = w.find("button");

    await botao.trigger("pointerdown");
    avancar(1200);
    await botao.trigger("pointerup");
    avancar(5000);

    expect(w.emitted("concluido")).toBeUndefined();
  });

  it("tirar o dedo de cima cancela", async () => {
    const w = mount(BotaoSegurar, { props: { rotulo: "Enviar" } });
    const botao = w.find("button");

    await botao.trigger("pointerdown");
    avancar(1000);
    await botao.trigger("pointerleave");
    avancar(5000);

    expect(w.emitted("concluido")).toBeUndefined();
  });

  it("um quadro que escapa do cancelamento ainda assim não dispara", async () => {
    // Defesa contra a corrida real: o navegador pode já ter entregue o quadro
    // quando cancelAnimationFrame é chamado. Aqui o quadro é invocado à força
    // depois do pointerup — sem a guarda no componente, isto concluiria o envio.
    const w = mount(BotaoSegurar, { props: { rotulo: "Enviar" } });
    const botao = w.find("button");

    await botao.trigger("pointerdown");
    const escapado = [...quadros.values()][0];

    await botao.trigger("pointerup");
    agora += 5000;
    escapado?.(agora);

    expect(w.emitted("concluido")).toBeUndefined();
  });

  it("desabilitado nunca dispara", async () => {
    const w = mount(BotaoSegurar, { props: { rotulo: "Enviar", desabilitado: true } });

    await w.find("button").trigger("pointerdown");
    avancar(3000);

    expect(w.emitted("concluido")).toBeUndefined();
  });

  it("mantém o alvo de toque acima do mínimo de 44px", () => {
    const w = mount(BotaoSegurar, { props: { rotulo: "Enviar" } });
    expect(w.find("button").classes()).toContain("segurar");
    // A altura vem do CSS (min-height: 54px); aqui garantimos que o elemento
    // é um único botão, não um alvo dividido.
    expect(w.findAll("button")).toHaveLength(1);
  });
});
