<script setup lang="ts">
definePageMeta({ layout: false });

useHead({ title: "Entrar · Apply" });

const rota = useRoute();
const senha = ref("");
const mostrando = ref(false);
const enviando = ref(false);
const erro = ref<string | null>(null);
const campo = ref<HTMLInputElement | null>(null);

const destino = computed(() => {
  const d = String(rota.query.destino ?? "/");
  // Só caminho interno: um destino externo viraria redirecionamento aberto.
  return d.startsWith("/") && !d.startsWith("//") ? d : "/";
});

async function entrar() {
  if (!senha.value || enviando.value) return;

  enviando.value = true;
  erro.value = null;

  try {
    await $fetch("/api/sessao/entrar", { method: "POST", body: { senha: senha.value } });
    // navigateTo com reload para o middleware do servidor rodar de novo com o cookie.
    await navigateTo(destino.value, { external: true });
  } catch (e) {
    const msg = (e as { statusMessage?: string })?.statusMessage;
    erro.value = msg ?? "Não deu para entrar. Tente de novo.";
    senha.value = "";
    await nextTick();
    campo.value?.focus();
  } finally {
    enviando.value = false;
  }
}

onMounted(() => campo.value?.focus());
</script>

<template>
  <div class="tela">
    <main class="caixa">
      <div class="marca">
        <span class="bloco" aria-hidden="true">↗</span>
        <h1>Apply</h1>
      </div>
      <p class="miudo intro">Painel de operação pessoal. Entre para continuar.</p>

      <form class="forma" @submit.prevent="entrar">
        <!-- Campo de usuário oculto: gerenciadores de senha só associam a
             credencial ao site quando existe um identificador no formulário. -->
        <input
          type="text"
          name="username"
          autocomplete="username"
          value="icaro"
          class="oculto"
          tabindex="-1"
          aria-hidden="true"
          readonly
        />

        <label class="rotulo" for="senha">Senha</label>
        <div class="linha-senha">
          <input
            id="senha"
            ref="campo"
            v-model="senha"
            :type="mostrando ? 'text' : 'password'"
            name="password"
            autocomplete="current-password"
            enterkeyhint="go"
            class="entrada"
            :aria-invalid="Boolean(erro)"
            :aria-describedby="erro ? 'erro-login' : undefined"
          />
          <button
            type="button"
            class="toque olho"
            :aria-label="mostrando ? 'Ocultar senha' : 'Mostrar senha'"
            @click="mostrando = !mostrando"
          >
            {{ mostrando ? "ocultar" : "mostrar" }}
          </button>
        </div>

        <p v-if="erro" id="erro-login" class="erro miudo" role="alert">{{ erro }}</p>

        <button type="submit" class="botao" :disabled="!senha || enviando">
          {{ enviando ? "Entrando…" : "Entrar" }}
        </button>
      </form>

      <p class="miudo rodape">A sessão dura 30 dias neste aparelho.</p>
    </main>
  </div>
</template>

<style scoped>
.tela {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--safe-topo) + 24px) 20px calc(var(--safe-base) + 24px);
  background: var(--fundo);
}

.caixa {
  width: 100%;
  max-width: 21rem;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.marca {
  display: flex;
  align-items: center;
  gap: 11px;
}

.bloco {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: var(--acao);
  color: var(--acao-tinta);
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 800;
}

h1 {
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0;
}

.intro {
  color: var(--apagado);
  margin: 0 0 6px;
}

.forma {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.oculto {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  border: 0;
}

.linha-senha {
  display: flex;
  gap: 8px;
}

.entrada {
  flex: 1;
  min-width: 0;
  min-height: 52px;
  padding: 12px 14px;
  border-radius: var(--raio-p);
  border: 1px solid var(--borda-forte);
  background: var(--superficie);
  color: var(--texto);
  font-family: inherit;
  font-size: 16px; /* 16px evita o zoom automático do iOS ao focar */
}

.entrada:focus {
  border-color: var(--acao);
  outline: none;
}

.entrada[aria-invalid="true"] {
  border-color: var(--travado);
}

.olho {
  padding: 0 12px;
  border-radius: var(--raio-p);
  border: 1px solid var(--borda-forte);
  background: var(--superficie);
  color: var(--apagado);
  font-family: var(--fonte-mono);
  font-size: 13px;
}

.erro {
  margin: 0;
  padding: 10px 12px;
  border-radius: var(--raio-p);
  background: var(--travado-fraca);
  border: 1px solid var(--travado);
  color: var(--travado);
}

.botao {
  min-height: 52px;
  margin-top: 4px;
  border-radius: var(--raio-p);
  background: var(--acao);
  color: var(--acao-tinta);
  font-weight: 700;
  font-size: 16px;
}

.botao:disabled {
  background: var(--superficie-alta);
  color: var(--apagado-2);
  cursor: not-allowed;
}

.rodape {
  color: var(--apagado-2);
  margin: 4px 0 0;
  text-align: center;
}
</style>
