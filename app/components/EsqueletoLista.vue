<script setup lang="ts">
// Esqueleto na forma real da tela — os números chegam onde vão ficar.
withDefaults(defineProps<{ linhas?: number }>(), { linhas: 4 });
</script>

<template>
  <div class="lista" aria-busy="true" aria-live="polite">
    <div v-for="n in linhas" :key="n" class="cartao linha">
      <div class="bloco nota" />
      <div class="corpo">
        <div class="bloco titulo" />
        <div class="bloco sub" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.lista {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.linha {
  display: flex;
  gap: 14px;
  padding: 14px;
  align-items: center;
}

.bloco {
  background: var(--superficie-alta);
  border-radius: 6px;
  animation: pulsar 1.4s ease-in-out infinite;
}

.bloco.nota {
  width: 38px;
  height: 26px;
  flex-shrink: 0;
}

.corpo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bloco.titulo {
  height: 14px;
  width: 72%;
}

.bloco.sub {
  height: 12px;
  width: 45%;
}

@keyframes pulsar {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 1; }
}
</style>
