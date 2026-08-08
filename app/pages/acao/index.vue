<script setup lang="ts">
const { fila } = useDados();
useHead({ title: "Ação · Apply" });

const ampliado = ref<string | null>(null);
const assistidasPendentes = [
  { id: "brightflow-sr-fullstack", empresa: "Brightflow", cargo: "Senior Full Stack", passo: "passo 3 de 6" },
  { id: "datora-backend-node", empresa: "Datora", cargo: "Backend Engineer", passo: "não iniciada" },
];
</script>

<template>
  <div class="tela">
    <header>
      <h1>Ação</h1>
      <p class="miudo carimbo">{{ fila.length }} travadas · {{ assistidasPendentes.length }} assistidas para revisar</p>
    </header>

    <section>
      <h2 class="rotulo">Assistidas para revisar</h2>
      <div class="lista">
        <NuxtLink v-for="a in assistidasPendentes" :key="a.id" :to="`/assistida/${a.id}`" class="cartao item">
          <PilulaEstado estado="exige" texto="revisar" />
          <div class="corpo">
            <strong>{{ a.empresa }} · {{ a.cargo }}</strong>
            <span class="miudo apagado">{{ a.passo }}</span>
          </div>
          <span class="material-symbols-outlined seta" aria-hidden="true">chevron_right</span>
        </NuxtLink>
      </div>
    </section>

    <section>
      <h2 class="rotulo">Fila de revisão · travadas</h2>
      <div class="lista">
        <article v-for="f in fila" :key="f.id" class="cartao travada">
          <div class="travada-topo">
            <div class="corpo">
              <strong>{{ f.empresa }} · {{ f.cargo }}</strong>
              <span class="miudo apagado">{{ f.quando }}</span>
            </div>
            <PilulaEstado estado="travado" />
          </div>

          <p class="motivo">{{ f.motivo }}</p>

          <!-- Recorte do print; toque abre em tela cheia com zoom. -->
          <button class="recorte" @click="ampliado = f.id">
            <span class="material-symbols-outlined">image</span>
            <span class="miudo">recorte do erro · toque para ampliar</span>
          </button>

          <div class="botoes">
            <button class="botao secundario">Assumir manual</button>
            <button class="botao principal">Tentar de novo</button>
          </div>
        </article>
      </div>
    </section>

    <!-- Tela cheia: pinça para zoom, o print inteiro sem moldura. -->
    <div v-if="ampliado" class="cheia" role="dialog" aria-label="Print da tela onde travou">
      <button class="fechar toque" aria-label="Fechar" @click="ampliado = null">
        <span class="material-symbols-outlined">close</span>
      </button>
      <div class="moldura">
        <p class="miudo apagado">print em tela cheia · pinça para zoom · duplo toque no campo com erro</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tela { display: flex; flex-direction: column; gap: 24px; }
h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.03em; margin: 0; }
.carimbo { color: var(--apagado); margin: 2px 0 0; }
h2.rotulo { margin: 0 0 10px; }
.lista { display: flex; flex-direction: column; gap: 9px; }
.item { display: flex; align-items: center; gap: 12px; padding: 13px 14px; color: var(--texto); }
.corpo { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.apagado { color: var(--apagado-2); }
.seta { color: var(--apagado-2); }
.travada { padding: 14px; display: flex; flex-direction: column; gap: 11px; border-color: color-mix(in srgb, var(--travado) 40%, var(--borda)); }
.travada-topo { display: flex; align-items: flex-start; gap: 12px; }
.motivo { margin: 0; color: var(--texto-2); font-size: 14px; }
.recorte { display: flex; align-items: center; gap: 9px; width: 100%; min-height: 56px; padding: 0 13px; border-radius: var(--raio-p); border: 1px dashed var(--borda-forte); background: var(--superficie-2); color: var(--apagado); }
.botoes { display: flex; gap: 9px; }
.botao { flex: 1; min-height: var(--toque); border-radius: var(--raio-p); font-weight: 600; font-size: 14px; }
.principal { background: var(--acao); color: var(--acao-tinta); }
.secundario { background: var(--superficie-alta); color: var(--texto); border: 1px solid var(--borda-forte); }
.cheia { position: fixed; inset: 0; z-index: 60; background: #000; display: flex; flex-direction: column; padding: calc(var(--safe-topo) + 12px) 12px calc(var(--safe-base) + 12px); }
.fechar { align-self: flex-end; color: #fff; }
.moldura { flex: 1; display: grid; place-items: center; text-align: center; padding: 20px; }
</style>
