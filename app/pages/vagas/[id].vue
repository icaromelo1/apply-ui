<script setup lang="ts">
const rota = useRoute();
const { vagaPorId } = useDados();

const vaga = computed(() => vagaPorId(String(rota.params.id)));
const inteira = ref(false);

useHead({ title: () => (vaga.value ? `${vaga.value.titulo} · Apply` : "Vaga · Apply") });

if (!vaga.value) {
  throw createError({ statusCode: 404, statusMessage: "Vaga não encontrada", fatal: true });
}
</script>

<template>
  <div v-if="vaga" class="tela">
    <CabecalhoDetalhe voltar-para="/vagas" voltar-rotulo="às vagas" />

    <header class="topo-vaga">
      <NotaAderencia :nota="vaga.nota" tamanho="g" />
      <div>
        <h1>{{ vaga.titulo }}</h1>
        <p class="miudo sub">{{ vaga.empresa }} · {{ vaga.local }} · via {{ vaga.fonte }}</p>
      </div>
    </header>

    <div class="linha-faixa">
      <FaixaMoeda :moeda="vaga.moeda" :faixa="vaga.faixa" />
      <span class="miudo apagado">{{ vaga.publicada }}</span>
    </div>

    <!-- Por que essa nota: o score tem que se explicar. -->
    <section class="cartao porque">
      <h2 class="rotulo">Por que {{ vaga.nota }}</h2>
      <ul class="marcas">
        <li v-for="s in vaga.bateram" :key="s" class="marca bateu">
          <span aria-hidden="true">✓</span>{{ s }}
        </li>
        <li v-for="s in vaga.faltaram" :key="s" class="marca faltou">
          <span aria-hidden="true">✕</span>{{ s }}
        </li>
      </ul>
      <p class="explica">{{ vaga.porQue }}</p>
    </section>

    <section>
      <h2 class="rotulo">Descrição</h2>
      <p class="descricao" :class="{ cortada: !inteira }">{{ vaga.descricao }}</p>
      <button v-if="!inteira" class="ler miudo" @click="inteira = true">ler descrição completa →</button>
    </section>

    <!-- As ações ficam no polegar, fixas no rodapé. -->
    <div class="acoes">
      <NuxtLink :to="`/assistida/${vaga.id}`" class="botao principal">Assistida</NuxtLink>
      <button class="botao secundario">Automática</button>
    </div>
  </div>
</template>

<style scoped>
.tela {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.topo-vaga {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

h1 {
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.25;
}

.sub {
  color: var(--apagado);
  margin: 4px 0 0;
}

.linha-faixa {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.apagado {
  color: var(--apagado-2);
}

.porque {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h2.rotulo {
  margin: 0;
}

.marcas {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.marca {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
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

.explica {
  margin: 0;
  color: var(--texto-2);
  font-size: 14px;
}

.descricao {
  margin: 8px 0 0;
  color: var(--texto-2);
  font-size: 15px;
  line-height: 1.65;
}

.descricao.cortada {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ler {
  margin-top: 8px;
  min-height: var(--toque);
  color: var(--acao);
  font-family: var(--fonte-mono);
}

.acoes {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 35;
  display: flex;
  gap: 10px;
  padding: 12px 16px calc(12px + var(--safe-base));
  background: var(--superficie);
  border-top: 1px solid var(--borda);
}

.botao {
  flex: 1;
  min-height: 50px;
  border-radius: var(--raio);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
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

@media (min-width: 900px) {
  .acoes {
    position: static;
    padding: 0;
    background: none;
    border: none;
    max-width: 420px;
  }
}
</style>
