<script setup lang="ts">
import type { Moeda } from "~/composables/useDados";

const props = defineProps<{ moeda: Moeda; faixa: string }>();

// USD lima, EUR ciano, BRL neutro — a trilha em dólar/euro salta da lista.
const cor = computed(() => ({ USD: "var(--usd)", EUR: "var(--eur)", BRL: "var(--brl)" })[props.moeda]);
</script>

<template>
  <span class="mono faixa miudo" :style="{ color: cor }">
    <strong>{{ moeda }}</strong> {{ faixa }}
  </span>
</template>

<style scoped>
.faixa {
  white-space: nowrap;
  font-weight: 400;
}

.faixa strong {
  font-weight: 600;
  letter-spacing: 0.02em;
}
</style>
