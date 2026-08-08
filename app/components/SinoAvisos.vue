<script setup lang="ts">
/**
 * Sino da tela Hoje.
 *
 * Regra do design: avisos não lidos ficam aqui, nunca num banner que tampe
 * conteúdo durante a operação.
 */
const { avisos, naoLidos, marcarLido, marcarTodosLidos } = useAvisos();

const aberto = ref(false);
const painel = ref<HTMLElement | null>(null);

function abrirItem(id: string, para: string) {
  marcarLido(id);
  aberto.value = false;
  navigateTo(para);
}

// Fechar com Esc e ao tocar fora — em standalone não há barra do navegador para escapar.
function aoTeclar(e: KeyboardEvent) {
  if (e.key === "Escape") aberto.value = false;
}

function aoTocarFora(e: PointerEvent) {
  if (aberto.value && painel.value && !painel.value.contains(e.target as Node)) aberto.value = false;
}

onMounted(() => {
  window.addEventListener("keydown", aoTeclar);
  window.addEventListener("pointerdown", aoTocarFora);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", aoTeclar);
  window.removeEventListener("pointerdown", aoTocarFora);
});
</script>

<template>
  <div ref="painel" class="sino-area">
    <button
      class="toque sino"
      :aria-label="naoLidos.length ? `${naoLidos.length} avisos não lidos` : 'Avisos'"
      :aria-expanded="aberto"
      @click="aberto = !aberto"
    >
      <Icone nome="aviso" :tamanho="23" />
      <span v-if="naoLidos.length" class="mono bolha">{{ naoLidos.length }}</span>
    </button>

    <div v-if="aberto" class="painel cartao" role="dialog" aria-label="Avisos">
      <div class="topo">
        <span class="rotulo">Avisos</span>
        <button v-if="naoLidos.length" class="marcar miudo" @click="marcarTodosLidos">marcar todos lidos</button>
      </div>

      <button
        v-for="a in avisos"
        :key="a.id"
        class="aviso"
        :class="{ lido: a.lido }"
        @click="abrirItem(a.id, a.para)"
      >
        <span class="ponto" :class="a.tipo" aria-hidden="true" />
        <span class="corpo">
          <strong>{{ a.titulo }}</strong>
          <span class="miudo detalhe">{{ a.detalhe }}</span>
        </span>
        <span class="mono miudo quando">{{ a.quando }}</span>
      </button>

      <p v-if="!avisos.length" class="miudo vazio">Nada por aqui.</p>
    </div>
  </div>
</template>

<style scoped>
.sino-area {
  position: relative;
}

.sino {
  position: relative;
  color: var(--apagado);
}

.bolha {
  position: absolute;
  top: 4px;
  right: 2px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--exige);
  color: var(--exige-tinta);
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.painel {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 45;
  width: min(21rem, calc(100vw - 32px));
  padding: 4px 12px 8px;
  box-shadow: 0 12px 30px rgb(0 0 0 / 0.3);
}

.topo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0 6px;
}

.marcar {
  margin-left: auto;
  color: var(--acao);
  font-family: var(--fonte-mono);
  min-height: 32px;
}

.aviso {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  width: 100%;
  min-height: var(--toque);
  padding: 10px 0;
  border-top: 1px solid var(--borda);
  text-align: left;
  color: var(--texto);
}

.aviso.lido {
  opacity: 0.55;
}

.ponto {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.ponto.resposta {
  background: var(--correndo);
}

.ponto.travou {
  background: var(--travado);
}

.ponto.notaAlta {
  background: var(--acao);
}

.corpo {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 14px;
}

.detalhe {
  color: var(--apagado);
}

.quando {
  color: var(--apagado-2);
  white-space: nowrap;
}

.vazio {
  color: var(--apagado);
  padding: 14px 0;
  margin: 0;
  text-align: center;
}
</style>
