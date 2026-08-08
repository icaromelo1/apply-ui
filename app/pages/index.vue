<script setup lang="ts">
const { funil: buscarFunil, fontes: buscarFontes, fila: buscarFila, etapas: buscarEtapas } = useApi();
const { dados: funilD, estado } = buscarFunil();
const { dados: fontesD } = buscarFontes();
const { dados: filaD } = buscarFila();
const { dados: etapasD } = buscarEtapas();

const funil = computed(() => funilD.value);
const fontes = computed(() => fontesD.value ?? []);
const fila = computed(() => filaD.value ?? []);
const etapas = computed(() => etapasD.value ?? []);

useHead({ title: "Hoje · Apply" });

const hoje = new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" });
const periodo = ref<"7d" | "30d" | "tudo">("7d");

const pendencias = computed(() => {
  const itens: { texto: string; para: string; acao: string }[] = [];
  if (fila.value.length) itens.push({ texto: `${fila.value.length} candidaturas travadas`, para: "/acao", acao: "fila" });
  itens.push({ texto: "2 assistidas para revisar", para: "/acao", acao: "revisar" });

  const comPrazo = etapas.value.filter((e) => e.dependeDeVoce && e.prazo && e.prazo !== "sem prazo");
  if (comPrazo.length) {
    itens.push({ texto: `${comPrazo.length} teste vence amanhã`, para: "/etapas", acao: "etapas" });
  }
  return itens;
});

const total = computed(() => pendencias.value.reduce((s, p) => s + (Number.parseInt(p.texto) || 1), 0));

const passos = computed(() => {
  const f = funil.value;
  if (!f) return [];
  return [
    { rotulo: "encontradas", valor: f.encontradas },
    { rotulo: "pontuadas", valor: f.pontuadas },
    { rotulo: "na fila", valor: f.naFila },
    { rotulo: "enviadas", valor: f.enviadas, destaque: true },
    { rotulo: "resposta", valor: f.resposta },
    { rotulo: "entrevista", valor: f.entrevista, destaque: true },
  ];
});

const maior = computed(() => Math.max(1, ...passos.value.map((p) => p.valor)));
const ativas = computed(() => fontes.value.filter((f) => f.vagasHoje > 0 || f.pausada));
</script>

<template>
  <div class="tela">
    <header class="cabeca-tela">
      <div>
        <h1>Hoje</h1>
        <p class="miudo carimbo">{{ hoje }} · atualizado 09:41</p>
      </div>
      <SinoAvisos />
    </header>

    <!-- Âmbar sempre acima da dobra: o que exige você vem primeiro. -->
    <section class="cartao exige-bloco">
      <div class="cabeca">
        <span class="rotulo exige-rotulo">Exige sua ação</span>
        <span class="mono contador">{{ total }}</span>
      </div>
      <NuxtLink v-for="p in pendencias" :key="p.texto" :to="p.para" class="pendencia">
        <span>{{ p.texto }}</span>
        <span class="miudo ir">{{ p.acao }} →</span>
      </NuxtLink>
    </section>

    <section>
      <div class="cabeca-secao">
        <h2>Funil</h2>
        <div class="periodos" role="group" aria-label="Período">
          <button
            v-for="p in (['7d', '30d', 'tudo'] as const)"
            :key="p"
            class="periodo miudo"
            :class="{ on: periodo === p }"
            @click="periodo = p"
          >
            {{ p }}
          </button>
        </div>
      </div>

      <EsqueletoLista v-if="estado === 'carregando'" :linhas="3" />
      <div v-else class="cartao funil">
        <div v-for="p in passos" :key="p.rotulo" class="passo">
          <div class="passo-topo">
            <span class="miudo">{{ p.rotulo }}</span>
            <span class="mono numero" :class="{ destaque: p.destaque }">{{ p.valor }}</span>
          </div>
          <div class="trilho">
            <div
              class="preenchido"
              :style="{ width: (p.valor / maior) * 100 + '%', background: p.destaque ? 'var(--acao)' : 'var(--borda-forte)' }"
            />
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="cabeca-secao">
        <h2>Por fonte</h2>
        <span class="miudo apagado">hoje</span>
      </div>
      <div class="fontes">
        <NuxtLink v-for="f in ativas" :key="f.id" to="/fontes" class="cartao fonte">
          <div class="fonte-nome">
            <strong>{{ f.nome }}</strong>
            <PilulaEstado v-if="f.pausada" estado="travado" texto="pausada · ritmo" />
          </div>
          <div v-if="!f.pausada" class="mono fonte-num">
            <span>{{ f.vagasHoje }} vagas</span>
            <span class="env">{{ f.enviadasHoje }} env.</span>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tela {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.cabeca-tela {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

h1 {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0;
}

h2 {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.carimbo {
  color: var(--apagado);
  margin: 2px 0 0;
}

.exige-bloco {
  border-color: var(--exige);
  background: var(--exige-fraca);
  padding: 4px 14px 6px;
}

.cabeca {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0 8px;
}

.exige-rotulo {
  color: var(--exige);
}

.contador {
  margin-left: auto;
  font-weight: 700;
  font-size: 18px;
  color: var(--exige);
}

.pendencia {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: var(--toque);
  padding: 9px 0;
  border-top: 1px solid color-mix(in srgb, var(--exige) 28%, transparent);
  color: var(--texto);
  font-size: 15px;
}

.ir {
  color: var(--exige);
  font-family: var(--fonte-mono);
  white-space: nowrap;
}

.cabeca-secao {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.periodos {
  margin-left: auto;
  display: flex;
  gap: 4px;
  background: var(--superficie);
  border: 1px solid var(--borda);
  border-radius: 999px;
  padding: 3px;
}

.periodo {
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  color: var(--apagado);
  font-family: var(--fonte-mono);
}

.periodo.on {
  background: var(--acao-fraca);
  color: var(--acao);
}

.funil {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.passo-topo {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 5px;
}

.numero {
  font-size: 16px;
  font-weight: 600;
  color: var(--texto-2);
}

.numero.destaque {
  color: var(--acao);
}

.trilho {
  height: 3px;
  background: var(--superficie-alta);
  border-radius: 999px;
  overflow: hidden;
}

.preenchido {
  height: 100%;
  border-radius: 999px;
}

.fontes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fonte {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: var(--toque);
  padding: 12px 14px;
  color: var(--texto);
}

.fonte-nome {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-wrap: wrap;
}

.fonte-num {
  display: flex;
  gap: 14px;
  font-size: 13px;
  color: var(--apagado);
  white-space: nowrap;
}

.env {
  color: var(--acao);
}

@media (min-width: 900px) {
  .funil {
    flex-direction: row;
    gap: 26px;
  }

  .passo {
    flex: 1;
  }

  .fontes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  }
}
</style>
