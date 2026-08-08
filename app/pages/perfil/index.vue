<script setup lang="ts">
const { lacunas, skills, pretensao } = useDados();
useHead({ title: "Perfil · Apply" });

const idioma = ref<"PT" | "EN">("PT");
</script>

<template>
  <div class="tela">
    <header class="cabeca">
      <h1>Perfil</h1>
      <div class="idiomas" role="group" aria-label="Idioma do perfil">
        <button v-for="i in (['PT', 'EN'] as const)" :key="i" class="idioma miudo" :class="{ on: idioma === i }" @click="idioma = i">
          {{ i }}
        </button>
      </div>
    </header>

    <!-- Lacunas como fila de trabalho, não como aviso passivo. -->
    <section class="cartao lacunas">
      <div class="topo">
        <span class="rotulo exige-rotulo">Lacunas</span>
        <span class="mono contador">{{ lacunas.length }}</span>
      </div>
      <p class="miudo intro">Perguntas que apareceram em formulários e o perfil não sabe responder:</p>
      <button v-for="l in lacunas" :key="l.pergunta" class="lacuna">
        <span>{{ l.pergunta }}</span>
        <span class="mono miudo vezes">{{ l.vezes }}×</span>
      </button>
    </section>

    <section>
      <h2 class="rotulo">Skills · anos e nível</h2>
      <div class="cartao bloco">
        <div v-for="s in skills" :key="s.nome" class="skill">
          <span>{{ s.nome }}</span>
          <span class="mono miudo">{{ s.anos }}a · {{ s.nivel }}</span>
        </div>
      </div>
    </section>

    <section>
      <h2 class="rotulo">Pretensão por moeda e regime</h2>
      <div class="cartao bloco">
        <div v-for="p in pretensao" :key="p.regime" class="skill">
          <span class="miudo">{{ p.regime }}</span>
          <FaixaMoeda :moeda="p.moeda" :faixa="p.faixa" />
        </div>
      </div>
    </section>

    <section>
      <h2 class="rotulo">Outros blocos</h2>
      <div class="lista">
        <button class="cartao atalho"><span>Banco de respostas padrão</span><span class="mono miudo">38 respostas</span></button>
        <button class="cartao atalho"><span>Experiências</span><span class="mono miudo">3 empregos</span></button>
        <button class="cartao atalho"><span>Identidade e contatos</span><span class="mono miudo">7 campos</span></button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tela { display: flex; flex-direction: column; gap: 22px; }
.cabeca { display: flex; align-items: center; gap: 12px; }
h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.03em; margin: 0; }
.idiomas { margin-left: auto; display: flex; gap: 4px; background: var(--superficie); border: 1px solid var(--borda); border-radius: 999px; padding: 3px; }
.idioma { min-height: 36px; padding: 0 14px; border-radius: 999px; color: var(--apagado); font-family: var(--fonte-mono); }
.idioma.on { background: var(--acao-fraca); color: var(--acao); }
h2.rotulo { margin: 0 0 10px; }
.lacunas { padding: 4px 14px 8px; border-color: var(--exige); background: var(--exige-fraca); }
.topo { display: flex; align-items: center; padding: 10px 0 6px; }
.exige-rotulo { color: var(--exige); }
.contador { margin-left: auto; font-weight: 700; color: var(--exige); }
.intro { margin: 0 0 6px; color: var(--texto-2); }
.lacuna { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; min-height: var(--toque); padding: 9px 0; border-top: 1px solid color-mix(in srgb, var(--exige) 28%, transparent); color: var(--texto); font-size: 14px; text-align: left; }
.vezes { color: var(--exige); }
.bloco { padding: 4px 14px; }
.skill { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: var(--toque); padding: 8px 0; border-bottom: 1px solid var(--borda); }
.skill:last-child { border-bottom: none; }
.lista { display: flex; flex-direction: column; gap: 9px; }
.atalho { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 54px; padding: 0 14px; color: var(--texto); font-size: 15px; text-align: left; }
.miudo { color: var(--apagado); }
</style>
