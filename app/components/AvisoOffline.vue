<script setup lang="ts">
// Offline nunca é tela branca: mantém o último estado e carimba a hora.
const online = ref(true);
const carimbo = ref("");

function atualizar() {
  const antes = online.value;
  online.value = navigator.onLine;
  if (antes && !online.value) {
    carimbo.value = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }
}

onMounted(() => {
  atualizar();
  window.addEventListener("online", atualizar);
  window.addEventListener("offline", atualizar);
});

onBeforeUnmount(() => {
  window.removeEventListener("online", atualizar);
  window.removeEventListener("offline", atualizar);
});
</script>

<template>
  <div v-if="!online" class="offline" role="status">
    <span class="material-symbols-outlined">cloud_off</span>
    <div>
      <strong class="miudo">Sem conexão — mostrando dados de {{ carimbo || "agora há pouco" }}</strong>
      <p class="miudo nota">Os números podem estar desatualizados. Ações abertas funcionam ao reconectar; nada se perde.</p>
    </div>
  </div>
</template>

<style scoped>
.offline {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: calc(var(--safe-topo) + 10px) 16px 10px;
  background: var(--exige-fraca);
  color: var(--exige);
  border-bottom: 1px solid var(--exige);
}

.nota {
  margin: 2px 0 0;
  color: var(--texto-2);
}

.material-symbols-outlined {
  font-size: 20px;
  flex-shrink: 0;
}
</style>
