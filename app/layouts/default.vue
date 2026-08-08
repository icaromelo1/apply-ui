<script setup lang="ts">
const rota = useRoute();
// Telas de detalhe trocam a barra de abas por voltar no topo + barra de ação própria.
const telaDetalhe = computed(() => /^\/(vagas\/[^/]+|fontes\/[^/]+|assistida)/.test(rota.path));
</script>

<template>
  <div class="casca">
    <AvisoOffline />
    <main class="conteudo" :class="{ detalhe: telaDetalhe }">
      <slot />
    </main>
    <NavegacaoPrincipal v-if="!telaDetalhe" />
  </div>
</template>

<style scoped>
.casca {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.conteudo {
  flex: 1;
  padding-top: calc(var(--safe-topo) + 8px);
  padding-left: calc(var(--safe-esq) + 16px);
  padding-right: calc(var(--safe-dir) + 16px);
  /* Espaço para a barra inferior não cobrir o fim da lista. */
  padding-bottom: calc(var(--safe-base) + var(--altura-barra) + 20px);
}

.conteudo.detalhe {
  padding-bottom: calc(var(--safe-base) + 96px);
}

@media (min-width: 900px) {
  .conteudo {
    margin-left: 224px;
    padding: 28px 32px 48px;
    max-width: 1180px;
  }

  .conteudo.detalhe {
    padding-bottom: 48px;
  }
}
</style>
