<script setup lang="ts">
import type { Vaga } from "~/composables/useDados";

const { vagas: buscarVagas } = useApi();
const { dados, estado, carimbo } = buscarVagas();
const vagas = computed(() => dados.value ?? []);

useHead({ title: "Vagas · Apply" });

const notaMinima = ref(false);
const moedas = ref<string[]>([]);
const soNovas = ref(false);

function alternarMoeda(m: string) {
  const i = moedas.value.indexOf(m);
  if (i === -1) moedas.value.push(m);
  else moedas.value.splice(i, 1);
}

// Ordenação só existe no desktop, onde a lista vira tabela.
type Coluna = "nota" | "titulo" | "empresa" | "faixa";
const coluna = ref<Coluna>("nota");
const descendente = ref(true);

function ordenarPor(c: Coluna) {
  if (coluna.value === c) descendente.value = !descendente.value;
  else {
    coluna.value = c;
    descendente.value = c === "nota";
  }
}

const filtradas = computed(() => {
  const lista = vagas.value
    .filter((v) => (notaMinima.value ? v.nota >= 70 : true))
    .filter((v) => (moedas.value.length ? moedas.value.includes(v.moeda) : true))
    .filter((v) => (soNovas.value ? v.nova : true));

  const dir = descendente.value ? -1 : 1;
  return [...lista].sort((a, b) => {
    if (coluna.value === "nota") return (a.nota - b.nota) * dir;
    return String(a[coluna.value]).localeCompare(String(b[coluna.value]), "pt-BR") * dir;
  });
});

// Painel lateral: clicar na linha abre o detalhe sem sair da lista.
const aberta = ref<Vaga | null>(null);

function abrirPainel(v: Vaga) {
  aberta.value = aberta.value?.id === v.id ? null : v;
}

const COLUNAS: { chave: Coluna; rotulo: string }[] = [
  { chave: "nota", rotulo: "Nota" },
  { chave: "titulo", rotulo: "Vaga" },
  { chave: "empresa", rotulo: "Empresa" },
  { chave: "faixa", rotulo: "Faixa" },
];
</script>

<template>
  <div class="tela" :class="{ 'com-painel': aberta }">
    <div class="coluna-lista">
      <header>
        <h1>Vagas</h1>
        <p class="miudo carimbo">{{ filtradas.length }} de {{ vagas.length }} · rolagem contínua</p>
      </header>

      <div class="filtros" role="group" aria-label="Filtros">
        <button class="filtro miudo" :class="{ on: notaMinima }" @click="notaMinima = !notaMinima">nota ≥ 70</button>
        <button class="filtro miudo usd" :class="{ on: moedas.includes('USD') }" @click="alternarMoeda('USD')">USD</button>
        <button class="filtro miudo eur" :class="{ on: moedas.includes('EUR') }" @click="alternarMoeda('EUR')">EUR</button>
        <button class="filtro miudo" :class="{ on: soNovas }" @click="soNovas = !soNovas">novas</button>
      </div>

      <!-- Cabeçalho de ordenação: só aparece na largura de tabela. -->
      <div class="cabecalho-tabela" role="group" aria-label="Ordenar lista">
        <div v-for="c in COLUNAS" :key="c.chave" :class="`col-${c.chave}`">
        <button
          class="col-titulo rotulo"
          :class="{ on: coluna === c.chave }"
          :aria-label="coluna === c.chave
            ? `Ordenado por ${c.rotulo}, ${descendente ? 'maior primeiro' : 'menor primeiro'}. Inverter ordem.`
            : `Ordenar por ${c.rotulo}`"
          @click="ordenarPor(c.chave)"
        >
          {{ c.rotulo }}
          <span v-if="coluna === c.chave" class="seta-ordem" aria-hidden="true">{{ descendente ? "▾" : "▴" }}</span>
        </button>
        </div>
        <div class="col-fonte rotulo">Fonte</div>
        <div class="col-acoes rotulo">Ações</div>
      </div>

      <EsqueletoLista v-if="estado === 'carregando'" :linhas="4" />

      <p v-else-if="estado === 'cache'" class="miudo do-cache">
        Mostrando o último estado conhecido de {{ new Date(carimbo!).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }}.
      </p>

      <p v-else-if="estado === 'erro'" class="miudo do-erro">
        Não deu para carregar as vagas. Toque para tentar de novo.
      </p>

      <div v-if="estado !== 'carregando'" class="lista">
        <!-- Celular: o cartão inteiro navega. Desktop: abre o painel lateral. -->
        <div
          v-for="v in filtradas"
          :key="v.id"
          class="cartao vaga"
          :class="{ ativa: aberta?.id === v.id }"
        >
          <NuxtLink :to="`/vagas/${v.id}`" class="alvo-celular" :aria-label="`Abrir ${v.titulo}`" />
          <button class="alvo-desktop" :aria-label="`Detalhes de ${v.titulo}`" @click="abrirPainel(v)" />

          <NotaAderencia :nota="v.nota" />
          <div class="corpo">
            <strong class="titulo">{{ v.titulo }}</strong>
            <span class="miudo sub">{{ v.empresa }} · {{ v.local }}</span>
            <div class="rodape">
              <FaixaMoeda :moeda="v.moeda" :faixa="v.faixa" />
              <span class="miudo fonte">{{ v.fonte }}</span>
            </div>
          </div>

          <div class="acoes-linha">
            <NuxtLink :to="`/assistida/${v.id}`" class="acao-mini principal">Assistida</NuxtLink>
            <button class="acao-mini">Auto</button>
          </div>

          <Icone nome="direita" class="seta" />
        </div>
      </div>

      <p v-if="estado !== 'carregando' && !filtradas.length" class="vazio miudo">Nenhuma vaga com esses filtros. Afrouxe um deles.</p>
    </div>

    <!-- Painel lateral do desktop: descrição + por-que-da-nota sem sair da lista. -->
    <aside v-if="aberta" class="painel" aria-label="Detalhe da vaga">
      <div class="painel-topo">
        <NotaAderencia :nota="aberta.nota" tamanho="g" />
        <button class="toque fechar" aria-label="Fechar detalhe" @click="aberta = null">
          <Icone nome="fechar" :tamanho="20" />
        </button>
      </div>

      <h2>{{ aberta.titulo }}</h2>
      <p class="miudo sub">{{ aberta.empresa }} · {{ aberta.local }} · via {{ aberta.fonte }}</p>

      <div class="linha-faixa">
        <FaixaMoeda :moeda="aberta.moeda" :faixa="aberta.faixa" />
        <span class="miudo apagado">{{ aberta.publicada }}</span>
      </div>

      <h3 class="rotulo">Por que {{ aberta.nota }}</h3>
      <ul class="marcas">
        <li v-for="s in aberta.bateram" :key="s" class="marca bateu"><span aria-hidden="true">✓</span>{{ s }}</li>
        <li v-for="s in aberta.faltaram" :key="s" class="marca faltou"><span aria-hidden="true">✕</span>{{ s }}</li>
      </ul>
      <p class="explica">{{ aberta.porQue }}</p>

      <h3 class="rotulo">Descrição</h3>
      <p class="descricao">{{ aberta.descricao }}</p>

      <div class="painel-acoes">
        <NuxtLink :to="`/assistida/${aberta.id}`" class="botao principal">Assistida</NuxtLink>
        <button class="botao secundario">Automática</button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.tela {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.coluna-lista {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

h1 {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0;
}

.carimbo {
  color: var(--apagado);
  margin: 2px 0 0;
}

.filtros {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.filtros::-webkit-scrollbar {
  display: none;
}

.filtro {
  min-height: var(--toque);
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--borda);
  background: var(--superficie);
  color: var(--apagado);
  font-family: var(--fonte-mono);
  white-space: nowrap;
  flex-shrink: 0;
}

.filtro.on {
  border-color: var(--acao);
  background: var(--acao-fraca);
  color: var(--acao);
}

.filtro.usd.on {
  border-color: var(--usd);
  color: var(--usd);
}

.filtro.eur.on {
  border-color: var(--eur);
  color: var(--eur);
  background: color-mix(in srgb, var(--eur) 12%, transparent);
}

.cabecalho-tabela {
  display: none;
}

.lista {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.vaga {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  color: var(--texto);
}

/* No celular o cartão inteiro é o link; no desktop o botão do painel assume. */
.alvo-celular {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
}

.alvo-desktop {
  display: none;
}

.corpo {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.titulo {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}

.sub {
  color: var(--apagado);
}

.rodape {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 3px;
}

.fonte {
  color: var(--apagado-2);
  font-family: var(--fonte-mono);
}

.acoes-linha {
  display: none;
}

.seta {
  color: var(--apagado-2);
  flex-shrink: 0;
}

.do-cache {
  color: var(--exige);
  margin: 0;
}

.do-erro {
  color: var(--travado);
  margin: 0;
}

.vazio {
  color: var(--apagado);
  text-align: center;
  padding: 30px 0;
}

@media (min-width: 900px) {
  .tela.com-painel {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 22rem;
    gap: 20px;
    align-items: start;
  }

  .cabecalho-tabela {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 14px 8px;
    border-bottom: 1px solid var(--borda);
  }

  .cabecalho-tabela > div {
    display: flex;
    align-items: center;
  }

  .col-titulo {
    display: inline-flex;
    width: 100%;
    align-items: center;
    gap: 4px;
    min-height: 32px;
    color: var(--apagado);
    background: none;
  }

  .col-titulo.on {
    color: var(--acao);
  }

  .col-nota {
    flex: 0 0 42px;
  }

  .col-titulo {
    flex: 1;
  }

  .col-empresa,
  .col-faixa {
    flex: 1;
  }

  .col-fonte {
    flex: 0 0 90px;
  }

  .col-acoes {
    flex: 0 0 150px;
    text-align: right;
  }

  .seta-ordem {
    font-size: 10px;
  }

  .lista {
    gap: 0;
    border: 1px solid var(--borda);
    border-top: none;
    border-radius: 0 0 var(--raio) var(--raio);
    overflow: hidden;
  }

  .vaga {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid var(--borda);
    background: var(--superficie);
  }

  .vaga:last-child {
    border-bottom: none;
  }

  .vaga:hover {
    background: var(--superficie-alta);
  }

  .vaga.ativa {
    background: var(--acao-fraca);
    box-shadow: inset 3px 0 0 var(--acao);
  }

  .alvo-celular {
    display: none;
  }

  .alvo-desktop {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .corpo {
    flex-direction: row;
    align-items: center;
    gap: 14px;
  }

  .titulo {
    flex: 2;
  }

  .sub {
    flex: 1;
  }

  .rodape {
    margin-top: 0;
    flex: 1;
  }

  /* Ações ficam acima do alvo de clique da linha. */
  .acoes-linha {
    display: flex;
    gap: 6px;
    flex: 0 0 150px;
    justify-content: flex-end;
    position: relative;
    z-index: 2;
  }

  .acao-mini {
    min-height: 34px;
    padding: 0 11px;
    border-radius: var(--raio-p);
    border: 1px solid var(--borda-forte);
    background: var(--superficie-alta);
    color: var(--texto-2);
    font-size: 13px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
  }

  .acao-mini.principal {
    border-color: var(--acao);
    background: var(--acao-fraca);
    color: var(--acao);
  }

  .seta {
    display: none;
  }

  .painel {
    position: sticky;
    top: 28px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    background: var(--superficie);
    border: 1px solid var(--borda);
    border-radius: var(--raio);
    max-height: calc(100dvh - 56px);
    overflow-y: auto;
  }

  .painel-topo {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .fechar {
    color: var(--apagado);
  }

  .painel h2 {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1.3;
  }

  .painel .sub {
    margin: 0;
  }

  .linha-faixa {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-bottom: 4px;
  }

  .apagado {
    color: var(--apagado-2);
  }

  .painel h3.rotulo {
    margin: 6px 0 0;
  }

  .marcas {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .marca {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 999px;
    font-size: 12px;
    font-family: var(--fonte-mono);
  }

  .marca.bateu {
    background: var(--acao-fraca);
    color: var(--acao);
  }

  .marca.faltou {
    background: var(--superficie-alta);
    color: var(--apagado);
  }

  .explica,
  .descricao {
    margin: 0;
    color: var(--texto-2);
    font-size: 14px;
    line-height: 1.6;
  }

  .painel-acoes {
    display: flex;
    gap: 8px;
    margin-top: 6px;
  }

  .botao {
    flex: 1;
    min-height: var(--toque);
    border-radius: var(--raio-p);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
  }

  .principal {
    background: var(--acao);
    color: var(--acao-tinta);
  }

  .secundario {
    background: var(--superficie-alta);
    color: var(--texto);
    border: 1px solid var(--borda-forte);
  }
}
</style>
