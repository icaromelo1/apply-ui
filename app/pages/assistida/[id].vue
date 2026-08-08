<script setup lang="ts">
const rota = useRoute();
const { vagaPorId, passosAssistida } = useDados();
const { desktop } = useLargura();

const vaga = computed(() => vagaPorId(String(rota.params.id)));
useHead({ title: () => `Assistida · ${vaga.value?.empresa ?? ""}` });

// Respostas locais — o passo a passo edita esta cópia, nunca os dados de origem.
const respostas = reactive<Record<string, string>>({});
const origens = reactive<Record<string, string>>({});

for (const passo of passosAssistida) {
  for (const campo of passo.campos) {
    respostas[campo.id] = campo.valor;
    origens[campo.id] = campo.origem;
  }
}

const totalPassos = passosAssistida.length + 1; // +1 = revisão final
const indice = ref(0);
const enviado = ref(false);
const editando = ref<string | null>(null);

const naRevisao = computed(() => indice.value === passosAssistida.length);
const passo = computed(() => passosAssistida[indice.value]);

const emBranco = computed(() => (passo.value ? passo.value.campos.filter((c) => !respostas[c.id]).length : 0));

const faltaObrigatoria = computed(() =>
  passo.value ? passo.value.campos.some((c) => c.obrigatorio && !respostas[c.id]?.trim()) : false,
);

const pendentesGlobais = computed(() =>
  passosAssistida.flatMap((p) => p.campos.filter((c) => c.obrigatorio && !respostas[c.id]?.trim())),
);

/**
 * Regra do design, idêntica nas duas larguras: enviar só existe depois de tudo visto.
 *
 * No celular "visto" é ter avançado até a revisão. No desktop os passos viram
 * âncoras de rolagem, então "visto" é ter cada seção passado pela viewport —
 * senão bastaria rolar direto ao fim e enviar sem ler.
 */
const vistos = reactive<Set<string>>(new Set());
const secoes = ref<HTMLElement[]>([]);
let observador: IntersectionObserver | null = null;

const todosVistos = computed(() => passosAssistida.every((p) => vistos.has(p.titulo)));
const podeEnviar = computed(() => pendentesGlobais.value.length === 0 && (desktop.value ? todosVistos.value : true));

watch([desktop, secoes], async () => {
  observador?.disconnect();
  if (!desktop.value) return;

  await nextTick();
  observador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) vistos.add((e.target as HTMLElement).dataset.passo ?? "");
      }
    },
    { threshold: 0.4 },
  );
  for (const s of secoes.value) if (s) observador.observe(s);
});

onBeforeUnmount(() => observador?.disconnect());

function irPara(titulo: string) {
  const alvo = secoes.value.find((s) => s?.dataset.passo === titulo);
  alvo?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function avancar() {
  if (faltaObrigatoria.value) return;
  if (indice.value < totalPassos - 1) indice.value += 1;
}

function voltar() {
  if (indice.value > 0) indice.value -= 1;
}

function responder(id: string, valor: string) {
  respostas[id] = valor;
  origens[id] = valor ? "perfil" : "branco";
}

function regenerar(id: string) {
  origens[id] = "ia";
  respostas[id] = `${respostas[id]} `.trim();
}

function enviar() {
  enviado.value = true;
}

const totalCampos = computed(() => Object.values(respostas).filter((v) => v.trim()).length);
const ehArea = (valor: string) => valor.length > 90;
</script>

<template>
  <div v-if="vaga" class="tela" :class="{ largo: desktop && !enviado }">
    <!-- 3 · CONFIRMAÇÃO — recibo do que saiu, e o que vem depois -->
    <template v-if="enviado">
      <div class="recibo">
        <Icone nome="concluido" :tamanho="52" class="ok" />
        <h1>Candidatura enviada</h1>
        <p class="miudo sub">{{ vaga.empresa }} · {{ vaga.titulo }}</p>
        <p class="miudo apagado">
          {{ new Date().toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" }) }} · via {{ vaga.fonte }}
        </p>

        <dl class="cartao resumo">
          <div><dt class="miudo">Campos enviados</dt><dd class="mono">{{ totalCampos }}</dd></div>
          <div><dt class="miudo">Currículo</dt><dd class="mono">EN · ênfase IA</dd></div>
          <div><dt class="miudo">Confirmação por e-mail</dt><dd class="mono monitorando">monitorando</dd></div>
        </dl>

        <p class="agora">Agora corre sozinho. Se a empresa responder, você recebe um aviso e ela aparece em Etapas.</p>

        <div class="acoes">
          <NuxtLink to="/etapas" class="botao principal">Ver em Etapas</NuxtLink>
          <NuxtLink to="/vagas" class="botao secundario">Voltar às vagas</NuxtLink>
        </div>
      </div>
    </template>

    <template v-else>
      <!-- DESKTOP — a vaga fica ao lado, e os passos viram âncoras de rolagem -->
      <aside v-if="desktop" class="contexto">
        <CabecalhoDetalhe :voltar-para="`/vagas/${vaga.id}`" voltar-rotulo="à vaga" />
        <div class="cartao ctx-cartao">
          <NotaAderencia :nota="vaga.nota" tamanho="g" />
          <h2>{{ vaga.titulo }}</h2>
          <p class="miudo sub">{{ vaga.empresa }} · {{ vaga.local }} · via {{ vaga.fonte }}</p>
          <FaixaMoeda :moeda="vaga.moeda" :faixa="vaga.faixa" />
          <p class="descricao-ctx">{{ vaga.descricao }}</p>
        </div>

        <nav class="ancoras" aria-label="Passos">
          <button
            v-for="p in passosAssistida"
            :key="p.titulo"
            class="ancora"
            :class="{ visto: vistos.has(p.titulo) }"
            @click="irPara(p.titulo)"
          >
            <span class="marca-visto" aria-hidden="true">{{ vistos.has(p.titulo) ? "✓" : "○" }}</span>
            {{ p.titulo }}
          </button>
        </nav>
      </aside>

      <div class="formulario">
        <CabecalhoDetalhe v-if="!desktop" :voltar-para="`/vagas/${vaga.id}`" voltar-rotulo="à vaga" />

        <header class="topo">
          <h1 class="titulo-tela">Candidatura assistida</h1>
          <strong>{{ vaga.empresa }} · {{ vaga.titulo }}</strong>
          <span class="miudo apagado">rascunho salvo automaticamente</span>
        </header>

        <!-- CELULAR — progresso por passo -->
        <div v-if="!desktop" class="progresso">
          <div class="barra">
            <span
              v-for="n in totalPassos"
              :key="n"
              class="segmento"
              :class="{ feito: n - 1 < indice, atual: n - 1 === indice }"
            />
          </div>
          <div class="progresso-txt">
            <span class="mono">Passo {{ indice + 1 }} de {{ totalPassos }}</span>
            <span class="miudo">· {{ naRevisao ? "Revisão final" : passo?.titulo }}</span>
            <span v-if="!naRevisao && emBranco" class="miudo alerta">{{ emBranco }} em branco</span>
          </div>
        </div>

        <!-- DESKTOP — todos os passos empilhados, marcados conforme passam pela tela -->
        <template v-if="desktop">
          <section
            v-for="p in passosAssistida"
            :key="p.titulo"
            ref="secoes"
            :data-passo="p.titulo"
            class="grupo-passo"
          >
            <h3 class="rotulo titulo-passo">{{ p.titulo }}</h3>
            <div
              v-for="campo in p.campos"
              :key="campo.id"
              class="cartao campo"
            >
              <div class="campo-topo">
                <label :for="campo.id" class="pergunta">
                  {{ campo.pergunta }}<span v-if="campo.obrigatorio" class="obr" aria-label="obrigatório"> *</span>
                </label>
                <OrigemResposta :origem="(origens[campo.id] as any)" />
              </div>

              <p v-if="campo.nota && !respostas[campo.id]" class="miudo nota-campo">{{ campo.nota }}</p>

              <div v-if="campo.opcoes" class="opcoes">
                <button
                  v-for="o in campo.opcoes"
                  :key="o"
                  class="opcao"
                  :class="{ on: respostas[campo.id] === o }"
                  @click="responder(campo.id, o)"
                >
                  {{ o }}
                </button>
              </div>

              <template v-else>
                <textarea
                  v-if="ehArea(campo.valor)"
                  :id="campo.id"
                  v-model="respostas[campo.id]"
                  class="entrada area"
                  rows="5"
                />
                <input v-else :id="campo.id" v-model="respostas[campo.id]" class="entrada" type="text" />

                <div v-if="origens[campo.id] === 'ia'" class="botoes-ia">
                  <button class="mini" @click="regenerar(campo.id)">Regenerar</button>
                </div>
              </template>
            </div>
          </section>
        </template>

        <!-- CELULAR — um passo por vez -->
        <template v-else-if="!naRevisao && passo">
          <section v-for="campo in passo.campos" :key="campo.id" class="cartao campo">
            <div class="campo-topo">
              <label :for="campo.id" class="pergunta">
                {{ campo.pergunta }}<span v-if="campo.obrigatorio" class="obr" aria-label="obrigatório"> *</span>
              </label>
              <OrigemResposta :origem="(origens[campo.id] as any)" />
            </div>

            <p v-if="campo.nota && !respostas[campo.id]" class="miudo nota-campo">{{ campo.nota }}</p>

            <div v-if="campo.opcoes" class="opcoes">
              <button
                v-for="o in campo.opcoes"
                :key="o"
                class="opcao"
                :class="{ on: respostas[campo.id] === o }"
                @click="responder(campo.id, o)"
              >
                {{ o }}
              </button>
            </div>

            <template v-else>
              <textarea
                v-if="editando === campo.id || ehArea(campo.valor)"
                :id="campo.id"
                v-model="respostas[campo.id]"
                class="entrada area"
                rows="6"
              />
              <input v-else :id="campo.id" v-model="respostas[campo.id]" class="entrada" type="text" />

              <div v-if="origens[campo.id] === 'ia'" class="botoes-ia">
                <button class="mini" @click="editando = editando === campo.id ? null : campo.id">
                  {{ editando === campo.id ? "Pronto" : "Editar" }}
                </button>
                <button class="mini" @click="regenerar(campo.id)">Regenerar</button>
              </div>
            </template>
          </section>
        </template>

        <!-- REVISÃO FINAL -->
        <template v-if="desktop || naRevisao">
          <h3 v-if="desktop" class="rotulo titulo-passo">Revisão final</h3>
          <section v-for="p in passosAssistida" :key="`rev-${p.titulo}`" class="cartao grupo">
            <div class="grupo-topo">
              <strong>{{ p.titulo }}</strong>
              <span class="mono miudo">{{ p.campos.length }} campos</span>
            </div>
            <ul class="resumo-campos">
              <li v-for="c in p.campos" :key="c.id">
                <span class="miudo apagado">{{ c.pergunta }}</span>
                <span class="valor" :class="{ vazio: !respostas[c.id] }">{{ respostas[c.id] || "— em branco" }}</span>
              </li>
            </ul>
          </section>

          <p v-if="pendentesGlobais.length" class="bloqueio miudo">
            {{ pendentesGlobais.length }} obrigatória(s) em branco — responda antes de enviar.
          </p>
          <p v-else-if="desktop && !todosVistos" class="bloqueio miudo">
            Passe por todos os passos antes de enviar — {{ passosAssistida.length - vistos.size }} ainda não foram vistos.
          </p>
        </template>

        <div class="acoes-fixas">
          <button v-if="!desktop && indice > 0" class="botao secundario estreito" @click="voltar">Voltar</button>

          <BotaoSegurar
            v-if="desktop || naRevisao"
            rotulo="Segure para enviar"
            :desabilitado="!podeEnviar"
            @concluido="enviar"
          />

          <button v-else class="botao principal" :disabled="faltaObrigatoria" @click="avancar">
            {{ faltaObrigatoria ? "Responda a obrigatória" : "Próximo passo" }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.tela {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.topo {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.titulo-tela {
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 2px;
}

.apagado {
  color: var(--apagado-2);
}

.progresso {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.barra {
  display: flex;
  gap: 4px;
}

.segmento {
  flex: 1;
  height: 4px;
  border-radius: 999px;
  background: var(--superficie-alta);
}

.segmento.feito {
  background: var(--acao);
}

.segmento.atual {
  background: var(--exige);
}

.progresso-txt {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--texto-2);
}

.alerta {
  margin-left: auto;
  color: var(--exige);
  font-family: var(--fonte-mono);
}

.grupo-passo {
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-margin-top: 20px;
}

.titulo-passo {
  margin: 12px 0 0;
}

.campo {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.campo-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.pergunta {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
}

.obr {
  color: var(--exige);
}

.nota-campo {
  margin: 0;
  color: var(--exige);
}

.entrada {
  width: 100%;
  min-height: var(--toque);
  padding: 11px 12px;
  border-radius: var(--raio-p);
  border: 1px solid var(--borda-forte);
  background: var(--superficie-2);
  color: var(--texto);
  font-family: inherit;
  font-size: 15px;
  line-height: 1.5;
}

.entrada.area {
  resize: vertical;
}

.entrada:focus {
  border-color: var(--acao);
  outline: none;
}

.opcoes {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
}

.opcao {
  flex: 1;
  min-width: 110px;
  min-height: var(--toque);
  border-radius: var(--raio-p);
  border: 1px solid var(--borda-forte);
  background: var(--superficie-2);
  color: var(--texto);
  font-weight: 600;
}

.opcao.on {
  border-color: var(--acao);
  background: var(--acao-fraca);
  color: var(--acao);
}

.botoes-ia {
  display: flex;
  gap: 8px;
}

.mini {
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--borda-forte);
  color: var(--texto-2);
  font-size: 13px;
}

.grupo {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.grupo-topo {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.resumo-campos {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.resumo-campos li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px solid var(--borda);
  padding-top: 8px;
}

.valor {
  font-size: 14px;
  color: var(--texto-2);
  overflow-wrap: anywhere;
}

.valor.vazio {
  color: var(--exige);
  font-family: var(--fonte-mono);
}

.bloqueio {
  color: var(--exige);
  background: var(--exige-fraca);
  border: 1px solid var(--exige);
  border-radius: var(--raio-p);
  padding: 11px 13px;
  margin: 0;
}

.acoes-fixas {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 35;
  display: flex;
  gap: 10px;
  align-items: stretch;
  padding: 12px 16px calc(12px + var(--safe-base));
  background: var(--superficie);
  border-top: 1px solid var(--borda);
}

.botao {
  flex: 1;
  min-height: 54px;
  border-radius: var(--raio);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
}

.botao:disabled {
  background: var(--superficie-alta);
  color: var(--apagado-2);
  cursor: not-allowed;
}

.principal {
  background: var(--acao);
  color: var(--acao-tinta);
}

.secundario {
  background: var(--superficie-alta);
  color: var(--texto);
  border: 1px solid var(--borda-forte);
}

.estreito {
  flex: 0 0 96px;
}

.recibo {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  padding-top: 28px;
}

.ok {
  color: var(--acao);
}

.recibo h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 6px 0 0;
}

.sub {
  color: var(--texto-2);
  margin: 0;
}

.resumo {
  width: 100%;
  max-width: 30rem;
  margin: 20px 0 0;
  padding: 6px 14px;
  display: flex;
  flex-direction: column;
}

.resumo > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid var(--borda);
}

.resumo > div:last-child {
  border-bottom: none;
}

.resumo dt {
  color: var(--apagado);
}

.resumo dd {
  margin: 0;
  font-size: 14px;
}

.monitorando {
  color: var(--correndo);
}

.agora {
  color: var(--texto-2);
  font-size: 14px;
  margin: 18px 0 0;
  max-width: 34rem;
}

.acoes {
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 30rem;
  margin-top: 22px;
}

@media (min-width: 900px) {
  .tela.largo {
    display: grid;
    grid-template-columns: 20rem minmax(0, 1fr);
    gap: 24px;
    align-items: start;
  }

  .contexto {
    position: sticky;
    top: 28px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ctx-cartao {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .ctx-cartao h2 {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 4px 0 0;
    line-height: 1.3;
  }

  .descricao-ctx {
    margin: 4px 0 0;
    color: var(--texto-2);
    font-size: 13px;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .ancoras {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .ancora {
    display: flex;
    align-items: center;
    gap: 9px;
    min-height: var(--toque);
    padding: 0 12px;
    border-radius: var(--raio-p);
    color: var(--apagado);
    font-size: 14px;
    text-align: left;
  }

  .ancora:hover {
    background: var(--superficie-alta);
  }

  .ancora.visto {
    color: var(--acao);
  }

  .marca-visto {
    font-family: var(--fonte-mono);
    font-size: 12px;
    width: 12px;
  }

  .acoes-fixas {
    position: static;
    padding: 8px 0 0;
    background: none;
    border: none;
    max-width: 24rem;
  }
}
</style>
