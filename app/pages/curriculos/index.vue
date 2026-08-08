<script setup lang="ts">
const { curriculos } = useDados();
useHead({ title: "Currículos · Apply" });

const enfases = reactive(Object.fromEntries(curriculos.map((c) => [c.id, c.enfaseAtiva])));
</script>

<template>
  <div class="tela">
    <header>
      <h1>Currículos</h1>
      <p class="miudo carimbo">gerados do perfil · sincronizados</p>
    </header>

    <div class="lista">
      <article v-for="c in curriculos" :key="c.id" class="cartao cv">
        <div class="topo">
          <div class="ident">
            <strong>{{ c.titulo }}</strong>
            <span class="miudo apagado">atualizado {{ c.atualizado }} · usado em {{ c.usos }} envios</span>
          </div>
          <span class="mono idioma">{{ c.idioma }}</span>
        </div>

        <div class="enfases">
          <span class="rotulo">ênfase</span>
          <div class="opcoes">
            <button
              v-for="e in c.enfases"
              :key="e"
              class="enfase miudo"
              :class="{ on: enfases[c.id] === e }"
              @click="enfases[c.id] = e"
            >
              {{ e }}
            </button>
          </div>
        </div>

        <div class="botoes">
          <button class="botao secundario">Pré-visualizar</button>
          <button class="botao secundario">Regenerar do perfil</button>
        </div>
      </article>
    </div>

    <p class="nota miudo">
      Ao abrir uma candidatura, o CV do idioma certo entra com a ênfase sugerida pela nota — trocável ali mesmo, sem sair do fluxo.
    </p>
  </div>
</template>

<style scoped>
.tela { display: flex; flex-direction: column; gap: 16px; }
h1 { font-size: 25px; font-weight: 800; letter-spacing: -0.03em; margin: 0; }
.carimbo { color: var(--apagado); margin: 1px 0 0; }
.lista { display: flex; flex-direction: column; gap: 10px; }
.cv { padding: 14px; display: flex; flex-direction: column; gap: 13px; }
.topo { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.ident { display: flex; flex-direction: column; gap: 2px; }
.apagado { color: var(--apagado-2); }
.idioma { font-size: 13px; font-weight: 600; padding: 3px 10px; border-radius: 6px; background: var(--acao-fraca); color: var(--acao); }
.enfases { display: flex; flex-direction: column; gap: 7px; }
.opcoes { display: flex; gap: 7px; flex-wrap: wrap; }
.enfase { min-height: 38px; padding: 0 13px; border-radius: 999px; border: 1px solid var(--borda-forte); color: var(--apagado); font-family: var(--fonte-mono); }
.enfase.on { border-color: var(--acao); background: var(--acao-fraca); color: var(--acao); }
.botoes { display: flex; gap: 9px; }
.botao { flex: 1; min-height: var(--toque); border-radius: var(--raio-p); font-size: 14px; font-weight: 600; }
.secundario { background: var(--superficie-alta); color: var(--texto); border: 1px solid var(--borda-forte); }
.nota { color: var(--apagado); margin: 0; }
@media (min-width: 900px) { .lista { display: grid; grid-template-columns: repeat(auto-fit, minmax(330px, 1fr)); } }
</style>
