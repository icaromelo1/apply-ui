<script setup lang="ts">
import type { Estado } from "~/composables/useDados";

const props = defineProps<{ estado: Estado; texto?: string }>();

// Cor nunca sozinha: cada estado tem forma própria, legível sem cor.
// quadrado = espera você · círculo = automático · losango = travou
const mapa = {
  exige: { cor: "var(--exige)", fundo: "var(--exige-fraca)", rotulo: "exige você", forma: "quadrado" },
  correndo: { cor: "var(--correndo)", fundo: "var(--correndo-fraca)", rotulo: "correndo", forma: "circulo" },
  travado: { cor: "var(--travado)", fundo: "var(--travado-fraca)", rotulo: "travada", forma: "losango" },
} as const;

const item = computed(() => mapa[props.estado]);
</script>

<template>
  <span class="pilula miudo" :style="{ color: item.cor, background: item.fundo }">
    <i class="forma" :class="item.forma" :style="{ background: item.cor }" aria-hidden="true" />
    {{ texto ?? item.rotulo }}
  </span>
</template>

<style scoped>
.pilula {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 500;
  white-space: nowrap;
}

.forma {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
}

.forma.circulo {
  border-radius: 50%;
}

.forma.quadrado {
  border-radius: 1px;
}

.forma.losango {
  border-radius: 1px;
  transform: rotate(45deg);
}
</style>
