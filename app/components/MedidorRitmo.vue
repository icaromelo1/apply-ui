<script setup lang="ts">
const props = defineProps<{ usado: number; teto: number; intervalo?: number }>();

// Salvaguarda anti-spam: âmbar perto do teto, trava no limite.
const pct = computed(() => Math.min(100, Math.round((props.usado / Math.max(1, props.teto)) * 100)));
const noLimite = computed(() => props.usado >= props.teto);
const perto = computed(() => !noLimite.value && pct.value >= 75);
const cor = computed(() => (noLimite.value ? "var(--travado)" : perto.value ? "var(--exige)" : "var(--acao)"));
</script>

<template>
  <div class="medidor">
    <div class="linha">
      <span class="rotulo">teto diário</span>
      <span class="mono valor" :style="{ color: cor }">{{ usado }}/{{ teto }}</span>
      <span v-if="intervalo" class="miudo intervalo">· intervalo {{ intervalo }}min</span>
    </div>
    <div
      class="trilho"
      role="progressbar"
      :aria-valuenow="usado"
      :aria-valuemin="0"
      :aria-valuemax="teto"
      :aria-label="`Envios de hoje: ${usado} de ${teto}`"
    >
      <div class="preenchido" :style="{ width: pct + '%', background: cor }" />
    </div>
    <p v-if="noLimite" class="miudo travou">Teto atingido — nada mais sai hoje por esta fonte.</p>
  </div>
</template>

<style scoped>
.medidor {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.linha {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.valor {
  font-weight: 600;
  font-size: 14px;
}

.intervalo {
  color: var(--apagado-2);
}

.trilho {
  height: 4px;
  border-radius: 999px;
  background: var(--superficie-alta);
  overflow: hidden;
}

.preenchido {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.travou {
  color: var(--travado);
  margin: 0;
}
</style>
