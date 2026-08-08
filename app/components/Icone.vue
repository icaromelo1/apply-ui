<script setup lang="ts">
/**
 * Ícones em SVG inline.
 *
 * Substitui a fonte Material Symbols do @quasar/extras, que pesa 3,8 MB — inaceitável
 * em rede móvel e acima do limite de precache do service worker, o que deixaria os
 * ícones quebrados justamente no modo offline.
 */
const props = withDefaults(defineProps<{ nome: string; tamanho?: number }>(), { tamanho: 22 });

// Traçado, não preenchido: mantém peso visual coerente em qualquer tamanho.
const tracos: Record<string, string> = {
  hoje: "M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
  vagas: "M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M4 7h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1ZM3 12h18",
  acao: "M12 8v4l2.5 2.5M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z",
  etapas: "M4 7h6M14 7h6M4 17h6M14 17h6M12 4v16",
  mais: "M6 12h.01M12 12h.01M18 12h.01",
  fontes: "M12 3v10m0 0 3.5-3.5M12 13 8.5 9.5M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3",
  perfil: "M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 20a6 6 0 0 1 12 0M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z",
  curriculo: "M14 3v5h5M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8l-4-5ZM9 13h6M9 17h4",
  aviso: "M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6M10.5 20a2 2 0 0 0 3 0",
  direita: "m9 6 6 6-6 6",
  voltar: "M19 12H5m0 0 6-6m-6 6 6 6",
  semRede: "M3 3l18 18M7.5 8A5.5 5.5 0 0 1 18 9a3.5 3.5 0 0 1 2.5 6M17 18H7a4 4 0 0 1-.9-7.9",
  imagem: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM3 16l4.5-4.5 4 4L15 12l6 6M9 9.5h.01",
  fechar: "M6 6l12 12M18 6 6 18",
  concluido: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 12.5l2.5 2.5 4.5-5",
};

const traco = computed(() => tracos[props.nome] ?? tracos.mais);
// O ponto do "mais" e do placeholder de imagem precisa de ponta redonda visível.
const pontilhado = computed(() => props.nome === "mais");
</script>

<template>
  <svg
    :width="tamanho"
    :height="tamanho"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="pontilhado ? 2.6 : 1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    class="icone"
  >
    <path :d="traco" />
  </svg>
</template>

<style scoped>
.icone {
  display: block;
  flex-shrink: 0;
}
</style>
