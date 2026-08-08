<script setup lang="ts">
const { fontes } = useDados();
useHead({ title: "Fontes · Apply" });

const ativas = computed(() => fontes.filter((f) => f.ativa).length);
const pausadas = computed(() => fontes.filter((f) => f.pausada).length);
const semCred = computed(() => fontes.filter((f) => f.semCredencial).length);
</script>

<template>
  <div class="tela">
    <header>
      <h1>Fontes</h1>
      <p class="miudo carimbo">{{ ativas }} ativas · {{ pausadas }} pausadas · {{ semCred }} sem credencial</p>
    </header>

    <div class="lista">
      <article v-for="f in fontes" :key="f.id" class="cartao fonte" :class="{ off: !f.ativa }">
        <div class="topo">
          <div class="ident">
            <strong>{{ f.nome }}</strong>
            <span class="miudo tipo">{{ f.tipo }}</span>
          </div>
          <PilulaEstado v-if="f.pausada" estado="travado" texto="pausada" />
          <PilulaEstado v-else-if="f.semCredencial" estado="exige" texto="sem credencial" />
          <PilulaEstado v-else estado="correndo" texto="ativa" />
        </div>

        <!-- Salvaguarda anti-spam visível, não escondida em configuração. -->
        <MedidorRitmo v-if="f.ativa" :usado="f.usadoHoje" :teto="f.tetoDiario" :intervalo="f.intervaloMin" />

        <p v-if="f.pausada" class="aviso">{{ f.pausada }}</p>
        <p v-if="f.semCredencial" class="aviso exige-txt">{{ f.semCredencial }}</p>

        <div v-if="f.ativa" class="params">
          <span class="chip mono">{{ f.palavras.join(", ") }}</span>
          <span class="chip mono">janela {{ f.janela }}</span>
        </div>

        <div class="botoes">
          <button class="botao secundario">Ver retorno cru</button>
          <button class="botao secundario">{{ f.pausada ? "Reconfigurar" : "Configurar" }}</button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.tela { display: flex; flex-direction: column; gap: 16px; }
h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.03em; margin: 0; }
.carimbo { color: var(--apagado); margin: 2px 0 0; }
.lista { display: flex; flex-direction: column; gap: 10px; }
.fonte { padding: 14px; display: flex; flex-direction: column; gap: 11px; }
.fonte.off { opacity: 0.82; }
.topo { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.ident { display: flex; flex-direction: column; gap: 1px; }
.tipo { color: var(--apagado-2); font-family: var(--fonte-mono); }
.aviso { margin: 0; font-size: 13px; color: var(--texto-2); }
.exige-txt { color: var(--exige); }
.params { display: flex; gap: 7px; flex-wrap: wrap; }
.chip { font-size: 12px; padding: 3px 9px; border-radius: 999px; background: var(--superficie-alta); color: var(--apagado); }
.botoes { display: flex; gap: 9px; }
.botao { flex: 1; min-height: var(--toque); border-radius: var(--raio-p); font-size: 14px; font-weight: 600; }
.secundario { background: var(--superficie-alta); color: var(--texto); border: 1px solid var(--borda-forte); }
@media (min-width: 900px) { .lista { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); } }
</style>
