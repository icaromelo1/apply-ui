<script setup lang="ts">
useHead({ title: "Avisos · Apply" });

// Permissão pedida no momento certo — nunca na primeira abertura.
const permissao = ref<NotificationPermission | "indisponivel">("indisponivel");
const tipos = reactive({ resposta: true, travou: true, notaAlta: true, resumo: false });
const limiar = ref(85);
const silencio = ref(true);

onMounted(() => {
  permissao.value = "Notification" in window ? Notification.permission : "indisponivel";
});

async function pedir() {
  if (!("Notification" in window)) return;
  permissao.value = await Notification.requestPermission();
}
</script>

<template>
  <div class="tela">
    <header>
      <h1>Avisos</h1>
      <p class="miudo carimbo">no iPhone só funcionam com o app na tela inicial</p>
    </header>

    <section v-if="permissao !== 'granted'" class="cartao pedido">
      <strong>Quer saber na hora?</strong>
      <p class="miudo texto">
        A Gaudium respondeu esta semana. Com avisos ligados, você fica sabendo sem abrir o painel.
      </p>
      <div class="botoes">
        <button class="botao principal" :disabled="permissao === 'indisponivel'" @click="pedir">Ativar avisos</button>
        <button class="botao secundario">Agora não</button>
      </div>
      <p v-if="permissao === 'denied'" class="miudo negado">
        Bloqueado no navegador. Para reativar, ajuste nas configurações do site.
      </p>
      <p v-else-if="permissao === 'indisponivel'" class="miudo negado">
        Este navegador não expõe notificações. No iPhone, adicione à tela inicial primeiro.
      </p>
    </section>

    <section>
      <h2 class="rotulo">O que me avisar</h2>
      <div class="cartao bloco">
        <label class="opcao"><span>Empresa respondeu</span><input v-model="tipos.resposta" type="checkbox" /></label>
        <label class="opcao"><span>Travou esperando você</span><input v-model="tipos.travou" type="checkbox" /></label>
        <label class="opcao">
          <span>Vaga com nota alta<em class="miudo lim">limiar: nota ≥ {{ limiar }} · máx 3/dia</em></span>
          <input v-model="tipos.notaAlta" type="checkbox" />
        </label>
        <label class="opcao"><span>Resumo diário do funil</span><input v-model="tipos.resumo" type="checkbox" /></label>
      </div>
    </section>

    <section>
      <h2 class="rotulo">Silêncio noturno</h2>
      <div class="cartao bloco">
        <label class="opcao">
          <span>22:00–07:00<em class="miudo lim">acumula e entrega de manhã</em></span>
          <input v-model="silencio" type="checkbox" />
        </label>
      </div>
    </section>

    <p class="nota miudo">
      Dentro do app, avisos não lidos ficam no sino da tela Hoje — nada de banner tampando conteúdo durante a operação.
    </p>
  </div>
</template>

<style scoped>
.tela { display: flex; flex-direction: column; gap: 22px; }
h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.03em; margin: 0; }
.carimbo { color: var(--apagado); margin: 2px 0 0; }
h2.rotulo { margin: 0 0 10px; }
.pedido { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.texto { margin: 0; color: var(--texto-2); }
.botoes { display: flex; gap: 9px; }
.botao { flex: 1; min-height: var(--toque); border-radius: var(--raio-p); font-weight: 600; font-size: 14px; }
.botao:disabled { background: var(--superficie-alta); color: var(--apagado-2); cursor: not-allowed; }
.principal { background: var(--acao); color: var(--acao-tinta); }
.secundario { background: var(--superficie-alta); color: var(--texto); border: 1px solid var(--borda-forte); }
.negado { margin: 0; color: var(--exige); }
.bloco { padding: 4px 14px; }
.opcao { display: flex; align-items: center; justify-content: space-between; gap: 14px; min-height: 54px; padding: 8px 0; border-bottom: 1px solid var(--borda); cursor: pointer; }
.opcao:last-child { border-bottom: none; }
.opcao span { display: flex; flex-direction: column; gap: 2px; font-size: 15px; }
.lim { color: var(--apagado); font-style: normal; font-family: var(--fonte-mono); }
input[type="checkbox"] { width: 26px; height: 26px; accent-color: var(--acao); flex-shrink: 0; }
.nota { color: var(--apagado); margin: 0; }
</style>
