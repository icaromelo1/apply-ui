<script setup lang="ts">
// O padrao do Nuxt (lang="en-US") vence o app.head.htmlAttrs do nuxt.config,
// entao a definicao precisa vir daqui. Importa para leitor de tela: com o
// idioma errado, texto em portugues sai com fonemas de ingles.
useHead({ htmlAttrs: { lang: "pt-BR" } });
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
