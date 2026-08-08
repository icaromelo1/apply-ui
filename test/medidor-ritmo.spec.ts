import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import MedidorRitmo from "../app/components/MedidorRitmo.vue";

/**
 * Salvaguarda anti-spam: o medidor fica âmbar perto do teto e trava no limite.
 * O Ashby sinalizou spam com 18 envios num dia — é a regra que existe por causa disso.
 */
describe("MedidorRitmo", () => {
  const corDe = (usado: number, teto: number) => {
    const w = mount(MedidorRitmo, { props: { usado, teto } });
    return w.find(".preenchido").attributes("style") ?? "";
  };

  it("usa a cor de ação quando está longe do teto", () => {
    expect(corDe(2, 10)).toContain("--acao");
  });

  it("vira âmbar a partir de 75% do teto", () => {
    expect(corDe(8, 10)).toContain("--exige");
  });

  it("vira vermelho e avisa que travou ao atingir o teto", () => {
    const w = mount(MedidorRitmo, { props: { usado: 10, teto: 10 } });
    expect(w.find(".preenchido").attributes("style")).toContain("--travado");
    expect(w.text()).toContain("Teto atingido");
  });

  it("continua travado se o uso passar do teto", () => {
    const w = mount(MedidorRitmo, { props: { usado: 18, teto: 5 } });
    expect(w.find(".preenchido").attributes("style")).toContain("--travado");
    expect(w.text()).toContain("Teto atingido");
  });

  it("nunca desenha barra além de 100%", () => {
    const estilo = mount(MedidorRitmo, { props: { usado: 50, teto: 5 } })
      .find(".preenchido")
      .attributes("style");
    expect(estilo).toContain("width: 100%");
  });

  it("não avisa de travamento quando ainda há folga", () => {
    const w = mount(MedidorRitmo, { props: { usado: 4, teto: 10 } });
    expect(w.text()).not.toContain("Teto atingido");
  });

  it("teto zero não gera divisão por zero", () => {
    const estilo = mount(MedidorRitmo, { props: { usado: 0, teto: 0 } })
      .find(".preenchido")
      .attributes("style");
    expect(estilo).toContain("width: 0%");
  });
});
