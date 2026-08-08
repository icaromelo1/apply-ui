<script setup lang="ts">
useHead({ title: "Mais · Apply" });

const tema = ref<"sistema" | "claro" | "escuro">("sistema");

watch(tema, (t) => {
  const raiz = document.documentElement;
  if (t === "sistema") raiz.removeAttribute("data-tema");
  else raiz.setAttribute("data-tema", t);
});

async function sair() {
  await $fetch("/api/sessao/sair", { method: "POST" });
  await navigateTo("/entrar", { external: true });
}

const destinos = [
  { para: "/fontes", rotulo: "Fontes", icone: "fontes", nota: "9 ativas · 2 pausadas" },
  { para: "/perfil", rotulo: "Perfil", icone: "perfil", nota: "4 lacunas" },
  { para: "/curriculos", rotulo: "Currículos", icone: "curriculo", nota: "PT e EN" },
  { para: "/avisos", rotulo: "Avisos", icone: "aviso", nota: "configurar" },
];
</script>

<template>
  <div class="tela">
    <header><h1>Mais</h1></header>

    <div class="lista">
      <NuxtLink v-for="d in destinos" :key="d.para" :to="d.para" class="cartao item">
        <Icone :nome="d.icone" class="icone" />
        <div class="corpo">
          <strong>{{ d.rotulo }}</strong>
          <span class="miudo apagado">{{ d.nota }}</span>
        </div>
        <Icone nome="direita" class="seta" />
      </NuxtLink>
    </div>

    <section>
      <h2 class="rotulo">Aparência</h2>
      <div class="temas" role="group" aria-label="Tema">
        <button
          v-for="t in (['sistema', 'claro', 'escuro'] as const)"
          :key="t"
          class="tema miudo"
          :class="{ on: tema === t }"
          @click="tema = t"
        >
          {{ t }}
        </button>
      </div>
      <p class="nota miudo">Segue o sistema por padrão — claro de dia, escuro à noite.</p>
    </section>

    <section>
      <h2 class="rotulo">Sessão</h2>
      <button class="cartao sair" @click="sair">Sair da conta</button>
    </section>
  </div>
</template>

<style scoped>
.tela { display: flex; flex-direction: column; gap: 22px; }
h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.03em; margin: 0; }
h2.rotulo { margin: 0 0 10px; }
.lista { display: flex; flex-direction: column; gap: 9px; }
.item { display: flex; align-items: center; gap: 13px; min-height: 62px; padding: 0 14px; color: var(--texto); }
.icone { color: var(--apagado); font-size: 22px; }
.corpo { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.apagado { color: var(--apagado-2); }
.seta { color: var(--apagado-2); }
.temas { display: flex; gap: 6px; background: var(--superficie); border: 1px solid var(--borda); border-radius: 999px; padding: 4px; }
.tema { flex: 1; min-height: var(--toque); border-radius: 999px; color: var(--apagado); font-family: var(--fonte-mono); }
.tema.on { background: var(--acao-fraca); color: var(--acao); }
.nota { color: var(--apagado); margin: 10px 0 0; }
.sair { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 54px; color: var(--travado); font-size: 15px; font-weight: 600; }
</style>
