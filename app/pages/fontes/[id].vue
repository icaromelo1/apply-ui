<script setup lang="ts">
const rota = useRoute();
const { fontePorId } = useDados();

const fonte = computed(() => fontePorId(String(rota.params.id)));
useHead({ title: () => `${fonte.value?.nome ?? "Fonte"} · Apply` });

if (!fonte.value) {
  throw createError({ statusCode: 404, statusMessage: "Fonte não encontrada", fatal: true });
}

// Cópia editável — só vira configuração ao salvar.
const rascunho = reactive({
  palavras: [...(fonte.value?.palavras ?? [])],
  locais: [...(fonte.value?.locais ?? [])],
  janela: fonte.value?.janela ?? "7d",
  paginas: fonte.value?.paginas ?? 3,
  tetoDiario: fonte.value?.tetoDiario ?? 5,
  intervaloMin: fonte.value?.intervaloMin ?? 30,
});

const novaPalavra = ref("");
const novoLocal = ref("");

// Uma função por lista: no template o ref já vem desembrulhado, então receber
// um Ref como argumento daria undefined em runtime.
function adicionarPalavra() {
  const v = novaPalavra.value.trim();
  if (v && !rascunho.palavras.includes(v)) rascunho.palavras.push(v);
  novaPalavra.value = "";
}

function adicionarLocal() {
  const v = novoLocal.value.trim();
  if (v && !rascunho.locais.includes(v)) rascunho.locais.push(v);
  novoLocal.value = "";
}

// Teste da fonte: mostra o retorno cru, que é como se descobre por que ela parou de trazer vaga.
const testando = ref(false);
const retorno = ref<string | null>(null);

async function testar() {
  testando.value = true;
  retorno.value = null;
  await new Promise((r) => setTimeout(r, 900));
  retorno.value = JSON.stringify(
    {
      fonte: fonte.value?.id,
      parametros: { palavras: rascunho.palavras, locais: rascunho.locais, janela: rascunho.janela, paginas: rascunho.paginas },
      status: 200,
      vagas: 12,
      amostra: [{ titulo: "Senior Backend Engineer", empresa: "Acme", local: "remoto", faixa: "USD 5–7k" }],
    },
    null,
    2,
  );
  testando.value = false;
}

const JANELAS = ["24h", "72h", "7d", "30d"];
</script>

<template>
  <div v-if="fonte" class="tela">
    <CabecalhoDetalhe voltar-para="/fontes" voltar-rotulo="às fontes" />

    <header class="topo">
      <div>
        <h1>{{ fonte.nome }}</h1>
        <p class="miudo apagado">{{ fonte.tipo }}</p>
      </div>
      <PilulaEstado v-if="fonte.pausada" estado="travado" texto="pausada" />
      <PilulaEstado v-else-if="fonte.semCredencial" estado="exige" texto="sem credencial" />
      <PilulaEstado v-else estado="correndo" texto="ativa" />
    </header>

    <p v-if="fonte.pausada" class="aviso travado-bg">{{ fonte.pausada }}</p>

    <section class="cartao bloco">
      <h2 class="rotulo">Palavras-chave</h2>
      <div class="fichas">
        <span v-for="(p, i) in rascunho.palavras" :key="p" class="ficha">
          {{ p }}
          <button class="remover" :aria-label="`Remover ${p}`" @click="rascunho.palavras.splice(i, 1)">
            <Icone nome="fechar" :tamanho="13" />
          </button>
        </span>
      </div>
      <div class="adicionar">
        <input v-model="novaPalavra" class="entrada" placeholder="nova palavra" @keyup.enter="adicionarPalavra" />
        <button class="mais" aria-label="Adicionar palavra" @click="adicionarPalavra">+</button>
      </div>
    </section>

    <section class="cartao bloco">
      <h2 class="rotulo">Locais</h2>
      <div class="fichas">
        <span v-for="(l, i) in rascunho.locais" :key="l" class="ficha">
          {{ l }}
          <button class="remover" :aria-label="`Remover ${l}`" @click="rascunho.locais.splice(i, 1)">
            <Icone nome="fechar" :tamanho="13" />
          </button>
        </span>
      </div>
      <div class="adicionar">
        <input v-model="novoLocal" class="entrada" placeholder="novo local" @keyup.enter="adicionarLocal" />
        <button class="mais" aria-label="Adicionar local" @click="adicionarLocal">+</button>
      </div>
    </section>

    <section class="cartao bloco">
      <h2 class="rotulo">Janela e páginas</h2>
      <div class="janelas">
        <button
          v-for="j in JANELAS"
          :key="j"
          class="janela miudo"
          :class="{ on: rascunho.janela === j }"
          @click="rascunho.janela = j"
        >
          {{ j }}
        </button>
      </div>
      <label class="numero">
        <span class="miudo">Páginas por varredura</span>
        <input v-model.number="rascunho.paginas" class="entrada curta mono" type="number" min="1" max="10" />
      </label>
    </section>

    <!-- Salvaguarda: o teto vive aqui, editável e visível, não escondido no código. -->
    <section class="cartao bloco">
      <h2 class="rotulo">Ritmo — salvaguarda anti-spam</h2>
      <MedidorRitmo :usado="fonte.usadoHoje" :teto="rascunho.tetoDiario" :intervalo="rascunho.intervaloMin" />
      <label class="numero">
        <span class="miudo">Teto diário de envios</span>
        <input v-model.number="rascunho.tetoDiario" class="entrada curta mono" type="number" min="1" max="50" />
      </label>
      <label class="numero">
        <span class="miudo">Intervalo mínimo (min)</span>
        <input v-model.number="rascunho.intervaloMin" class="entrada curta mono" type="number" min="1" max="240" />
      </label>
      <p v-if="fonte.pausada" class="miudo alerta">
        Esta fonte sinalizou spam. Reativar exige teto de no máximo 5 por dia.
      </p>
    </section>

    <section v-if="fonte.credencial" class="cartao bloco">
      <h2 class="rotulo">Credencial</h2>
      <div class="cred">
        <span class="miudo">{{ fonte.credencial }}</span>
        <span v-if="fonte.semCredencial" class="miudo alerta">{{ fonte.semCredencial }}</span>
        <span v-else class="miudo ok">válida</span>
      </div>
      <button class="botao secundario">Renovar credencial</button>
    </section>

    <section class="cartao bloco">
      <h2 class="rotulo">Testar</h2>
      <button class="botao secundario" :disabled="testando" @click="testar">
        {{ testando ? "Consultando…" : "Testar e ver retorno cru" }}
      </button>
      <pre v-if="retorno" class="retorno mono">{{ retorno }}</pre>
    </section>

    <div class="acoes-fixas">
      <button class="botao principal">Salvar</button>
    </div>
  </div>
</template>

<style scoped>
.tela { display: flex; flex-direction: column; gap: 14px; }
.topo { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
h1 { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; margin: 0; }
.apagado { color: var(--apagado-2); margin: 2px 0 0; }
h2.rotulo { margin: 0; }
.bloco { padding: 14px; display: flex; flex-direction: column; gap: 11px; }
.aviso { margin: 0; padding: 11px 13px; border-radius: var(--raio-p); font-size: 13px; }
.travado-bg { background: var(--travado-fraca); color: var(--travado); border: 1px solid var(--travado); }
.fichas { display: flex; flex-wrap: wrap; gap: 7px; }
.ficha { display: inline-flex; align-items: center; gap: 5px; padding: 5px 6px 5px 11px; border-radius: 999px; background: var(--superficie-alta); color: var(--texto-2); font-family: var(--fonte-mono); font-size: 13px; }
.remover { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; color: var(--apagado); }
.remover:hover { background: var(--borda-forte); color: var(--texto); }
.adicionar { display: flex; gap: 8px; }
.entrada { flex: 1; min-height: var(--toque); padding: 10px 12px; border-radius: var(--raio-p); border: 1px solid var(--borda-forte); background: var(--superficie-2); color: var(--texto); font-family: inherit; font-size: 15px; }
.entrada:focus { border-color: var(--acao); outline: none; }
.entrada.curta { flex: 0 0 92px; text-align: right; }
.mais { width: var(--toque); min-height: var(--toque); border-radius: var(--raio-p); border: 1px solid var(--borda-forte); background: var(--superficie-alta); color: var(--texto); font-size: 20px; }
.janelas { display: flex; gap: 6px; }
.janela { flex: 1; min-height: var(--toque); border-radius: var(--raio-p); border: 1px solid var(--borda-forte); color: var(--apagado); font-family: var(--fonte-mono); }
.janela.on { border-color: var(--acao); background: var(--acao-fraca); color: var(--acao); }
.numero { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: var(--toque); }
.alerta { color: var(--exige); margin: 0; }
.ok { color: var(--correndo); }
.cred { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.botao { min-height: var(--toque); border-radius: var(--raio-p); font-weight: 600; font-size: 14px; }
.botao:disabled { opacity: 0.6; cursor: not-allowed; }
.secundario { background: var(--superficie-alta); color: var(--texto); border: 1px solid var(--borda-forte); }
.principal { background: var(--acao); color: var(--acao-tinta); flex: 1; min-height: 52px; font-size: 15px; }
.retorno { margin: 0; padding: 12px; border-radius: var(--raio-p); background: var(--superficie-2); border: 1px solid var(--borda); color: var(--texto-2); font-size: 12px; line-height: 1.55; overflow-x: auto; }
.acoes-fixas { position: fixed; bottom: 0; left: 0; right: 0; z-index: 35; display: flex; gap: 10px; padding: 12px 16px calc(12px + var(--safe-base)); background: var(--superficie); border-top: 1px solid var(--borda); }
@media (min-width: 900px) { .acoes-fixas { position: static; padding: 0; background: none; border: none; max-width: 300px; } }
</style>
