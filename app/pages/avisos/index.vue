<script setup lang="ts">
useHead({ title: "Avisos · Apply" });

const { estado, prefs, pedirPermissao } = usePush();
const { avisos } = useAvisos();

// Permissão pedida no momento certo — depois da primeira resposta de empresa,
// nunca na primeira abertura.
const houveResposta = computed(() => avisos.value.some((a) => a.tipo === "resposta"));
const devePedir = computed(() => houveResposta.value && (estado.value === "padrao" || estado.value === "precisa-instalar"));
const adiado = ref(false);
</script>

<template>
  <div class="tela">
    <header>
      <h1>Avisos</h1>
      <p class="miudo carimbo">no iPhone só funcionam com o app na tela inicial</p>
    </header>

    <section v-if="devePedir && !adiado" class="cartao pedido">
      <strong>Quer saber na hora?</strong>
      <p class="miudo texto">
        A Gaudium respondeu esta semana. Com avisos ligados, você fica sabendo sem abrir o painel.
      </p>

      <ul class="exemplos">
        <li>Empresa respondeu</li>
        <li>Candidatura travou esperando você</li>
        <li>Vaga nova com nota ≥ {{ prefs.limiar }}</li>
      </ul>

      <template v-if="estado === 'precisa-instalar'">
        <p class="miudo instalar">
          No iPhone, toque em Compartilhar e depois em <strong>Adicionar à Tela de Início</strong>. Os avisos ficam
          disponíveis assim que o app abrir de lá.
        </p>
      </template>

      <div v-else class="botoes">
        <button class="botao principal" @click="pedirPermissao">Ativar avisos</button>
        <button class="botao secundario" @click="adiado = true">Agora não</button>
      </div>
    </section>

    <p v-else-if="estado === 'negada'" class="cartao aviso-negado miudo">
      Avisos bloqueados no navegador. Para reativar, ajuste a permissão nas configurações do site.
    </p>

    <p v-else-if="estado === 'concedida'" class="cartao aviso-ok miudo">
      Avisos ativos. Tocar num aviso abre direto o item que o gerou.
    </p>

    <section>
      <h2 class="rotulo">O que me avisar</h2>
      <div class="cartao bloco">
        <label class="opcao"><span>Empresa respondeu</span><input v-model="prefs.resposta" type="checkbox" /></label>
        <label class="opcao"><span>Travou esperando você</span><input v-model="prefs.travou" type="checkbox" /></label>
        <label class="opcao">
          <span>
            Vaga com nota alta
            <em class="miudo lim">limiar: nota ≥ {{ prefs.limiar }} · máx 3/dia</em>
          </span>
          <input v-model="prefs.notaAlta" type="checkbox" />
        </label>
        <label class="opcao"><span>Resumo diário do funil</span><input v-model="prefs.resumo" type="checkbox" /></label>
      </div>
    </section>

    <section v-if="prefs.notaAlta">
      <h2 class="rotulo">Limiar de nota</h2>
      <div class="cartao bloco">
        <label class="faixa">
          <input v-model.number="prefs.limiar" type="range" min="60" max="95" step="5" />
          <span class="mono valor">{{ prefs.limiar }}</span>
        </label>
      </div>
    </section>

    <section>
      <h2 class="rotulo">Silêncio noturno</h2>
      <div class="cartao bloco">
        <label class="opcao">
          <span>22:00–07:00<em class="miudo lim">acumula e entrega de manhã</em></span>
          <input v-model="prefs.silencioNoturno" type="checkbox" />
        </label>
      </div>
    </section>

    <p class="nota miudo">
      Dentro do app, avisos não lidos ficam no sino da tela Hoje — nada de banner tampando conteúdo durante a operação.
    </p>
  </div>
</template>

<style scoped>
.tela { display: flex; flex-direction: column; gap: 18px; }
h1 { font-size: 25px; font-weight: 800; letter-spacing: -0.03em; margin: 0; }
.carimbo { color: var(--apagado); margin: 1px 0 0; }
h2.rotulo { margin: 0 0 10px; }
.pedido { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.texto { margin: 0; color: var(--texto-2); }
.exemplos { margin: 0; padding-left: 1.1rem; display: flex; flex-direction: column; gap: 4px; color: var(--texto-2); font-size: 14px; }
.exemplos li::marker { color: var(--apagado-2); }
.instalar { margin: 0; color: var(--exige); }
.botoes { display: flex; gap: 9px; }
.botao { flex: 1; min-height: var(--toque); border-radius: var(--raio-p); font-weight: 600; font-size: 14px; }
.principal { background: var(--acao); color: var(--acao-tinta); }
.secundario { background: var(--superficie-alta); color: var(--texto); border: 1px solid var(--borda-forte); }
.aviso-negado { padding: 13px 15px; margin: 0; color: var(--exige); border-color: var(--exige); background: var(--exige-fraca); }
.aviso-ok { padding: 13px 15px; margin: 0; color: var(--correndo); border-color: var(--correndo); background: var(--correndo-fraca); }
.bloco { padding: 4px 14px; }
.opcao { display: flex; align-items: center; justify-content: space-between; gap: 14px; min-height: 54px; padding: 8px 0; border-bottom: 1px solid var(--borda); cursor: pointer; }
.opcao:last-child { border-bottom: none; }
.opcao span { display: flex; flex-direction: column; gap: 2px; font-size: 15px; }
.lim { color: var(--apagado); font-style: normal; font-family: var(--fonte-mono); }
input[type="checkbox"] { width: 26px; height: 26px; accent-color: var(--acao); flex-shrink: 0; }
.faixa { display: flex; align-items: center; gap: 14px; min-height: 54px; }
.faixa input[type="range"] { flex: 1; accent-color: var(--acao); }
.valor { font-size: 16px; font-weight: 600; color: var(--acao); min-width: 2ch; text-align: right; }
.nota { color: var(--apagado); margin: 0; }
</style>
