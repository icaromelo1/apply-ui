<script setup lang="ts">
defineProps<{ voltarPara: string; voltarRotulo: string }>();
</script>

<template>
  <header class="topo">
    <NuxtLink :to="voltarPara" class="toque voltar">
      <span class="material-symbols-outlined">arrow_back</span>
      <span class="miudo">{{ voltarRotulo }}</span>
    </NuxtLink>
    <slot />
  </header>
</template>

<style scoped>
.topo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  min-height: var(--toque);
}

.voltar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--apagado);
  padding-right: 8px;
}

.material-symbols-outlined {
  font-size: 22px;
}
</style>
