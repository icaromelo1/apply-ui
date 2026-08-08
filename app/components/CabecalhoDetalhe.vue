<script setup lang="ts">
defineProps<{ voltarPara: string; voltarRotulo: string }>();
</script>

<template>
  <header class="topo">
    <NuxtLink :to="voltarPara" class="toque voltar">
      <Icone nome="voltar" />
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

</style>
