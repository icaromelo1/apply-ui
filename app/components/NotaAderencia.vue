<script setup lang="ts">
const props = defineProps<{ nota: number; tamanho?: "p" | "m" | "g" }>();

// Regra do design: ≥80 lima, 60–79 âmbar, <60 neutro.
const cor = computed(() => (props.nota >= 80 ? "var(--acao)" : props.nota >= 60 ? "var(--exige)" : "var(--apagado)"));
const px = computed(() => ({ p: 20, m: 26, g: 40 })[props.tamanho ?? "m"]);
</script>

<template>
  <span
    class="mono nota"
    :style="{ color: cor, fontSize: px + 'px' }"
    :aria-label="`nota de aderência ${nota} de 100`"
  >
    {{ nota }}
  </span>
</template>

<style scoped>
.nota {
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
}
</style>
