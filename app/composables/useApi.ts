import type { Curriculo, Etapa, Fonte, ItemFila, Funil, Lacuna, PassoAssistido, Pretensao, Skill, Vaga } from "~/composables/useDados";

/**
 * Camada de acesso a dados.
 *
 * Enquanto a `apply-api` não existe (Fase 3 do plano do serviço), lê dos dados
 * de exemplo. A troca é só apontar `base` para a API: os tipos e a forma do
 * retorno já são os definitivos.
 */
const ATRASO_SIMULADO = 260;

export type EstadoCarga = "carregando" | "pronto" | "erro" | "cache";

export interface Resultado<T> {
  dados: Ref<T | null>;
  estado: Ref<EstadoCarga>;
  carimbo: Ref<string | null>;
  erro: Ref<string | null>;
  recarregar: () => Promise<void>;
}

const CHAVE_CACHE = "apply-ui:cache";

function lerCache<T>(recurso: string): { dados: T; carimbo: string } | null {
  if (import.meta.server) return null;
  try {
    const bruto = localStorage.getItem(`${CHAVE_CACHE}:${recurso}`);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

function gravarCache<T>(recurso: string, dados: T) {
  if (import.meta.server) return;
  try {
    localStorage.setItem(
      `${CHAVE_CACHE}:${recurso}`,
      JSON.stringify({ dados, carimbo: new Date().toISOString() }),
    );
  } catch {
    // Cota estourada não pode derrubar a tela — o dado da rede continua válido.
  }
}

export function useRecurso<T>(recurso: string, buscar: () => Promise<T>): Resultado<T> {
  const dados = ref<T | null>(null) as Ref<T | null>;
  const estado = ref<EstadoCarga>("carregando");
  const carimbo = ref<string | null>(null);
  const erro = ref<string | null>(null);

  async function recarregar() {
    estado.value = "carregando";
    erro.value = null;
    try {
      const r = await buscar();
      dados.value = r;
      carimbo.value = new Date().toISOString();
      estado.value = "pronto";
      gravarCache(recurso, r);
    } catch (e) {
      // Offline nunca é tela branca: cai para o último estado conhecido, carimbado.
      const cache = lerCache<T>(recurso);
      if (cache) {
        dados.value = cache.dados;
        carimbo.value = cache.carimbo;
        estado.value = "cache";
      } else {
        estado.value = "erro";
        erro.value = e instanceof Error ? e.message : "Falha ao carregar";
      }
    }
  }

  onMounted(recarregar);

  return { dados, estado, carimbo, erro, recarregar };
}

/** Troca este bloco por `$fetch` quando a apply-api subir. */
async function doExemplo<T>(seletor: () => T): Promise<T> {
  await new Promise((r) => setTimeout(r, ATRASO_SIMULADO));
  if (!navigator.onLine) throw new Error("sem conexão");
  return seletor();
}

export function useApi() {
  const d = useDados();

  return {
    vagas: () => useRecurso<Vaga[]>("vagas", () => doExemplo(() => d.vagas)),
    fontes: () => useRecurso<Fonte[]>("fontes", () => doExemplo(() => d.fontes)),
    etapas: () => useRecurso<Etapa[]>("etapas", () => doExemplo(() => d.etapas)),
    fila: () => useRecurso<ItemFila[]>("fila", () => doExemplo(() => d.fila)),
    funil: () => useRecurso<Funil>("funil", () => doExemplo(() => d.funil)),
    lacunas: () => useRecurso<Lacuna[]>("lacunas", () => doExemplo(() => d.lacunas)),
    skills: () => useRecurso<Skill[]>("skills", () => doExemplo(() => d.skills)),
    pretensao: () => useRecurso<Pretensao[]>("pretensao", () => doExemplo(() => d.pretensao)),
    curriculos: () => useRecurso<Curriculo[]>("curriculos", () => doExemplo(() => d.curriculos)),
    passosAssistida: () => useRecurso<PassoAssistido[]>("passos", () => doExemplo(() => d.passosAssistida)),
  };
}
