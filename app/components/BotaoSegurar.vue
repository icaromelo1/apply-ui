<script setup lang="ts">
const props = withDefaults(defineProps<{ rotulo: string; duracao?: number; desabilitado?: boolean }>(), {
  duracao: 1500,
});

const emit = defineEmits<{ concluido: [] }>();

const progresso = ref(0);
const segurando = ref(false);
let inicio = 0;
let quadro: number | null = null;

function avancar() {
  // Um quadro pode estar agendado quando o dedo sai; sem esta guarda ele
  // concluiria a acao depois do cancelamento.
  if (!segurando.value) return;

  const decorrido = performance.now() - inicio;
  progresso.value = Math.min(1, decorrido / props.duracao);

  if (progresso.value >= 1) {
    parar();
    emit("concluido");
    return;
  }
  quadro = requestAnimationFrame(avancar);
}

function comecar() {
  if (props.desabilitado || segurando.value) return;
  segurando.value = true;
  inicio = performance.now();
  quadro = requestAnimationFrame(avancar);
}

function parar() {
  segurando.value = false;
  progresso.value = 0;
  if (quadro !== null) {
    cancelAnimationFrame(quadro);
    quadro = null;
  }
}

// Teclado: Enter/Espaço mantidos pressionados têm o mesmo efeito do toque longo.
function teclaBaixo(e: KeyboardEvent) {
  if (e.repeat) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    comecar();
  }
}

onBeforeUnmount(parar);
</script>

<template>
  <button
    class="segurar"
    :class="{ ativo: segurando, off: desabilitado }"
    :disabled="desabilitado"
    :aria-label="`${rotulo} — pressione e segure`"
    @pointerdown.prevent="comecar"
    @pointerup="parar"
    @pointerleave="parar"
    @pointercancel="parar"
    @keydown="teclaBaixo"
    @keyup="parar"
    @blur="parar"
    @contextmenu.prevent
  >
    <span class="preenche" :style="{ transform: `scaleX(${progresso})` }" aria-hidden="true" />
    <span class="conteudo">
      <span class="rotulo-btn">{{ rotulo }}</span>
      <span class="miudo dica">{{ segurando ? "solta = cancela" : "1,5s" }}</span>
    </span>
  </button>
</template>

<style scoped>
.segurar {
  position: relative;
  width: 100%;
  min-height: 54px;
  border-radius: var(--raio);
  background: var(--acao);
  color: var(--acao-tinta);
  overflow: hidden;
  isolation: isolate;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.segurar.off {
  background: var(--superficie-alta);
  color: var(--apagado-2);
  cursor: not-allowed;
}

/* A barra cresce por baixo do texto: o progresso é a própria confirmação. */
.preenche {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.24);
  transform-origin: left center;
  transform: scaleX(0);
  z-index: -1;
}

.conteudo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
}

.rotulo-btn {
  font-weight: 700;
  font-size: 16px;
}

.dica {
  opacity: 0.75;
  font-family: var(--fonte-mono);
}

.segurar.ativo .dica {
  opacity: 1;
}
</style>
