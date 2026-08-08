<script setup lang="ts">
const { contadorAcao } = useDados();
const rota = useRoute();

// Celular: 5 destinos no polegar. Desktop: o trilho abre os secundários que moram em "Mais".
const principais = [
  { para: "/", rotulo: "Hoje", icone: "hoje" },
  { para: "/vagas", rotulo: "Vagas", icone: "vagas" },
  { para: "/acao", rotulo: "Ação", icone: "acao", contador: true },
  { para: "/etapas", rotulo: "Etapas", icone: "etapas" },
];

const secundarios = [
  { para: "/fontes", rotulo: "Fontes", icone: "fontes" },
  { para: "/perfil", rotulo: "Perfil", icone: "perfil" },
  { para: "/curriculos", rotulo: "Currículos", icone: "curriculo" },
  { para: "/avisos", rotulo: "Avisos", icone: "aviso" },
];

const ativo = (para: string) => (para === "/" ? rota.path === "/" : rota.path.startsWith(para));
</script>

<template>
  <!-- CELULAR — barra inferior, acima da barra de gestos -->
  <nav class="barra" aria-label="Navegação principal">
    <NuxtLink
      v-for="d in principais"
      :key="d.para"
      :to="d.para"
      class="destino"
      :class="{ ativo: ativo(d.para) }"
      :aria-current="ativo(d.para) ? 'page' : undefined"
    >
      <Icone :nome="d.icone" class="icone" />
      <span class="miudo">{{ d.rotulo }}</span>
      <span v-if="d.contador && contadorAcao > 0" class="mono contador">{{ contadorAcao }}</span>
    </NuxtLink>

    <NuxtLink to="/mais" class="destino" :class="{ ativo: ativo('/mais') }">
      <Icone nome="mais" :tamanho="22" class="icone" />
      <span class="miudo">Mais</span>
    </NuxtLink>
  </nav>

  <!-- DESKTOP — o mesmo conjunto vira trilho lateral fixo -->
  <aside class="trilho" aria-label="Navegação principal">
    <div class="marca">
      <span class="logo" aria-hidden="true">↗</span>
      <strong>Apply</strong>
    </div>

    <NuxtLink
      v-for="d in principais"
      :key="d.para"
      :to="d.para"
      class="item"
      :class="{ ativo: ativo(d.para) }"
      :aria-current="ativo(d.para) ? 'page' : undefined"
    >
      <Icone :nome="d.icone" />
      {{ d.rotulo }}
      <span v-if="d.contador && contadorAcao > 0" class="mono contador-trilho">{{ contadorAcao }}</span>
    </NuxtLink>

    <hr />

    <NuxtLink v-for="d in secundarios" :key="d.para" :to="d.para" class="item" :class="{ ativo: ativo(d.para) }">
      <Icone :nome="d.icone" />
      {{ d.rotulo }}
    </NuxtLink>

    <div class="estado-worker">
      <span class="ponto" aria-hidden="true" />
      <div>
        <div class="miudo">worker ativo</div>
        <div class="miudo apagado">últ. varredura 09:41</div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.barra {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  display: flex;
  background: var(--superficie);
  border-top: 1px solid var(--borda);
  padding-bottom: var(--safe-base);
  padding-left: var(--safe-esq);
  padding-right: var(--safe-dir);
}

.destino {
  flex: 1;
  min-height: var(--toque);
  padding: 8px 2px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  position: relative;
  color: var(--apagado);
  font-size: 13px;
}

.destino.ativo {
  color: var(--acao);
}

.icone { color: inherit; }

.contador {
  position: absolute;
  top: 4px;
  left: 50%;
  margin-left: 6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--exige);
  color: var(--exige-tinta);
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trilho {
  display: none;
}

@media (min-width: 900px) {
  .barra {
    display: none;
  }

  .trilho {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 224px;
    z-index: 40;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 20px 12px;
    background: var(--superficie);
    border-right: 1px solid var(--borda);
    overflow-y: auto;
  }

  .marca {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 4px 10px 18px;
    font-size: 17px;
  }

  .logo {
    width: 26px;
    height: 26px;
    border-radius: 7px;
    background: var(--acao);
    color: var(--acao-tinta);
    display: grid;
    place-items: center;
    font-weight: 800;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 11px;
    min-height: var(--toque);
    padding: 0 10px;
    border-radius: var(--raio-p);
    color: var(--texto-2);
    font-size: 15px;
  }

  .item:hover {
    background: var(--superficie-alta);
  }

  .item.ativo {
    background: var(--acao-fraca);
    color: var(--acao);
  }

  .contador-trilho {
    margin-left: auto;
    min-width: 20px;
    padding: 1px 6px;
    border-radius: 999px;
    background: var(--exige);
    color: var(--exige-tinta);
    font-size: 12px;
    font-weight: 600;
    text-align: center;
  }

  hr {
    border: none;
    border-top: 1px solid var(--borda);
    margin: 10px 10px;
    width: calc(100% - 20px);
  }

  .estado-worker {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 10px;
    border-top: 1px solid var(--borda);
  }

  .ponto {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--correndo);
    flex-shrink: 0;
  }

  .apagado {
    color: var(--apagado-2);
  }
}
</style>
