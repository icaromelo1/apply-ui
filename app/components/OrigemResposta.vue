<script setup lang="ts">
import type { Origem } from "~/composables/useDados";

const props = defineProps<{ origem: Origem }>();

const mapa = {
  perfil: { rotulo: "perfil", cor: "var(--apagado)", borda: "var(--borda-forte)", tracejado: false },
  ia: { rotulo: "IA", cor: "var(--eur)", borda: "var(--eur)", tracejado: false },
  branco: { rotulo: "em branco", cor: "var(--exige)", borda: "var(--exige)", tracejado: true },
} as const;

const item = computed(() => mapa[props.origem]);
</script>

<template>
  <span
    class="origem miudo"
    :style="{
      color: item.cor,
      borderColor: item.borda,
      borderStyle: item.tracejado ? 'dashed' : 'solid',
    }"
  >
    {{ item.rotulo }}
  </span>
</template>

<style scoped>
.origem {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 5px;
  border-width: 1px;
  font-family: var(--fonte-mono);
  line-height: 1.4;
}
</style>
