<script setup lang="ts">
const { etapas } = useDados();
useHead({ title: "Etapas · Apply" });

const suas = computed(() => etapas.filter((e) => e.dependeDeVoce));
const sozinhas = computed(() => etapas.filter((e) => !e.dependeDeVoce));
</script>

<template>
  <div class="tela">
    <header>
      <h1>Etapas</h1>
      <p class="miudo carimbo">{{ etapas.length }} processos vivos · {{ suas.length }} dependem de você</p>
    </header>

    <section>
      <h2 class="rotulo exige">Depende de você</h2>
      <div class="lista">
        <article v-for="e in suas" :key="e.id" class="cartao item exige-borda">
          <div class="topo">
            <strong>{{ e.empresa }}</strong>
            <span class="miudo prazo" :class="{ urgente: e.prazo === 'vence amanhã' }">{{ e.prazo }}</span>
          </div>
          <p class="desc">{{ e.descricao }}</p>
          <button v-if="e.acao" class="botao">{{ e.acao }}</button>
        </article>
      </div>
    </section>

    <section>
      <h2 class="rotulo">Correndo sozinho</h2>
      <div class="lista">
        <article v-for="e in sozinhas" :key="e.id" class="cartao item">
          <div class="topo">
            <strong>{{ e.empresa }}</strong>
            <span class="miudo apagado">{{ e.quando }}</span>
          </div>
          <p class="desc">{{ e.descricao }}</p>
          <PilulaEstado estado="correndo" />
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tela { display: flex; flex-direction: column; gap: 24px; }
h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.03em; margin: 0; }
.carimbo { color: var(--apagado); margin: 2px 0 0; }
h2.rotulo { margin: 0 0 10px; }
h2.exige { color: var(--exige); }
.lista { display: flex; flex-direction: column; gap: 9px; }
.item { padding: 14px; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.exige-borda { border-color: var(--exige); }
.topo { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; width: 100%; }
.prazo { color: var(--apagado); font-family: var(--fonte-mono); }
.prazo.urgente { color: var(--exige); }
.apagado { color: var(--apagado-2); font-family: var(--fonte-mono); }
.desc { margin: 0; color: var(--texto-2); font-size: 14px; }
.botao { min-height: var(--toque); padding: 0 18px; border-radius: var(--raio-p); background: var(--exige); color: var(--exige-tinta); font-weight: 600; font-size: 14px; }
@media (min-width: 900px) { .lista { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); align-items: start; } }
</style>
