<script setup lang="ts">
const { vagas } = useDados();

useHead({ title: "Vagas · Apply" });

const notaMinima = ref(false);
const moedas = ref<string[]>([]);
const soNovas = ref(false);

function alternarMoeda(m: string) {
  const i = moedas.value.indexOf(m);
  if (i === -1) moedas.value.push(m);
  else moedas.value.splice(i, 1);
}

const filtradas = computed(() =>
  vagas
    .filter((v) => (notaMinima.value ? v.nota >= 70 : true))
    .filter((v) => (moedas.value.length ? moedas.value.includes(v.moeda) : true))
    .filter((v) => (soNovas.value ? v.nova : true))
    .sort((a, b) => b.nota - a.nota),
);
</script>

<template>
  <div class="tela">
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

    <!-- Celular: cards. Desktop: as mesmas células viram linhas de tabela. -->
    <div class="lista">
      <NuxtLink v-for="v in filtradas" :key="v.id" :to="`/vagas/${v.id}`" class="cartao vaga">
        <NotaAderencia :nota="v.nota" />
        <div class="corpo">
          <strong class="titulo">{{ v.titulo }}</strong>
          <span class="miudo sub">{{ v.empresa }} · {{ v.local }}</span>
          <div class="rodape">
            <FaixaMoeda :moeda="v.moeda" :faixa="v.faixa" />
            <span class="miudo fonte">{{ v.fonte }}</span>
          </div>
        </div>
        <Icone nome="direita" class="seta" />
      </NuxtLink>
    </div>

    <p v-if="!filtradas.length" class="vazio miudo">Nenhuma vaga com esses filtros. Afrouxe um deles.</p>
  </div>
</template>

<style scoped>
.tela {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.lista {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.vaga {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  color: var(--texto);
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

.seta {
  color: var(--apagado-2);
  flex-shrink: 0;
}

.vazio {
  color: var(--apagado);
  text-align: center;
  padding: 30px 0;
}

@media (min-width: 900px) {
  .lista {
    gap: 0;
    border: 1px solid var(--borda);
    border-radius: var(--raio);
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

  .corpo {
    flex-direction: row;
    align-items: center;
    gap: 18px;
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
    justify-content: flex-end;
  }
}
</style>
